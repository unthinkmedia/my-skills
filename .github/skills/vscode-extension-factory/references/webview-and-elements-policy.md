# WebView And Elements Policy

Use this policy only when a WebView is justified by the component selection rules.

## When WebView Is Allowed

A WebView is allowed only if native VS Code UI and custom editors cannot satisfy required UX.

Valid cases:

1. rich interactive visualization
2. complex multi-region form workflows
3. embedded interactive media or advanced canvas-like interactions

Invalid cases:

1. simple lists or browsing flows (`TreeView` should be used)
2. simple forms (`QuickPick` or settings should be used)
3. status display (`StatusBar` or notifications should be used)

## Mandatory Security Baseline

Every WebView implementation must include:

1. strict CSP (`default-src 'none'`)
2. nonce-scoped scripts
3. explicit allowlist for `img-src`, `font-src`, and `connect-src`
4. structured message validation on every inbound message
5. output sanitization before rendering user-provided or external content

## Message Contract Requirements

All messages must follow a schema:

```json
{
  "command": "string",
  "requestId": "string-or-number",
  "payload": {}
}
```

Validation rules:

1. reject unknown commands
2. reject malformed payloads
3. return structured error responses
4. do not execute commands by direct string evaluation

## VS Code Elements Requirement

When using WebViews, use VS Code Elements controls whenever an equivalent component exists.

Required substitutions:

1. `button` -> `vscode-button`
2. `input[type=text]` -> `vscode-textfield`
3. `select` -> `vscode-dropdown`
4. `input[type=checkbox]` -> `vscode-checkbox`

Only use plain HTML elements if no VS Code Elements equivalent exists, and document the exception in the implementation report.

## Theme And Accessibility Rules

1. use VS Code theme tokens (`--vscode-*`)
2. verify light, dark, and high-contrast modes
3. support keyboard-only navigation
4. expose labels/roles for interactive controls
5. provide non-color-only status indicators

## Performance Rules

1. avoid large initial bundles; prefer selective imports
2. lazy-load heavy visual modules
3. avoid unbounded DOM growth
4. clean up listeners and timers on dispose

## Review Checklist

- [ ] WebView usage is justified
- [ ] CSP and nonce are implemented
- [ ] message schema validation is in place
- [ ] VS Code Elements are used where available
- [ ] theme and a11y checks pass
- [ ] dispose lifecycle is verified
