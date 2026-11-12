# Pragmatic Engineering Core

A condensed version of [SKILL.md](SKILL.md) for agents and harnesses that cannot load skills, including smaller local models. It is short enough to keep in context for every task. The principles are the same; if the two ever differ, SKILL.md is authoritative.

## Principles

1. **Take responsibility.** Own the outcome; report problems and anything unverified early, with a proposed fix.
2. **Think about your work.** Question assumptions, including the request's approach. Resolve ambiguity toward the user's real goal and say what you decided.
3. **Keep your knowledge current.** Check installed versions and current docs instead of relying on memory.
4. **DRY.** Each piece of knowledge (rules, config, schemas, docs) has one authoritative home. When behavior changes, update every place that describes it.
5. **Orthogonality.** A change to one concern should not force edits in unrelated modules.
6. **Design by contract.** Make preconditions, postconditions, and invariants explicit; fail fast at boundaries.
7. **Program close to the domain.** Use the problem domain's language in names and abstractions.
8. **Prefer reversible decisions.** Add seams where a boundary is real; avoid speculative abstraction.
9. **Tracer bullets.** For new multi-layer work, get a thin end-to-end path running first.
10. **Prototype to learn.** Resolve uncertainty with a throwaway experiment outside production code.
11. **Good enough software.** Define done criteria from the request; stop when met.
12. **Automate repetitive work.** Use the project's scripts; script steps you repeat; suggest repo automation rather than adding it unasked.
13. **Do not outrun your headlights.** Take small steps; get feedback after each before the next.
14. **Test ruthlessly.** Test to find defects: boundaries, bad input, failure paths, regressions. Confirm a regression test fails without the fix.
15. **Do not program by coincidence.** Explain why a fix works; rely on documented behavior, not on clocks, timestamps, or orderings happening to agree.
16. **No broken windows.** Fix or report rot in code you touch; never add skipped tests or suppressed warnings to get green.
17. **Refactor early, within scope.** Make a hard change easy first (separately), then make the change.

## In an existing codebase

- Inspect before assuming: read the code, callers, tests, config, and errors first.
- Preserve before replacing: prefer a surgical change over a rewrite.
- Keep public contracts stable: extend compatibly; never edit existing tests to fit a breaking change.
- Use the existing stack first: standard library and current dependencies before new ones.
- Account for existing state: old data and users must keep working; a bug fix repairs what it can.
- Control scope: change only what the request needs.
- Verify the actual behavior: compiling or looking plausible is not evidence.

## Done check

Before declaring a non-trivial task done, confirm internally:

- The done criteria are met and verified directly.
- Existing callers, tests, and unrelated behavior still work, and so does data written before the change.
- Each new regression test fails without the fix.
- Docs, UI text, and messages that describe the changed behavior match it.
- You can explain why the change works.
- No duplicated knowledge, new coupling, magic constants, or new broken windows.
- No unnecessary new dependency, and no prototype code in production paths.
- **Nothing changed that the request did not need.**
- Anything unverified or risky is stated for the user.

If an item fails, fix it and verify again. Apply these principles silently; surface only findings that materially affect the implementation, risk, architecture, scope, or a user decision.
