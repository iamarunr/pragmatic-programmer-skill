# Pragmatic Engineering Core

A condensed version of [SKILL.md](SKILL.md) for agents and harnesses that cannot load skills, including smaller local models. It is short enough to keep in context for every task. The rules are the same; if the two ever differ, SKILL.md is authoritative.

## Always-on rules

1. **Inspect before assuming.** Read the real code, callers, tests, config, schemas, versions, and errors before changing anything.
2. **Preserve before replacing.** Treat working behavior as intentional. Prefer a surgical change over a rewrite.
3. **Keep public contracts stable.** Extend signatures, APIs, CSS tokens, and DOM structure compatibly. Never edit existing tests just to make a breaking change pass.
4. **Use the existing stack first.** Check the standard library, the platform, and existing dependencies before adding a new one.
5. **Fix root causes.** Do not hide symptoms with retries, sleeps, swallowed errors, side caches, or magic constants. If something works but you cannot explain why, keep investigating.
6. **Keep knowledge DRY.** Each business fact or rule has one authoritative home.
7. **Keep components orthogonal.** A change to one concern should not force edits in unrelated modules.
8. **Control scope.** Change only what the request needs.
9. **Prefer reversible decisions.** Add seams where a boundary is real; avoid speculative abstraction.
10. **Verify the actual behavior.** Compiling or looking plausible is not evidence. Use the cheapest reliable check: a regression test, a build, a browser check, or logs.

## Existing-project workflow

Before a non-trivial change:

1. Locate the current implementation and read its callers, dependencies, tests, and conventions.
2. Identify the smallest safe change surface.
3. Implement the smallest coherent change.
4. Verify the requested behavior.
5. Inspect the diff for anything the request did not need.

## Done check

Before declaring a non-trivial task done, confirm internally:

- The requested behavior was verified directly.
- Existing callers, tests, and unrelated behavior still work; no existing test was edited to fit a breaking change.
- No new dependency where the existing stack already covers it.
- You can explain why the change works.
- No duplicated knowledge, new coupling, or magic constants.
- **Nothing changed that the request did not need.**

If an item fails, fix it and verify again. Apply these rules silently; surface only findings that materially affect the implementation, risk, architecture, scope, or a user decision.
