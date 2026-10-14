# Pragmatic Programmer AI Skill

A model-agnostic engineering skill inspired by the principles of *The Pragmatic Programmer* by Andy Hunt and Dave Thomas, translated into operational guidance for AI coding agents.

The goal is not to make an agent quote software-engineering philosophy. The goal is to make it behave like a pragmatic engineer: inspect before assuming, preserve before replacing, prefer small reversible changes, fix root causes, control scope, and verify before claiming success.

---

## 🚀 Quick Links
* **[How to Use in Any Existing Repo](HOW_TO_USE.md)** — Step-by-step instructions and ready-to-use prompts for testing and fixing any codebase.
* **[Empirical Benchmark Suite (BENCHMARK.md)](BENCHMARK.md)** — Rigorous A/B empirical evaluation of agent performance with vs. without the skill.
* **[Full Skill Definition (SKILL.md)](SKILL.md)** — Core rules, playbook routing, done checklist, and stop signals.
* **[Core Constitution (CORE.md)](CORE.md)** — Compact rules intended for broader context and local models.

---

## Why this exists

Modern coding agents can write a lot of code very quickly. That makes engineering judgment more important, not less.

Without explicit guardrails, agents can:

- rewrite working code instead of making a surgical change
- add dependencies or abstraction layers too eagerly
- guess about files, schemas, versions, or APIs
- fix symptoms without understanding the cause
- expand scope under the banner of "cleanup"
- declare success because code compiles without verifying the product

This repository turns pragmatic programming principles into decision-time behavior an agent can apply while building real software.

---

## 🛠️ How to Deploy & Use in Any Existing Repo

### 1. Installation

#### Global Installation (Available across all projects)
```bash
mkdir -p ~/.gemini/config/skills
cp -r .agents/skills/pragmatic-programmer ~/.gemini/config/skills/
```

#### Local Workspace Installation (Committed to a specific project)
```bash
mkdir -p /path/to/target-repo/.agents/skills
cp -r .agents/skills/pragmatic-programmer /path/to/target-repo/.agents/skills/
```

### 2. Configure the Repository Rule

In your target repository's root, add this to `AGENTS.md` (or `GEMINI.md`):

```markdown
# Project Instructions

## Engineering Philosophy
For non-trivial software changes, default to the `pragmatic-programmer` skill.
Prefer evidence over assumptions, surgical changes over rewrites, existing conventions, and verification before declaring success. Apply silently.
```

### 3. Test & Surgically Fix Any Codebase (Recommended Prompt)

Copy and paste this prompt to test and fix an existing repository:

```text
Apply the pragmatic-programmer skill principles to inspect and fix this repository:

1. GATHER EVIDENCE FIRST:
   - Inspect the repo configuration and run the test suite, typechecker, and linter.
   - Collect exact error outputs and failure traces (do not assume or guess).

2. ROOT CAUSE ANALYSIS:
   - Trace failures to their root causes before making any code modifications.

3. SURGICAL FIXES (ZERO-COLLATERAL-DAMAGE):
   - Make the smallest, most targeted edits possible to resolve the issue.
   - Preserve existing public API contracts and backwards compatibility.
   - DO NOT alter existing tests simply to make CI green—existing test assertions reflect contracts that must be preserved.
   - DO NOT introduce new third-party dependencies if the existing runtime/stdlib can accomplish it.
   - Maintain the existing architecture, code style, and naming conventions.

4. VERIFICATION:
   - Re-run the full test suite, linter, and build commands to verify the fix.
   - Confirm zero regressions across unaffected modules.

5. SUMMARY:
   - Briefly summarize: (a) evidence found, (b) root cause, (c) files touched, and (d) verification output.
```

*(See **[HOW_TO_USE.md](HOW_TO_USE.md)** for additional prompts: daily 1-liner, fragility audit, and safe feature additions).*

---

## Empirical proof: Default Agent vs. Pragmatic Skill

Does explicit pragmatic guidance measurably improve agent behavior? We tested agents across two rigorous empirical benchmark suites:

### 1. Backend Systems & Algorithmic Invariants ([`benchmark/`](./benchmark))
Tested on an event ingestion & deduplication engine across clock coupling bugs, HMAC verification, and format extensions:

