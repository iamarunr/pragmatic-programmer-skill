# External Integrations Playbook

Use this for APIs, databases, queues, payment providers, CMSs, CSV/data feeds, storage services, and other external contracts.

## Before coding

- Inspect the real contract, version, schema, and examples.
- Identify authentication, rate limits, timeouts, retries, idempotency, and error semantics.
- Validate external data at the boundary.
- Decide which module owns translation between external concepts and domain concepts.

## Dependency boundaries

Create an adapter or seam when the integration crosses a meaningful domain boundary, has vendor-specific concepts, is likely to vary, or needs isolation for testing/failure handling.

Do not create a wrapper that merely mirrors every method of a stable library without adding domain value.

## Failure design

Decide explicitly:

- timeout budget
- retry policy and maximum attempts
- idempotency strategy
- fallback behavior
- fail-open vs fail-closed behavior
- logging/observability needs

Never retry silently or indefinitely.

## Data safety

- Treat external input as untrusted.
- Avoid logging secrets or sensitive payloads.
- Make partial writes and duplicate delivery safe where relevant.
- Pin or otherwise record the contract/version the code relies on.
