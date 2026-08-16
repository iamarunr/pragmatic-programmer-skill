# Pragmatic Programmer AI Skill

A model-agnostic engineering skill inspired by the principles of *The Pragmatic Programmer* by Andy Hunt and Dave Thomas, translated into operational guidance for AI coding agents.

The goal is not to make an agent quote software-engineering philosophy. The goal is to make it behave like a pragmatic engineer: inspect before assuming, preserve before replacing, prefer small reversible changes, fix root causes, control scope, and verify before claiming success.

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

## Model-agnostic by design

The engineering philosophy is independent of the model.

It can be used with cloud agents such as Codex and Claude Code and with local/open-weight models such as Qwen, DeepSeek, GLM, Kimi, Gemma, and Llama.

What changes between platforms is **how the instructions are delivered**, not the engineering standard itself.

## Repository structure

```text
pragmatic-programmer-skill/
├── SKILL.md
├── CORE.md
├── adapters/
│   └── local-models.md
└── references/
    ├── architecture.md
    ├── debugging.md
    ├── integrations.md
    ├── refactoring.md
    ├── security.md
    ├── testing.md
    └── web-development.md
```

### `CORE.md`

A compact engineering constitution intended to be cheap enough to keep in context broadly, including for smaller local models.

### `SKILL.md`

The full skill: routing, core stance, decision-time checks, anti-patterns, and final self-check.

### `references/`

Focused playbooks that can be loaded only when relevant. This avoids spending context on a long engineering manifesto for every small CSS or copy change.

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
