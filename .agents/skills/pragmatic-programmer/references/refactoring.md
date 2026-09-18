# Refactoring Playbook

Use this for structural improvements that should preserve behavior.

## Before changing structure

- Establish a known baseline with the strongest practical verification available.
- Separate behavior changes from structural cleanup when practical.
- Identify the smallest seam that enables the desired improvement.
- Prefer a sequence of safe moves over one large rewrite.

## During refactoring

- Keep behavior stable.
- Preserve public contracts unless changing them is part of the task.
- Re-run focused verification after meaningful steps.
- Stop if the refactor expands into unrelated cleanup.

## Good triggers

- names no longer match behavior
- duplicated domain knowledge has crystallized
- tests are hard to write because seams are poor
- one change routinely ripples across unrelated modules

## Stop signals

- rewriting working code mainly for style preference
- combining a feature, refactor, dependency migration, and cleanup in one patch
- introducing abstractions without a current problem
- touching neighboring modules merely because they look old
