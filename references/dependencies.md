# Dependencies Playbook

Use this before adding a library, framework, build tool, or service, or before writing your own replacement for one.

## Check in this order

1. The language's standard library and the platform (for example `node:crypto`, `fetch`, `URL`, `Intl`, native `<dialog>`).
2. What the project already depends on.
3. Only then, a new dependency.

## Before adding one, answer

- What concrete problem does it solve that steps 1–2 do not?
- Is it mature, maintained, appropriately licensed, and proportionate to the problem?
- What security, upgrade, bundle-size, and removal costs does it add?

## Build vs. buy

- Prefer a mature library for security-sensitive, standards-heavy, or complex problems: authentication, cryptography, parsing, payments, sanitization.
- Prefer a small in-house implementation only when the requirement is genuinely simple and the dependency would add more complexity than it removes.

## Seams

Wrap a dependency only when replacement is plausible or it crosses a meaningful domain boundary. Do not wrap a stable library mechanically just to say it is wrapped.

## Stop signals

- adding a package for something the standard library does
- adding a second library that overlaps one already installed
- adding a UI framework or component library for one small interaction
- changing the package manifest when the task did not require it
