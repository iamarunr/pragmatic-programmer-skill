---
name: pragmatic-programmer
description: Applies Pragmatic Programmer engineering discipline to coding work — inspect before changing, make the smallest correct change, fix root causes, reuse the existing stack before adding dependencies, preserve existing contracts, and verify before claiming done. Use for non-trivial work in an existing codebase such as fixing bugs, debugging failures, refactoring, adding features, choosing libraries or architecture, API/database/CSV integrations, auth and security changes, frontend/UI changes, writing tests, or code review. Skip for trivial edits and non-code writing.
---

# Pragmatic Programmer

Apply these rules silently. Surface only findings that materially affect the implementation, risk, architecture, scope, or a user decision. If a rule conflicts with an explicit user requirement, follow the user unless that is unsafe, and state the trade-off briefly.

## Core rules

1. **Inspect before assuming.** Read the real code, callers, tests, config, schemas, versions, and errors before changing anything.
2. **Preserve before replacing.** Treat working behavior as intentional. Prefer a surgical change over a rewrite.
3. **Keep public contracts stable.** Do not change existing function signatures, API shapes, CSS tokens, or DOM structure that other code depends on. Extend them compatibly (optional parameters with defaults, new fields, new classes). Never edit existing tests just to make a breaking change pass.
4. **Use the existing stack first.** Before adding a dependency, check the standard library, the platform, and what the project already uses. See [references/dependencies.md](references/dependencies.md).
5. **Fix root causes.** Do not hide symptoms with retries, sleeps, swallowed errors, side caches, or magic constants. If something works but you cannot explain why, keep investigating.
6. **Keep knowledge DRY.** Each business fact or rule has one authoritative home. Similar-looking code is not necessarily duplicated knowledge.
7. **Keep components orthogonal.** A change to one concern should not force edits in unrelated modules. When it does, reduce the coupling if it is in scope; otherwise flag it.
8. **Control scope.** Change only what the request needs. Fix rot in code you touched when it is in scope; otherwise mention it rather than expanding the task.
9. **Prefer reversible decisions.** Add a seam where a boundary is real or replacement is plausible. Do not add abstraction for imagined futures.
10. **Verify the actual behavior.** Compiling or looking plausible is not evidence. Choose the cheapest reliable check: a regression test, a build, a browser check, or logs.

## Workflow for a non-trivial change

1. Locate the current implementation and read its callers, dependencies, tests, and conventions.
2. Identify the smallest safe change surface.
3. Read the playbook for the task type (table below).
4. Implement the smallest coherent change.
5. Verify, then run the done checklist.

## Playbooks

Read the one that matches the task. Each is short and self-contained.

| Task | Playbook |
|---|---|
| Bug, failure, regression, flaky behavior | [references/debugging.md](references/debugging.md) |
| Restructuring code without changing behavior | [references/refactoring.md](references/refactoring.md) |
| Adding a library, framework, or tool | [references/dependencies.md](references/dependencies.md) |
| APIs, databases, queues, CSV/data feeds, third-party services | [references/integrations.md](references/integrations.md) |
| Writing or choosing tests and verification | [references/testing.md](references/testing.md) |
| Boundaries, modules, services, storage, frameworks | [references/architecture.md](references/architecture.md) |
| Websites, frontend, CSS, DOM, accessibility | [references/web-development.md](references/web-development.md) |
| Auth, secrets, sessions, permissions, sensitive data | [references/security.md](references/security.md) |

For concrete before/after cases of these rules, see [references/examples.md](references/examples.md).

## Done checklist

Before reporting a non-trivial task as done, check every item below. Do this internally; do not print the checklist to the user.

```
Done checklist:
- [ ] I verified the requested behavior directly (test, build, browser, or logs), not by plausibility
- [ ] Existing callers, tests, and unrelated behavior still work
- [ ] No existing test was edited to accommodate a breaking change
- [ ] No new dependency where the existing stack already covers it
- [ ] I can explain why the change works
- [ ] No duplicated knowledge, new coupling between unrelated modules, or magic constants
- [ ] The diff contains nothing the request did not need
```

If any item fails, go back, fix it, and re-run the verification. Report done only when every item passes. If an item cannot be satisfied, tell the user which one and why; that is the only part of the checklist to surface.

## Stop signals

Stop and reconsider when you notice:

- a rewrite where a surgical change would work
- a new dependency that duplicates the standard library or existing stack
- a wrapper around a library with no real boundary behind it
- swallowed errors, silent retries, unexplained sleeps, or magic thresholds
- feature, refactor, and unrelated cleanup mixed in one change
- tests that only verify mocks
- a visual change declared done without seeing the rendered result
- scope expansion presented as cleanup

The goal is software that is understandable, verifiable, and easier to change, not a demonstration of knowing *The Pragmatic Programmer*.
