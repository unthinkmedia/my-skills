# Subagent Routing Playbook

Use this playbook to route work to specialists with predictable handoffs.

## Routing Rules

1. Start with `extensionArchitect` for medium/large extension requests.
2. Route implementation by component type.
3. Route testing and packaging only after implementation scope is known.
4. Keep handoff payloads concise and structured.
5. For small-scope tasks (single-file edits, narrow bug fixes, minor metadata/doc updates), do not route to subagents; implement directly.

## Decision Table

| Requirement Pattern | Primary Agent | Secondary Agent |
| --- | --- | --- |
| New extension architecture | `extensionArchitect` | `uiPatternSpecialist` |
| TreeView/QuickPick/commands/settings | `uiPatternSpecialist` | `extensionTester` |
| Specialized file editing | `customEditorSpecialist` | `extensionTester` |
| Rich interactive panel/dashboard | `webviewDeveloper` | `extensionTester` |
| Test strategy and quality gates | `extensionTester` | `packagingSpecialist` |
| VSIX/marketplace release prep | `packagingSpecialist` | `N/A` |

## Handoff Payload Templates

### Architect handoff payload

```json
{
  "extensionGoal": "...",
  "workflows": ["..."],
  "constraints": {
    "performance": "...",
    "accessibility": "...",
    "security": "..."
  },
  "preferredUI": "native-first"
}
```

### UI implementation handoff payload

```json
{
  "componentMap": ["commands", "treeView", "quickPick", "settings"],
  "files": ["src/extension.ts", "src/providers/..."],
  "acceptanceCriteria": ["..."]
}
```

### WebView handoff payload

```json
{
  "webviewPurpose": "...",
  "securityRequirements": ["CSP", "messageValidation"],
  "themeRequirements": ["light", "dark", "highContrast"],
  "accessibilityRequirements": ["keyboard", "labels"]
}
```

## Prompt Snippets

### Call extensionArchitect

```text
Design extension architecture for [goal].
Return: UI selection rationale, contribution map, activation model, risks, and file-level implementation plan.
```

### Call uiPatternSpecialist

```text
Implement native UI components for [workflows].
Return: command/view/settings implementation details and integration notes.
```

### Call webviewDeveloper

```text
Implement WebView for [purpose] with strict CSP, validated messaging, VS Code Elements usage, and theme/a11y compliance.
```

### Call extensionTester

```text
Build test plan and tests for [components].
Return: automated checks, manual checks, residual risks, and failing paths.
```

### Call packagingSpecialist

```text
Prepare marketplace-ready package for [extension].
Return: metadata validation, docs completeness, VSIX smoke-test status, blockers.
```

## Fallback Logic

1. If architecture remains unclear, reroute to `extensionArchitect`.
2. If WebView scope grows unexpectedly, split work into native + WebView tracks.
3. If tests reveal structural issues, reroute to the responsible implementation specialist before packaging.

## Concurrency Guidance

Use parallel execution only when dependencies are clear and interfaces are stable.

Parallel-safe examples:

1. `uiPatternSpecialist` and `webviewDeveloper` when module boundaries and shared contracts are predefined
2. `extensionTester` preparing test scaffolds while implementation progresses (without final assertions)

Sequential-required examples:

1. `extensionArchitect` must complete before implementation routing
2. `packagingSpecialist` runs after verification status is available
3. `extensionTester` final pass runs after implementation changes are merged

Rule:

1. If unsure about dependency ordering, run sequentially.
