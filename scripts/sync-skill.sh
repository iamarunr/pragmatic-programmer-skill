#!/usr/bin/env bash
# Regenerates the installable skill package from the canonical files at the repo root.
# The package holds only what the agent loads: SKILL.md and references/.
#
#   scripts/sync-skill.sh          rebuild .agents/skills/pragmatic-programmer/
#   scripts/sync-skill.sh --check  exit 1 if the package is out of date (for CI or pre-commit)
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
pkg="$root/.agents/skills/pragmatic-programmer"

if [[ "${1:-}" == "--check" ]]; then
  if diff -r "$root/SKILL.md" "$pkg/SKILL.md" >/dev/null &&
     diff -r "$root/references" "$pkg/references" >/dev/null &&
     [[ "$(ls -A "$pkg")" == $'references\nSKILL.md' || "$(ls -A "$pkg")" == $'SKILL.md\nreferences' ]]; then
    echo "Skill package is in sync."
  else
    echo "Skill package is out of date. Run scripts/sync-skill.sh" >&2
    exit 1
  fi
  exit 0
fi

rm -rf "$pkg"
mkdir -p "$pkg"
cp "$root/SKILL.md" "$pkg/SKILL.md"
cp -R "$root/references" "$pkg/references"
echo "Synced skill package to ${pkg#"$root"/}"
