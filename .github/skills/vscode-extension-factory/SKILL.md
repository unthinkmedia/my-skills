---
name: vscode-extension-factory
description: >-
  End-to-end workflow for designing, building, testing, and packaging professional
  VS Code extensions. Uses a native-UI-first strategy, applies strict component
  selection rules (native UI vs WebView vs custom editor), and coordinates
  specialist subagents for architecture, UI patterns, WebViews, testing, and
  packaging. USE FOR: build a VS Code extension, scaffold extension features,
  choose between TreeView/QuickPick/WebView/custom editor, implement extension
  architecture, add extension commands/views/settings, create extension test
  strategy, package extension for Marketplace. DO NOT USE FOR: non-extension
  app development, generic web app UI work, Azure resource management,
  repository tasks unrelated to VS Code extension code.
tools:
  - read_file
  - list_dir
  - file_search
  - grep_search
  - semantic_search
  - create_file
  - apply_patch
  - run_in_terminal
  - get_errors
  - runSubagent
  - manage_todo_list
---

# VS Code Extension Factory

Build production-grade VS Code extensions with deterministic phases, explicit quality gates, and specialist subagent routing.

## Companion References

Load these companion docs to keep outputs consistent and reviewable:

| File | Purpose |
| --- | --- |
| `HOW_TO_USE.md` | Invocation patterns, phase outputs, and quality gates |
| `references/implementation-checklists.md` | Execution checklists by phase and exit criteria |
| `references/response-templates.md` | Reusable report templates for discover/architect/verify/package |
| `references/package-json-blueprint.jsonc` | Starter extension manifest blueprint with best-practice defaults |
| `references/webview-and-elements-policy.md` | WebView security, VS Code Elements, theme, and accessibility policy |
| `references/subagent-routing-playbook.md` | Agent selection rules, handoff payloads, and prompt snippets |
| `references/verification-matrix.md` | Pass/fail criteria by component surface |
| `references/marketplace-readiness.md` | Publication readiness and packaging checks |
| `references/output-contracts.md` | Mandatory response structure by phase |
| `references/verification-calibration.md` | Reproducible performance measurement protocol |
| `references/evidence-examples.md` | Canonical examples for evidence sections |

Recommended load order:

1. `HOW_TO_USE.md`
2. `references/implementation-checklists.md`
3. `references/output-contracts.md`
4. `references/response-templates.md`
5. `references/subagent-routing-playbook.md`
6. `references/verification-matrix.md`
7. `references/marketplace-readiness.md`
8. `references/webview-and-elements-policy.md` (only when WebViews are in scope)
9. `references/verification-calibration.md`
10. `references/evidence-examples.md`
11. `references/package-json-blueprint.jsonc` (when scaffolding or validating extension metadata)

## Required Instruction Context

Before implementing extension work, read these instruction files:

1. `.github/instructions/extension-development-best-practices.instructions.md`
2. `.github/instructions/ui-component-selection-standards.instructions.md`
3. `.github/instructions/vscode-elements-integration.instructions.md` (only when WebViews are part of the solution)

Do not skip instruction loading. These files are the source of truth for lifecycle, API usage, and UI component decisions.

Instruction drift rule:

1. If any referenced instruction file changes during a task, re-read it before continuing implementation.
2. If behavior conflicts with prior assumptions, update the plan and note the delta in the response.

## Skill Intent

Use this skill to convert extension requirements into a complete implementation plan and code changes:

`DISCOVER -> ARCHITECT -> IMPLEMENT -> VERIFY -> PACKAGE`

## Phase Contract

Use the phase flow below and satisfy the output contract in `references/output-contracts.md`.

1. `DISCOVER`
2. `ARCHITECT`
3. `IMPLEMENT`
4. `VERIFY`
5. `PACKAGE`

Execution detail and checklists live in:

1. `HOW_TO_USE.md`
2. `references/implementation-checklists.md`
3. `references/verification-matrix.md`
4. `references/marketplace-readiness.md`

## Selection And Routing Rules

Apply this UI decision order:

1. Native UI (`TreeView`, `QuickPick`, commands, status bar, settings)
2. Custom editor for specialized file editing
3. WebView only when required by UX constraints

When WebViews are in scope, follow:

1. `.github/instructions/vscode-elements-integration.instructions.md`
2. `references/webview-and-elements-policy.md`

For complex scopes, route with `runSubagent` using:

1. `references/subagent-routing-playbook.md`

## Implementation Contracts

When this skill is invoked, always provide:

1. Proposed UI choice with justification (native/custom editor/WebView)
2. Concrete implementation plan by file
3. Validation plan (tests + manual checks)
4. Risks and fallbacks

Formatting and required section structure are defined in:

1. `references/output-contracts.md`
2. `references/response-templates.md`

## Anti-Patterns

Do not:

1. Use WebViews for simple list/search/form scenarios that native UI can solve
2. Activate on `*` without hard justification
3. Leak disposables or listeners
4. Bypass input validation for command arguments or message payloads
5. Hardcode colors/fonts in WebViews without VS Code token integration

## Completion Definition

This skill is complete only when:

1. The extension code compiles with no new errors
2. Core workflows run in VS Code (commands/views/editors)
3. Tests or verification evidence is produced
4. Packaging and publishing readiness is documented

Use these references to determine completion status:

1. `references/verification-matrix.md`
2. `references/marketplace-readiness.md`
