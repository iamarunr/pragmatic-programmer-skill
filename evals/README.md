# Skill eval

Measures whether the skill changes what an agent ships, on realistic tasks it has never seen. Each task
runs with and without the skill installed, on the same model, from the same starting commit. Runs are
graded on the result, not on the agent's own summary.

Run it after any change to `SKILL.md` or `references/`. A change that does not move these numbers, or
moves them the wrong way, should not ship.

## Tasks

The fixture is a small Node.js price tracker with a local dashboard and a Cloudflare Worker version.
Each task is phrased the way a user would ask, and each hides a trap that is already in the real code.

| Task | Request | Trap |
|---|---|---|
| `t1-alert-rearm` | "I never got an email when the price dropped back below my target." | The alert never re-arms after the price recovers. The fix must cover both runtimes, keep deduplication, and update the docs and help text that describe the rule. Bonus: products already stuck get one catch-up alert. |
| `t2-percent-email` | "Add the percentage drop to the alert email." | The email is built in two places that have already drifted apart. No earlier price must not produce `NaN%` or a negative drop. |
| `t3-product-notes` | "Add an editable note to each product." | Updating a product overwrites the target, so saving a note would wipe it. Needs a new D1 migration, not an edit to `0001`, and HTML escaping in the dashboard. |

Task prompts are in `tasks/`. They contain no hints.

## Grading

`grade.mjs` checks each finished run in three ways:

- **Hidden behavior checks** (`hidden/`), copied in only after the agent finishes. `core:` checks are what
  the request requires; `bonus:` checks are judgment calls a careful engineer would make.
- **The project's own tests**, which must all still pass.
- **Hygiene and docs**: no dependency changes, tests added, task-specific checks such as an untouched
  `0001` migration or escaped output.

Every check was validated against the untouched fixture (it fails what the task asks for) and against
known good and bad solutions (each is caught).

Not graded automatically, so read the diffs for: unrequested changes, quality of the final message,
and whether stated decisions are reasonable.

## Running

Clean runs use the `claude` CLI, so nothing from this repository leaks into the no-skill condition:

```bash
claude auth status
MODEL=sonnet REPS=2 evals/run.sh
```

`FIXTURE_REPO` and `FIXTURE_COMMIT` choose the fixture (default: `~/code/personal/price-tracker` at
`764d637`; its `node_modules` is reused). Results go to `$TMPDIR/pp-evals/<timestamp>-<model>/`, with a
`summary.md` table.

To grade runs made another way (for example, subagents), create each work directory with
`evals/prepare.sh <base|skill> <dir>`, let the agent work there, then run
`node evals/grade.mjs <task> <dir>` and `node evals/summarize.mjs <parent-dir>`.

## Caveats

- Two runs per cell is enough to spot large effects, not small ones. Raise `REPS` before trusting a
  difference of one check.
- Subagent runs started from inside this repository may also see its `AGENTS.md`, which states the
  core rules. That narrows the gap between conditions; prefer `run.sh`.
- The fixture is a private repository and is not vendored here.
