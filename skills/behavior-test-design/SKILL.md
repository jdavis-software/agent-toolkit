---
name: behavior-test-design
description: Turn a feature or bug contract into focused tests with explicit input partitions, observable outcomes, boundary cases, and evidence that the tests detect the behavior they are meant to protect.
---
# Behavior Test Design

A testing procedure for Jordan's Agent Toolkit Collection. Written for this collection with AI assistance; experimental until evaluated in an identified agent host.

## When to use

Use before implementing a behavior change or when existing tests miss a demonstrated failure. The input should include a requested outcome, affected boundary, and access to the consuming repository's testing conventions.

## When not to use

Do not use to inflate a coverage percentage, invent missing product decisions, or replace repository testing conventions with a different framework. This skill designs and exercises focused tests; it does not declare a whole release ready.

## Procedure

### Define the observable contract

Read the requirement, relevant implementation, and neighboring tests. Write a brief statement of what a caller or user must observe, including what must not happen. Separate explicit requirements from assumptions. Ask about unresolved behavior only when it changes the expected result.

Choose the smallest boundary that can observe the contract without simulating away the thing under test. Reuse the repository's runner and fixtures. Use an integration boundary where correctness depends on a real interaction, and a browser boundary where the required evidence is rendered interaction.

### Partition the inputs

Build a compact case matrix. Include representative ordinary input, meaningful boundaries, invalid input, and absent input where applicable. Add cancellation, retries, duplicate requests, concurrency, authorization, or tenant separation only when the feature actually involves them.

For each case, specify initial state, action, expected observation, and prohibited side effects. Each expected result must come from the requirement or an explicitly approved assumption—not be copied from the current implementation merely because that is what it returns.

### Control the environment

Use deterministic fixtures and isolated state. Control clocks, random seeds, and network responses where appropriate, but do not mock the precise boundary whose behavior is being tested. Record which dependencies are real and which are substitutes. Avoid real credentials, customer records, arbitrary sleeps, and reliance on another test running first.

### Prove the test is meaningful

For a regression, run the new case against the unfixed behavior when practical, then against the proposed fix. For new functionality, make sure the test fails because the behavior is absent, not because the fixture is broken. A syntax error or unavailable database is not evidence that the test detects the intended defect.

Where useful, introduce one temporary, controlled fault in a disposable copy and confirm that the case rejects it. Restore the fault before continuing. Do not label a single fault probe comprehensive mutation testing.

### Report the actual evidence

Run the focused suite and relevant neighboring checks using repository-owned commands. Inspect assertion failures rather than automatically updating snapshots. Explain excluded cases and the remaining integration checks. Preserve the command, revision, result, and evidence location for the handoff.

## Output

Return a test design with the behavior contract, case matrix, chosen test boundary, real versus simulated dependencies, and implementation paths. Follow it with an execution record distinguishing `passed`, `failed`, `blocked`, and `not-run` cases.

Each case should have a short identifier that can be connected to its assertion and requirement. Do not return only a test count or coverage number.

## Failure handling

If the specification is ambiguous, identify the exact ambiguous outcome instead of encoding a guess as a permanent test. If setup fails, report setup failure separately. If a case passes without exercising the target boundary, repair the fixture or assertion. Never delete a valid failing assertion merely to obtain a green run.

## Example

Synthetic contract: a queue rejects a lease renewal after the lease has expired. For an expiry of 100, design cases at 99, 100, and 101 only after the contract explicitly establishes whether expiry is inclusive. Verify both the returned result and the persisted lease state. A test that checks only a returned boolean may miss an unintended state change.

These are suggested cases, not executed results. Evaluation scenarios are in `references/scenarios.md`.
