#!/usr/bin/env bash
# QA secret / client-exposure scan over the TRACKED files of a git checkout.
# Usage: qa/scripts/secret-scan.sh <path-to-review-checkout>
# Exit 0 = no high findings, 1 = high findings, 2 = usage error.
# Read-only: never modifies the checkout it scans.
set -uo pipefail

repo="${1:-}"
if [[ -z "$repo" || ! -d "$repo/.git" && ! -f "$repo/.git" ]]; then
  echo "usage: $0 <git checkout>" >&2
  exit 2
fi

high=0
report() { # severity label pattern
  local sev="$1" label="$2" pat="$3" hits
  hits=$(git -C "$repo" grep -nIE -e "$pat" -- . ':!*.lock' ':!package-lock.json' ':!pnpm-lock.yaml' ':!qa/scripts/secret-scan.sh' 2>/dev/null | cut -c1-200)
  if [[ -n "$hits" ]]; then
    echo "[$sev] $label"
    echo "$hits" | sed 's/^/    /' | head -20
    [[ "$sev" == HIGH ]] && high=1
  fi
}

echo "secret-scan: $(git -C "$repo" rev-parse HEAD 2>/dev/null || echo '?') in $repo"

# Committed env files (examples are fine).
envs=$(git -C "$repo" ls-files | grep -E '(^|/)\.env(\.[^/]*)?$' | grep -vE '\.(example|sample|template)$')
if [[ -n "$envs" ]]; then echo "[HIGH] committed env file(s):"; echo "$envs" | sed 's/^/    /'; high=1; fi

report HIGH 'Stripe secret / restricted / webhook key' '(sk|rk)_(live|test)_[0-9A-Za-z]{10,}|whsec_[0-9A-Za-z]{10,}'
report HIGH 'Private key block' '-----BEGIN ([A-Z]+ )?PRIVATE KEY-----'
report HIGH 'AWS access key id' 'AKIA[0-9A-Z]{16}'
report HIGH 'GitHub / Slack token' 'gh[pousr]_[0-9A-Za-z]{30,}|github_pat_[0-9A-Za-z_]{40,}|xox[abprs]-[0-9A-Za-z-]{10,}'
report HIGH 'Google API key' 'AIza[0-9A-Za-z_-]{35}'
report HIGH 'Secret exposed through a client-bundled env prefix' '(NEXT_PUBLIC|VITE|PUBLIC|REACT_APP|EXPO_PUBLIC)_[A-Z0-9_]*(SECRET|PRIVATE|PASSWORD|PASS|TOKEN|SMTP)[A-Z0-9_]*'
report HIGH 'Hard-coded SMTP / DB credential assignment' '(SMTP_(PASS|PASSWORD)|DB_PASSWORD|DATABASE_URL)[[:space:]]*[:=][[:space:]]*["'"'"']?[^"'"'"'[:space:]$<{]{6,}'
report MEDIUM 'Credential-looking literal' '(password|passwd|secret|api[_-]?key)["'"'"']?[[:space:]]*[:=][[:space:]]*["'"'"'][^"'"'"'$<{]{8,}["'"'"']'
report INFO 'Stripe publishable key (public by design; confirm intended)' 'pk_(live|test)_[0-9A-Za-z]{10,}'
report INFO 'Third-party script/integration reference (verify still intended)' 'trustpilot|cusrev|fluentsmtp|stripe\.com/v3|googletagmanager|facebook\.net'

if [[ $high -eq 1 ]]; then echo "secret-scan: HIGH findings present"; exit 1; fi
echo "secret-scan: no HIGH findings"
