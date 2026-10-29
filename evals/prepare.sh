#!/usr/bin/env bash
# Creates a clean work directory for one eval run.
#
#   evals/prepare.sh <base|skill> <workdir>
#
# The fixture is exported from FIXTURE_REPO at FIXTURE_COMMIT (tracked files only, so no local
# config or secrets) and committed as the baseline the grader diffs against. The work directory
# must be outside this repository, or the agent would also load this repo's AGENTS.md.
set -euo pipefail

cond=$1 work=$2
root="$(cd "$(dirname "$0")/.." && pwd)"
FIXTURE_REPO=${FIXTURE_REPO:-$HOME/code/personal/price-tracker}
FIXTURE_COMMIT=${FIXTURE_COMMIT:-764d637}

case "$(cd "$(dirname "$work")" && pwd)/" in "$root"/*) echo "workdir must be outside $root" >&2; exit 1;; esac
[[ -e "$work" ]] && { echo "$work already exists" >&2; exit 1; }

mkdir -p "$work"
git -C "$FIXTURE_REPO" archive "$FIXTURE_COMMIT" | tar -x -C "$work"
git -C "$work" init -q
git -C "$work" add -A
git -C "$work" -c user.name=eval -c user.email=eval@example.invalid commit -qm "eval baseline $FIXTURE_COMMIT"

# Reuse the fixture repo's installed dependencies; the tests need no browser download.
ln -s "$FIXTURE_REPO/node_modules" "$work/node_modules"

if [[ $cond == skill ]]; then
  mkdir -p "$work/.claude/skills"
  cp -R "$root/.agents/skills/pragmatic-programmer" "$work/.claude/skills/"
fi
echo "$work"