| Evaluation Metric | Default Agent (No Skill) | Pragmatic Skill | Real-World Impact |
| :--- | :--- | :--- | :--- |
| **New Dependencies Added** | `+1` (`crypto-js`) | **`0`** (Native `node:crypto`) | **100% reduction** in supply chain bloat |
| **Bug Fix Churn** | 25 lines (`+18 / -7`) | **8 lines (`+4 / -4`)** | **68% smaller**, surgical root-cause fix |
| **Fix Depth** | Symptom patch (unbounded memory leak) | **Root-cause resolution** | Eliminated state corruption |
| **Contract Preservation** | **Broken** (Made options mandatory) | **100% Backwards-Compatible** | Zero breaking changes for existing callers |
| **Security Standards** | Naive `===` string equality | **`timingSafeEqual`** constant-time buffer | Guarded against timing attacks |

### 2. Fullstack & Web Application Architecture ([`benchmark-ui/`](./benchmark-ui))
Audited by a Senior Principal Architect on an interactive workflow board across responsive layout, real-time filtering, and modal accessibility:

| Architectural Dimension | Default Agent (No Skill) | Pragmatic Skill | Principal Architect Verdict |
| :--- | :--- | :--- | :--- |
| **Visual Regressions** | **Severe** (Broken layout, overlapping cards) | **Zero** (100% responsive preservation) | Enterprise design system adherence |
| **Filter State Synchronization** | **Regressed** (Broke drag-and-drop state) | **Robust** (Decoupled store & view sync) | Clean state isolation |
| **WCAG 2.1 AA Accessibility** | **Failed** (Inaccessible `<div>` modal) | **Passed** (HTML5 `<dialog>`, focus trap, ESC) | Enterprise accessibility compliance |

👉 **Read the full reproducible methodology, test cases, and diffs in [`BENCHMARK.md`](./BENCHMARK.md).**

---

## Model-agnostic by design

The engineering philosophy is independent of the model.

It can be used with cloud agents such as Codex and Claude Code and with local/open-weight models such as Qwen, DeepSeek, GLM, Kimi, Gemma, and Llama.

What changes between platforms is **how the instructions are delivered**, not the engineering standard itself.

## Repository structure

```text
pragmatic-programmer-skill/
├── SKILL.md
├── CORE.md
├── HOW_TO_USE.md           # Guide for deploying and using in any repository
├── BENCHMARK.md            # Empirical A/B benchmark evaluation
├── AGENTS.md               # Standard agent directive
├── .agents/skills/         # Installable skill package (generated, do not edit)
│   └── pragmatic-programmer/   # SKILL.md + references/ only
├── scripts/
│   └── sync-skill.sh       # Rebuilds the package from the root files
├── benchmark/              # Benchmark #1: Backend systems suite
│   ├── challenges/
│   ├── codebase/
│   └── results/
├── benchmark-ui/           # Benchmark #2: Fullstack & Web UI suite
│   ├── challenges/
│   ├── codebase/
│   └── results/
├── adapters/
│   └── local-models.md
└── references/
    ├── architecture.md
    ├── debugging.md
    ├── dependencies.md
    ├── examples.md
    ├── integrations.md
    ├── refactoring.md
    ├── security.md
    ├── testing.md
    └── web-development.md
```

### `CORE.md`

Not part of the installed skill package. A compact engineering constitution for other tools and harnesses, short enough to keep in context broadly, including for smaller local models.

### `BENCHMARK.md`

Empirical A/B benchmark comparing default agent behavior against the pragmatic skill across reproducible coding challenges.

### `SKILL.md`

The skill an agent loads: core rules, workflow, a table routing each task type to its playbook, the done checklist, and stop signals.

The root `SKILL.md` and `references/` are the single source of truth. After editing them, run `scripts/sync-skill.sh` to regenerate `.agents/skills/pragmatic-programmer/` (`--check` verifies it is current).

### `references/`

Focused playbooks that can be loaded only when relevant, plus `examples.md` with before/after cases from the benchmark. This avoids spending context on a long engineering manifesto for every small CSS or copy change.

### `adapters/`

Guidance for delivering the same engineering philosophy through different agent/model setups.

## Core rules

The short version:

1. Inspect before assuming.
2. Preserve before replacing.
3. Make the smallest correct change.
4. Verify, do not hallucinate.
5. Fix root causes.
6. Do not program by coincidence.
7. Keep knowledge DRY.
8. Keep components orthogonal.
9. Prefer reversible decisions.
10. Use the existing stack first.
11. Match verification to the task.
12. Do not declare success from plausibility.

