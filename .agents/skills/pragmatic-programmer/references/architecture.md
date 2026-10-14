# Architecture Playbook

Use this when choosing system boundaries, data flow, modules, services, frameworks, storage, or other consequential structure.

## Principles

- Start from current requirements and credible change, not imagined future scale.
- Prefer explicit data flow and small, understandable interfaces.
- Keep components orthogonal: a change to one concern should not ripple into unrelated modules.
- Keep domain knowledge independent from transport, framework, and vendor details when that separation has real value.
- Favor reversible choices where uncertainty is high.
- Use a tracer bullet: prove a thin end-to-end path before building every layer in depth.
- Prefer one deployable system over distributed complexity until independent deployment or scaling is actually needed.

## Tracer bullets vs. prototypes

- **Tracer bullet:** a thin, production-quality path through every layer that you keep and widen. Use it to prove the architecture works end to end.
- **Prototype:** a throwaway experiment that answers one question, such as whether a library handles a case or whether an approach performs well enough. Keep it outside production code, record what you learned, then delete it.

Do not let a prototype quietly become the implementation.

## Ask before committing

- What concrete problem does this boundary solve?
- What will be easier to change because of it?
- What new coordination, deployment, debugging, and operational costs does it create?
- Could a simpler design satisfy the current requirement?
- If this choice is wrong, how expensive is reversal?

## Stop signals

- architecture chosen mainly because it is fashionable
- service boundaries without independent lifecycle needs
- abstraction layers with no current consumer or variation
- framework-specific concepts leaking throughout domain logic
- design documents replacing feedback from a running slice
