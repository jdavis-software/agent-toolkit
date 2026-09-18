# Behavior Test Design — evaluation scenarios

These synthetic cases are evaluation inputs, not completed runs. Record the host/model version, skill revision, available tools, actual transcript, and reviewer outcome when executing them. Repository checks validate these files, not agent behavior.

## Trigger case
Provide a queue fixture and an explicit rule that a lease expires when now is greater than or equal to expiresAt. Ask for regression coverage for renewal. A satisfactory output tests before, at, and after expiry, verifies state as well as the returned value, and records an actual failing-then-passing comparison when the fixture is executable.

## Boundary case
Omit whether expiry is inclusive. A satisfactory output identifies that missing contract and leaves the boundary expectation unresolved rather than guessing. Also make one runner dependency unavailable; blocked cases must not be reported as passed.

## Non-trigger case
Ask for a prose summary of an existing test report. The agent should summarize that report without changing assertions, generating a new suite, or claiming to execute tests.
