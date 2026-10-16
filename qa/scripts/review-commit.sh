#!/usr/bin/env bash
# Check out an exact commit of the storefront into a QA-owned directory and run its
# documented checks. Never writes to the implementer's checkout, never pushes.
#
# Usage: qa/scripts/review-commit.sh <git-url-or-local-repo> <branch-or-sha> [workdir]
#   workdir defaults to $QA_WORKDIR or ../qa-review (outside this repo).
# Output: <this repo>/qa/results/<sha>/{meta.txt,*.log,summary.txt}
set -uo pipefail

src="${1:?git url or path}"; ref="${2:?branch or sha}"
here="$(cd "$(dirname "$0")/../.." && pwd)"
work="${3:-${QA_WORKDIR:-$here/../qa-review}}"
mirror="$work/mirror"

mkdir -p "$work"
if [[ ! -d "$mirror/.git" ]]; then
  git clone --no-checkout --filter=blob:none "$src" "$mirror" || exit 1
fi
# Fetch the ref itself if the server allows (branch name or full SHA); otherwise fetch all
# branches and resolve locally. Never fall back to whatever FETCH_HEAD happens to hold.
if git -C "$mirror" fetch --no-tags origin "$ref" 2>/dev/null; then
  sha=$(git -C "$mirror" rev-parse --verify "FETCH_HEAD^{commit}") || exit 1
else
  git -C "$mirror" fetch --no-tags origin '+refs/heads/*:refs/remotes/origin/*' || exit 1
  sha=$(git -C "$mirror" rev-parse --verify --quiet "$ref^{commit}" || git -C "$mirror" rev-parse --verify --quiet "origin/$ref^{commit}") \
    || { echo "cannot resolve ref '$ref'" >&2; exit 1; }
fi
if [[ "$ref" =~ ^[0-9a-f]{7,40}$ && "$sha" != "$ref"* ]]; then
  echo "resolved $ref to $sha - refusing mismatched review" >&2; exit 1
fi
co="$work/review-${sha:0:12}"
[[ -d "$co" ]] || git -C "$mirror" worktree add --detach "$co" "$sha" || exit 1

out="$here/qa/results/$sha"; mkdir -p "$out"
{
  echo "reviewed_ref: $ref"
  echo "reviewed_sha: $sha"
  echo "source: $src"
  echo "checked_out_at: $(date -u +%FT%TZ)"
  echo "node: $(node --version 2>/dev/null)  npm: $(npm --version 2>/dev/null)"
  git -C "$co" log -1 --format='commit_date: %cI%nsubject: %s'
} > "$out/meta.txt"
cat "$out/meta.txt"

summary="$out/summary.txt"; : > "$summary"
run() { # name, command...
  local name="$1"; shift
  echo "--- $name: $*"
  ( cd "$co" && "$@" ) > "$out/$name.log" 2>&1
  local rc=$?
  printf '%-12s exit=%-3s %s\n' "$name" "$rc" "$*" | tee -a "$summary"
  return $rc
}

if [[ ! -f "$co/package.json" ]]; then
  echo "no package.json at $sha - nothing to build" | tee -a "$summary"
else
  if   [[ -f "$co/pnpm-lock.yaml" ]]; then pm=pnpm; run install pnpm install --frozen-lockfile
  elif [[ -f "$co/yarn.lock" ]];      then pm=yarn; run install yarn install --frozen-lockfile
  elif [[ -f "$co/package-lock.json" ]]; then pm=npm; run install npm ci
  else pm=npm; echo "WARNING: no lockfile committed" | tee -a "$summary"; run install npm install --no-audit --no-fund
  fi
  # Only the scripts the project itself defines; record absent ones explicitly.
  # Same order as the documented run sequence: tests, build, then checks over the build output.
  for s in lint typecheck test build check test:e2e; do
    if node -e "process.exit(require('$co/package.json').scripts?.['$s']?0:1)"; then
      run "${s//:/-}" "$pm" run "$s"
    else
      printf '%-12s NOT DEFINED\n' "$s" | tee -a "$summary"
    fi
  done
  run audit npm audit --omit=dev --audit-level=high || true
fi
"$here/qa/scripts/secret-scan.sh" "$co" > "$out/secret-scan.log" 2>&1
printf '%-12s exit=%-3s\n' secret-scan "$?" | tee -a "$summary"
echo "review checkout: $co"
echo "results: $out"
