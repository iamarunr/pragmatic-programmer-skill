# Local and Open-Source Model Adapter

The engineering rules in this repository are model-agnostic. Qwen, DeepSeek, GLM, Kimi, Gemma, Llama, and other local/open-weight models can use them as long as the agent harness can inject instructions or files into context.

## Recommended pattern

Use [`../CORE.md`](../CORE.md) as an always-on engineering constitution. Load the full [`../SKILL.md`](../SKILL.md) or a focused reference playbook only for non-trivial tasks.

This keeps context usage low and gives smaller models explicit procedural guidance without overwhelming them.

## Generic system prompt

A generic local agent can be configured with:

```text
Follow CORE.md as the default engineering constitution for all coding work.
For non-trivial debugging, architecture, refactoring, testing, integration,
security, or web-development tasks, consult the relevant reference playbook.
Apply the rules silently. Surface only findings that materially affect the
implementation, risk, architecture, scope, or user decision.
```

## Context strategy

- Small/simple edit: `CORE.md` only.
- Debugging: `CORE.md` + `references/debugging.md`.
- Refactor: `CORE.md` + `references/refactoring.md`.
- Architecture: `CORE.md` + `references/architecture.md`.
- Web/UI work: `CORE.md` + `references/web-development.md`.
- External API/data work: `CORE.md` + `references/integrations.md`.
- Security-sensitive work: `CORE.md` + `references/security.md`.
- Broad/ambiguous engineering task: full `SKILL.md`.

The harness matters more than the model name: use whatever mechanism your local coding agent provides for system prompts, project instructions, reusable skills, or context files.
