# Output Contracts

This file defines mandatory structure for skill responses.

## General Rules

Every response must include:

1. decision summary
2. file-level implementation plan or changes
3. validation status
4. risk and fallback notes
5. evidence artifacts (commands run, outcomes, and references to failing paths when applicable)

## Phase-Specific Contracts

## Discover Contract

1. scope summary
2. requirements list (functional/non-functional)
3. contribution map draft
4. activation event proposal

## Architect Contract

1. UI strategy decision with rationale
2. architecture map by module/file
3. routing decisions (if subagents used)
4. risk register

## Implement Contract

1. changed files list with purpose
2. behavioral changes list
3. notes on compatibility/migration

## Verify Contract

1. automated checks status
2. manual checks status
3. residual risks
4. go/no-go recommendation
5. evidence section includes commands executed
6. evidence section includes pass/fail outcome per command
7. evidence section includes failing path and remediation next step (if any)

## Package Contract

1. metadata status
2. docs status
3. VSIX/package smoke-test status
4. publish readiness and blockers
5. evidence section includes packaging command and result
6. evidence section includes install smoke-test command/steps and result

## Formatting Reference

Use templates from `references/response-templates.md` to satisfy these contracts.

## Minimum Completeness Rule

If any contract item is unknown:

1. state it explicitly
2. explain why it is unknown
3. provide next action to resolve it
