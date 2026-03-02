# Verification Matrix

Use this matrix to define pass/fail criteria by component surface.

## Global Gates

| Gate | Required | Evidence |
| --- | --- | --- |
| Typecheck | Yes | command output/status |
| Lint | Yes | command output/status |
| Activation sanity | Yes | extension starts on intended events |
| Error handling | Yes | failure path behavior captured |

## Native UI Verification

| Area | Check | Pass Criteria |
| --- | --- | --- |
| Commands | run from command palette | expected behavior and user feedback |
| TreeView | expand/select/refresh | stable hierarchy and refresh consistency |
| QuickPick | search/select/cancel | correct selection and cancel behavior |
| Settings | read/write config | values persist and affect behavior |

## Custom Editor Verification

| Area | Check | Pass Criteria |
| --- | --- | --- |
| Open/load | open associated file type | editor loads correctly |
| Dirty state | edit content | unsaved marker appears/disappears correctly |
| Save/reopen | save then reopen | state/data preserved |
| Sync | document updates | UI/document remain synchronized |

## WebView Verification

| Area | Check | Pass Criteria |
| --- | --- | --- |
| CSP | inspect policy | strict policy present, scripts nonce-bound |
| Messaging | valid/invalid payloads | valid accepted, invalid rejected safely |
| Theme | light/dark/high-contrast | visually correct in all modes |
| A11y | keyboard + labels | full keyboard flow and labeled controls |
| Dispose | close/open cycles | no leaked listeners/timers |

## Performance Verification

| Area | Check | Pass Criteria |
| --- | --- | --- |
| Activation | measure startup impact | activation delta <= 150ms vs baseline run |
| Large data paths | stress target workflow | key UI actions complete <= 300ms at p95 |
| Memory behavior | repeat open/close flows (10 cycles) | heap growth <= 20MB after GC stabilization |

## Report Template

Use `references/response-templates.md` and include:

1. automated results
2. manual checks
3. residual risks
4. recommendation (ready/not ready)
