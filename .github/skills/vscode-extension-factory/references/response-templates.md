# Response Templates

Use these templates to keep outputs uniform and easy to review.

## Discovery Summary Template

```markdown
## Discovery Summary

### Scope
- Extension: <name>
- Target users: <users>
- Primary workflows: <workflow list>

### Functional Requirements
1. <requirement>
2. <requirement>

### Non-Functional Requirements
1. Performance: <target>
2. Accessibility: <target>
3. Security: <target>

### Initial Contribution Map
- Commands: <list>
- Views: <list>
- Menus: <list>
- Configuration: <list>

### Activation Strategy
- Events: <list>
- Rationale: <short justification>
```

## Architecture Decision Template

```markdown
## Architecture Decision

### UI Strategy
1. Native UI: <why>
2. Custom Editor (if any): <why>
3. WebView (if any): <why>

### Component Map
- src/extension.ts: <role>
- src/commands/<file>.ts: <role>
- src/providers/<file>.ts: <role>
- src/webview/<file>.ts: <role>

### Risks
1. <risk> - Mitigation: <mitigation>
2. <risk> - Mitigation: <mitigation>
```

## Implementation Report Template

```markdown
## Implementation Report

### Files Changed
1. <path> - <what changed>
2. <path> - <what changed>

### Behavioral Changes
1. <change>
2. <change>

### Notes
- <migration or compatibility note>
```

## Verification Report Template

```markdown
## Verification Report

### Automated Checks
1. Typecheck: <pass/fail>
2. Lint: <pass/fail>
3. Tests: <pass/fail/partial>

### Manual Checks
1. Command flow: <pass/fail>
2. View/editor behavior: <pass/fail>
3. Theme/a11y checks: <pass/fail>

### Residual Risks
1. <risk>
2. <risk>
```

## Packaging Readiness Template

```markdown
## Packaging Readiness

### Metadata
- package.json: <ok/issues>
- categories/keywords/icon: <ok/issues>

### Documentation
- README: <ok/issues>
- CHANGELOG: <ok/issues>

### Release State
- VSIX smoke test: <ok/issues>
- Ready to publish: <yes/no>
- Blocking items: <list>
```