And one especially important rule for AI agents:

> **Did I change more than necessary?**

## Usage strategy

### Best default: two levels

Use `CORE.md` as the always-on constitution and load deeper guidance only when the task calls for it.

```text
small edit
  → CORE.md

debugging
  → CORE.md + references/debugging.md

refactor
  → CORE.md + references/refactoring.md

architecture
  → CORE.md + references/architecture.md

web/UI work
  → CORE.md + references/web-development.md

external API/data integration
  → CORE.md + references/integrations.md

security-sensitive work
  → CORE.md + references/security.md

broad non-trivial engineering work
  → SKILL.md
```

This is especially useful for local models because explicit procedural guidance helps without wasting context on unrelated sections.

## Codex

Codex supports reusable skills and persistent repository/user instructions. Put the skill in the location supported by your Codex setup, or reference it from your persistent `AGENTS.md` instructions.

A lightweight persistent instruction can be:

```md
## Engineering philosophy

For non-trivial software changes, use the pragmatic-programmer skill as the
default engineering framework.

Prefer:
- evidence over assumptions
- small reversible changes
- existing project conventions
- preservation of working behavior
- verification before declaring success

Do not narrate routine application of the skill.
```

## Claude Code

Use the repository as a Claude Code skill or import the relevant files through your project's persistent Claude instructions.

The same two-level strategy works well: keep `CORE.md` broadly available and use the detailed playbooks for task-specific work.

## Local / open-source models

See [`adapters/local-models.md`](adapters/local-models.md).

The important point is that the **agent harness**, not the model itself, determines how the instructions are loaded. Any coding harness that supports a system prompt, project instructions, context files, or reusable skills can use this repository.

A generic local-agent instruction is:

```text
Follow CORE.md as the default engineering constitution for all coding work.
For non-trivial debugging, architecture, refactoring, testing, integration,
security, or web-development tasks, consult the relevant reference playbook.
Apply the rules silently. Surface only findings that materially affect the
implementation, risk, architecture, scope, or user decision.
```

## Important design choices

### Apply checks silently

The skill should influence behavior, not turn every response into a lecture about which principle was applied.

Routine compliance stays silent. Findings that affect risk, architecture, scope, or a user decision should be surfaced.

### Testing is proportional

A behavioral bug often deserves a failing regression test first. A CSS adjustment does not necessarily deserve a new test framework.

Use the cheapest reliable verification method: tests, build, type-check, browser inspection, screenshots, logs, end-to-end execution, or another task-appropriate check.

### Dependencies are contextual

Do not avoid dependencies merely because an agent could write a few hundred lines itself.

Prefer mature, maintained dependencies for security-sensitive, standards-heavy, complex, or commodity problems. Prefer small in-house code only when the problem is genuinely simple and the dependency would add more complexity than it removes.

### Abstractions must earn their keep

Create seams when replacement is plausible or when an integration crosses a meaningful domain boundary. Do not wrap every library mechanically for hypothetical future replacement.

### Preserve before replacing

Existing working behavior is assumed intentional until evidence shows otherwise. Read the implementation and its dependencies before rewriting it.

This rule is especially important for autonomous coding agents.

## Web and web-app development

The dedicated web playbook emphasizes behavior that matters when agents build websites and applications:

- preserve the existing visual language unless redesign is requested
- inspect responsive behavior before adding new rules
- use the existing stack first
- verify the rendered interface, not just the source
- check desktop/mobile states where relevant
- preserve accessibility and semantic HTML
- inspect APIs, URLs, CMS fields, schemas, CSV columns, and database fields instead of guessing
- avoid replacing working components merely to make them stylistically cleaner

See [`references/web-development.md`](references/web-development.md).

## Relationship to *The Pragmatic Programmer*

This is an independent operational adaptation inspired by engineering principles from the book. It is not a replacement for the book and does not reproduce the book's text.

If you find these ideas useful, read *The Pragmatic Programmer* by Andy Hunt and Dave Thomas.

## Contributing

Contributions are welcome, especially practical rules that improve real agent behavior without turning the skill into dogma or unnecessary process.

A good addition should answer at least one of these:

- At what decision point should the agent use this rule?
- What failure mode does it prevent?
- Can a smaller/local model understand and execute it?
- Does it reduce hallucination, unnecessary scope, coupling, or accidental complexity?
- Is the rule pragmatic rather than absolute?
