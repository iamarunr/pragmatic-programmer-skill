#!/usr/bin/env bash
# Runs every task with and without the skill through `claude -p`, grades each run, and summarizes.
#
#   evals/run.sh                         # defaults below
#   MODEL=sonnet REPS=3 evals/run.sh
#   TASKS="t1-alert-rearm" CONDS="skill" evals/run.sh
#
# Requires a logged-in `claude` CLI (`claude auth status`). Runs happen in a temporary directory
# outside this repository so this repo's AGENTS.md cannot leak into the no-skill condition.
set -uo pipefail

evals="$(cd "$(dirname "$0")" && pwd)"
MODEL=${MODEL:-sonnet}
REPS=${REPS:-2}
TASKS=${TASKS:-$(ls "$evals/tasks" | sed 's/\.txt$//')}
CONDS=${CONDS:-"base skill"}
OUT=${OUT:-${TMPDIR:-/tmp}/pp-evals/$(date +%Y%m%d-%H%M%S)-$MODEL}
TOOLS=(Read Edit Write Glob Grep Skill "Bash(npm test:*)" "Bash(node:*)" "Bash(git diff:*)" "Bash(git status:*)"
  "Bash(git log:*)" "Bash(ls:*)" "Bash(cat:*)" "Bash(grep:*)" "Bash(sed -n:*)" "Bash(head:*)" "Bash(wc:*)")
SUFFIX=$'\n\n(You are working non-interactively; nobody can answer questions mid-task. If something is ambiguous, make a reasonable decision and state it in your final message. Do not commit.)'

claude auth status >/dev/null 2>&1 || { echo "claude CLI is not logged in; run: claude auth login" >&2; exit 1; }
mkdir -p "$OUT"
for task in $TASKS; do for cond in $CONDS; do for rep in $(seq "$REPS"); do (
  work="$OUT/$task-$cond-$rep"
  "$evals/prepare.sh" "$cond" "$work" >/dev/null || exit 1
  start=$(date +%s)
  (cd "$work" && claude -p "$(cat "$evals/tasks/$task.txt")$SUFFIX" --model "$MODEL" --output-format json \
    --no-session-persistence --permission-mode acceptEdits --allowedTools "${TOOLS[@]}") > "$work/.eval-agent.json" 2>"$work/.eval-agent.err"
  node -e '
    const fs=require("fs");const [file,task,cond,rep,model,secs]=process.argv.slice(1);
    let a={};try{a=JSON.parse(fs.readFileSync(file,"utf8"));}catch{}
    fs.writeFileSync(file.replace("agent.json","meta.json"),JSON.stringify({task,cond,rep:+rep,model,seconds:+secs,
      cost:a.total_cost_usd??null,turns:a.num_turns??null,error:a.is_error??true,final:a.result??null},null,2));
  ' "$work/.eval-agent.json" "$task" "$cond" "$rep" "$MODEL" "$(( $(date +%s) - start ))"
  node "$evals/grade.mjs" "$task" "$work" >/dev/null
  echo "done $task $cond $rep"
) & done; done; done
wait
node "$evals/summarize.mjs" "$OUT" | tee "$OUT/summary.md"
