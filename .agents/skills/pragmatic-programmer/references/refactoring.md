# Refactoring Playbook

Use this for structural improvements that should preserve behavior.

## Before changing structure

- Establish a known baseline with the strongest practical verification available.
- Separate behavior changes from structural cleanup when practical.
- Identify the smallest seam that enables the desired improvement.
- Prefer a sequence of safe moves over one large rewrite.

## Refactor first, then change

When the code you must change is hard to change, make the change easy first (a behavior-preserving refactor, verified on its own), then make the easy change. Keep the two as separate steps or commits.

## During refactoring

- Keep behavior stable.
- Preserve public contracts unless changing them is part of the task.
- Re-run focused verification after meaningful steps.
- Stop if the refactor expands into unrelated cleanup.
- Touch adjacent code only when it directly blocks the task or materially reduces risk.

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
