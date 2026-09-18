# Testing and Verification Playbook

Choose the cheapest reliable verification that proves the requested behavior.

## Match verification to the change

- Pure logic: focused unit tests.
- Behavior across components: integration tests.
- User flows: end-to-end tests.
- Frontend layout or styling: browser inspection and, when useful, screenshot comparison.
- Type or API contract changes: type-check plus targeted tests.
- Build/config changes: build and runtime validation.
- Bug fixes: regression test when practical.

## Test useful states

Prioritize meaningful boundaries and states: empty, one, many, malformed, unauthorized, unavailable, stale, duplicate, concurrent, maximum/minimum, and partial failure where relevant.

## Avoid

- tests that only prove mocks behave as configured
- asserting implementation details that make safe refactors expensive
- chasing line coverage without meaningful assertions
- creating a large test harness for a trivial visual or configuration change
- claiming a test passed without actually running it

A test is evidence, not ceremony.
