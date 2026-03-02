# VS Code Extension Factory - How To Use

This companion guide describes how to run the `vscode-extension-factory` skill consistently, with strong architecture decisions and predictable outputs.

## When To Use This Skill

Use this skill when the request is about building or evolving a VS Code extension, including:

1. new extension design and scaffolding
2. adding commands/views/settings
3. selecting native UI vs custom editor vs WebView
4. extension testing strategy
5. marketplace packaging readiness

Do not use this skill for:

1. general web app UI work
2. non-extension automation scripts
3. Azure resource operations
4. repository tasks unrelated to VS Code extension behavior

## Companion Docs

Use companion docs for policy and deep checks:

1. `references/index.md` (phase-by-phase loading map)
2. `references/implementation-checklists.md`
3. `references/output-contracts.md`
4. `references/response-templates.md`
5. `references/subagent-routing-playbook.md`
6. `references/verification-matrix.md`
7. `references/marketplace-readiness.md`
8. `references/webview-and-elements-policy.md` (when WebViews are used)
9. `references/package-json-blueprint.jsonc` (when scaffolding metadata)
10. `references/verification-calibration.md` (for reproducible perf checks)
11. `references/evidence-examples.md` (for evidence section quality)

## Required Inputs

Before execution, gather:

1. extension goal and target users
2. required workflows and UI surfaces
3. constraints (performance, accessibility, security, timeline)
4. current repository structure and existing extension assets (if any)

## Execution Model

Run this sequence:

`DISCOVER -> ARCHITECT -> IMPLEMENT -> VERIFY -> PACKAGE`

Each phase produces concrete artifacts. Do not skip phase outputs.

Write outputs in imperative, evidence-first style and use the templates from `references/response-templates.md`.

## Phase Outputs

### DISCOVER outputs

1. requirements matrix (functional + non-functional)
2. preliminary contribution checklist (`commands`, `views`, `menus`, `configuration`)
3. activation strategy (`onCommand`, `onView`, `workspaceContains`, etc.)

### ARCHITECT outputs

1. UI selection rationale using native-first policy
2. component map by file and runtime boundary
3. risk register (performance, API, security, maintenance)

### IMPLEMENT outputs

1. command/provider registrations with disposables management
2. settings and contribution implementations
3. WebView/custom editor code only when justified

### VERIFY outputs

1. compile/lint/test status
2. accessibility and theme conformance evidence
3. residual risk summary when tests are incomplete

### PACKAGE outputs

1. metadata review (`package.json`)
2. docs review (`README`, `CHANGELOG`)
3. publish readiness checklist with blockers (if any)

## Native-First Decision Rule

Use this strict order:

1. native components (`TreeView`, `QuickPick`, commands, status bar, settings)
2. custom editors for specialized file editing
3. WebViews only for required rich/interactive experiences

If choosing WebView, include:

1. CSP strategy
2. message validation rules
3. VS Code theme token usage
4. VS Code Elements component usage

## Specialist Subagent Routing

Use specialist subagents for large scopes:

1. `extensionArchitect` for architecture and activation model
2. `uiPatternSpecialist` for native UI implementation
3. `customEditorSpecialist` for file editor experiences
4. `webviewDeveloper` for secure WebViews
5. `extensionTester` for testing strategy and coverage
6. `packagingSpecialist` for marketplace preparation

## Quality Gates

A run is complete only when:

1. no new compile errors introduced
2. key extension workflows execute successfully
3. verification evidence is present
4. packaging readiness is documented with explicit pass/fail

## Common Failure Modes

1. overusing WebViews for simple workflows
2. broad activation (`*`) without strong need
3. missing disposal and cleanup of subscriptions/listeners
4. weak error messages without actionable next steps
5. missing high-contrast/theme behavior checks

## Minimal Invocation Prompt

Use this when invoking the skill:

```text
Use vscode-extension-factory.
Build [extension goal] with [required workflows].
Prioritize native UI and justify any custom editor/WebView decisions.
Return: architecture map, file-by-file implementation plan, validation strategy, and packaging readiness report.
```
