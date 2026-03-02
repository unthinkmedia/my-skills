# Evidence Examples

Use these examples to satisfy `output-contracts.md` evidence requirements.

## VERIFY Evidence Example

```markdown
### Evidence

1. Command: `npm run compile`
   - Result: pass
   - Notes: TypeScript build completed with 0 errors.

2. Command: `npm run lint`
   - Result: pass
   - Notes: 0 errors, 2 warnings (non-blocking, documented).

3. Command: `npm test`
   - Result: partial
   - Notes: 42 passed, 1 failed.
   - Failing path: `src/webview/panel.ts` message validation edge case.
   - Next step: add schema guard for missing `requestId` and rerun tests.

4. Manual check: command palette flow
   - Result: pass
   - Notes: `Extension: Refresh` updates TreeView and status bar.

5. Manual check: theme/a11y
   - Result: pass
   - Notes: validated light/dark/high-contrast and keyboard navigation.
```

## PACKAGE Evidence Example

```markdown
### Evidence

1. Command: `npx @vscode/vsce package`
   - Result: pass
   - Artifact: `my-extension-0.2.0.vsix`

2. Install smoke test
   - Command/steps: install VSIX in clean profile and run primary command
   - Result: pass
   - Notes: activation event fired correctly; no startup errors.

3. Metadata review
   - Result: pass
   - Notes: `package.json` fields complete; categories and keywords present.

4. Docs review
   - Result: issues
   - Notes: README missing troubleshooting section.
   - Next step: add troubleshooting before publish.
```

## DISCOVER/ARCHITECT Evidence Example

```markdown
### Evidence

1. Requirements source
   - Input: user request + existing package.json + current command set
   - Result: 6 functional requirements, 4 non-functional constraints

2. Routing decision
   - Result: selected `extensionArchitect` then `uiPatternSpecialist`
   - Rationale: medium complexity, native-first scope
```
