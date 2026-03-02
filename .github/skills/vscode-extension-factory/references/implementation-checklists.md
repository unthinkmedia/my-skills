# Implementation Checklists

Use these checklists during execution to keep outputs deterministic and auditable.

## 1. Discover Checklist

- [ ] problem statement and user personas captured
- [ ] functional workflows listed end to end
- [ ] non-functional constraints captured (perf, a11y, security)
- [ ] extension contribution points mapped at high level
- [ ] activation event candidates documented

## 2. Architect Checklist

- [ ] native-first decision completed and justified
- [ ] UI surface inventory finalized (commands/views/settings/editors)
- [ ] service boundaries and dependencies defined
- [ ] error boundaries and notification strategy defined
- [ ] cache/state ownership documented
- [ ] risk register completed

## 3. Implement Checklist

- [ ] all command registrations validated
- [ ] provider registrations validated
- [ ] disposables pushed to `context.subscriptions`
- [ ] settings contributions include defaults and descriptions
- [ ] failures return actionable user messages
- [ ] expensive operations are lazy-loaded

### WebView-specific checklist (only if used)

- [ ] strict CSP implemented
- [ ] nonce script policy enforced
- [ ] inbound message schema validated
- [ ] outbound payload sanitized
- [ ] VS Code theme tokens used
- [ ] VS Code Elements used for controls

### Custom editor-specific checklist (only if used)

- [ ] open/save lifecycle behavior verified
- [ ] dirty state behavior verified
- [ ] backup/restore behavior considered
- [ ] document synchronization logic tested

## 4. Verify Checklist

- [ ] typecheck passes
- [ ] lint passes
- [ ] extension activates with expected events
- [ ] command happy-path tests pass
- [ ] command failure-path tests pass
- [ ] TreeView/QuickPick/editor/WebView behavior validated
- [ ] keyboard navigation validated
- [ ] light/dark/high-contrast checks completed
- [ ] activation/perf hotspot check completed

## 5. Package Checklist

- [ ] `package.json` includes correct metadata and categories
- [ ] command/view/settings docs align with implementation
- [ ] changelog entry added for current changes
- [ ] icon/keywords/repository fields validated
- [ ] VSIX package smoke-tested

## Exit Criteria

All of the following must be true:

1. build/test status is known and reported
2. unresolved risks are explicitly listed
3. blockers are actionable and file-specific
