# Architecture Playbook

Use this when choosing system boundaries, data flow, modules, services, frameworks, storage, or other consequential structure.

## Principles

- Start from current requirements and credible change, not imagined future scale.
- Prefer explicit data flow and small, understandable interfaces.
- Keep domain knowledge independent from transport, framework, and vendor details when that separation has real value.
- Favor reversible choices where uncertainty is high.
- Use a tracer bullet: prove a thin end-to-end path before building every layer in depth.
- Prefer one deployable system over distributed complexity until independent deployment or scaling is actually needed.

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
