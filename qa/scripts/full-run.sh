#!/usr/bin/env bash
# One full QA round for an implementation commit, in the order qa/README.md documents:
# project checks (review-commit.sh), domain contract tests, browser smoke in preview and with the
# live fixture, edge probes, axe, image audit, image provenance, the emulated slow-network run
# and review screenshots.
#
#   QA_WORKDIR=<scratch>/qa-review AXE_PATH=<scratch>/axe/node_modules/axe-core/axe.min.js \
#     qa/scripts/full-run.sh <git-url> <branch-or-sha> [port]
#
# Writes qa/results/<sha>/full-run.txt (one line per check with its exit code) and exits 1 if any
# check failed. Screenshots go to $SCREENS_DIR (default <workdir>/screens-<sha12>), outside the repo.
set -uo pipefail

src="${1:?git url}"; ref="${2:?branch or sha}"; port="${3:-4173}"
here="$(cd "$(dirname "$0")/../.." && pwd)"
work="${QA_WORKDIR:-$here/../qa-review}"
base="http://127.0.0.1:$port"

if curl -fsS -o /dev/null "$base/" 2>/dev/null; then
  echo "port $port already serves something; stop it first so the run cannot test a stale build" >&2; exit 2
fi

tmp=$(mktemp)
"$here/qa/scripts/review-commit.sh" "$src" "$ref" "$work" | tee "$tmp"
co=$(sed -n 's/^review checkout: //p' "$tmp"); out=$(sed -n 's/^results: //p' "$tmp"); rm -f "$tmp"
[[ -n "$co" && -n "$out" && -d "$co/dist" ]] || { echo "no review checkout or build output; browser checks were NOT run" >&2; exit 1; }
sha=$(basename "$out")
sum="$out/full-run.txt"
fail=0
{ echo "reviewed: $sha"; echo "date: $(date -u +%FT%TZ)"; } > "$sum"
if [[ -f "$out/summary.txt" ]]; then
  cat "$out/summary.txt" >> "$sum"
  grep -vE '^audit ' "$out/summary.txt" | grep -qE 'exit=[1-9]' && fail=1
fi

step() {
  local name=$1; shift
  "$@" > "$out/$name.log" 2>&1; local rc=$?
  [[ $rc -ne 0 ]] && fail=1
  printf '%-12s exit=%-3s %s\n' "$name" "$rc" "$(grep -v '^\s*$' "$out/$name.log" | tail -1 | cut -c1-150)" | tee -a "$sum"
}

( cd "$co" && PORT=$port exec node scripts/serve.mjs ) > "$out/serve.log" 2>&1 &
srv=$!
trap 'kill "$srv" 2>/dev/null' EXIT
curl -fsS -o /dev/null --retry 30 --retry-connrefused --retry-delay 1 "$base/" \
  || { echo "server did not start; browser checks were NOT run" | tee -a "$sum"; exit 1; }

cd "$here" || exit 1
step domain     env DOMAIN_DIR="$co" node --test 'qa/domain/*.test.mjs' 'qa/lib/*.test.mjs'
step smoke      env BASE_URL="$base" QA_SHA="$sha" CATALOG_PATH=/shop/ CART_PATH=/cart/ node qa/e2e/storefront-smoke.mjs
step smoke-live env QA_LIVE_FIXTURE=1 OUT_DIR="$out/browser-live" BASE_URL="$base" QA_SHA="$sha" CATALOG_PATH=/shop/ CART_PATH=/cart/ node qa/e2e/storefront-smoke.mjs
step edge       env BASE_URL="$base" node qa/e2e/edge-probes.mjs
step axe        env AXE_PATH="${AXE_PATH:?set AXE_PATH}" BASE_URL="$base" QA_SHA="$sha" node qa/e2e/axe-audit.mjs
step images     env BASE_URL="$base" QA_SHA="$sha" node qa/e2e/image-audit.mjs
step provenance bash -c 'python3 -I "$0" "$1"/public/assets/*' qa/scripts/image-provenance.py "$co"
step perf       env BASE_URL="$base" QA_SHA="$sha" node qa/e2e/throttled-perf.mjs
step screens    env BASE_URL="$base" OUT_DIR="${SCREENS_DIR:-$work/screens-${sha:0:12}}" node qa/e2e/screens.mjs

echo "overall: $([[ $fail -eq 0 ]] && echo PASS || echo FAIL)" | tee -a "$sum"
exit $fail
