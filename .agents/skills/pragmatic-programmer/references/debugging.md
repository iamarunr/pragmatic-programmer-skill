# Debugging Playbook

Use this when diagnosing failures, regressions, flaky behavior, or unexplained success.

## Workflow

1. Reproduce the failure when practical.
2. Capture the complete error, stack, logs, inputs, environment, and relevant versions.
3. Read the code path that actually executes.
4. State one falsifiable hypothesis.
5. Test that hypothesis with the smallest useful experiment.
6. Fix the root cause with the smallest coherent change.
7. Verify the original failure no longer occurs.
8. Check likely regressions.

## Verification

Prefer a failing regression test before fixing a behavioral bug when practical. Do not force a unit-test harness onto visual, infrastructure, configuration, exploratory, or one-off integration problems; use the cheapest reliable evidence instead.

## Stop signals

- unexplained sleeps or delays
- catch-and-ignore error handling
- multiple speculative changes at once
- blaming the framework before inspecting local code
- a bug disappearing without understanding why
- declaring success because the error message changed
