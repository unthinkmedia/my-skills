# Template & Fragment Sync Protocol

Keeps the skill's template/fragment library in sync with improvements discovered during prototype builds. When a user modifies generated code that originated from a fragment or grid template, this protocol detects the drift and offers to push changes back to the source.

## Sync Manifest

During BUILD, generate a `sync-manifest.json` alongside the output files. This records exactly which skill references were consumed and enables drift detection later.

```json
{
  "generatedAt": "2026-03-01T12:00:00Z",
  "gridTemplate": {
    "name": "azure-browse-page",
    "file": ".github/skills/fluent-azure-replicator/references/grid-templates/azure-browse-page.md"
  },
  "fragments": [
    {
      "name": "command-bar",
      "file": ".github/skills/fluent-azure-replicator/references/fragments/command-bar.tsx",
      "outputRegion": {
        "file": "index.tsx",
        "startMarker": "/* region:fragment:command-bar */",
        "endMarker": "/* endregion:fragment:command-bar */"
      }
    },
    {
      "name": "data-table",
      "file": ".github/skills/fluent-azure-replicator/references/fragments/data-table.tsx",
      "outputRegion": {
        "file": "index.tsx",
        "startMarker": "/* region:fragment:data-table */",
        "endMarker": "/* endregion:fragment:data-table */"
      }
    }
  ],
  "canonicalExample": {
    "type": "browse-list",
    "dir": ".github/skills/fluent-azure-replicator/references/canonical-examples/browse-list/"
  }
}
```

## Region Markers

When composing fragments into the output `index.tsx`, wrap each fragment's code in lightweight region markers. These are standard JS comments that do not affect the build:

```tsx
{/* region:fragment:command-bar */}
<Toolbar aria-label="Actions" className={styles.commandBar}>
  {/* ... */}
</Toolbar>
{/* endregion:fragment:command-bar */}
```

For `styles.ts`, use the same pattern around the styles that came from a fragment:

```ts
/* region:fragment:command-bar */
commandBar: {
  borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
},
/* endregion:fragment:command-bar */
```

For grid template layout styles, use `region:template:<template-name>`:

```ts
/* region:template:azure-browse-page */
root: {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
},
/* endregion:template:azure-browse-page */
```

## Drift Detection

After any user-requested modification to the generated code (iteration, fixes, additions), run drift detection:

### Step 1: Read the Sync Manifest

Read `sync-manifest.json` from the output directory. If it doesn't exist, skip drift detection (the component wasn't built by this skill).

### Step 2: Extract Modified Regions

For each entry in `fragments[]` and the `gridTemplate`:

1. Read the current output file
2. Extract the code between `region:fragment:<name>` / `endregion:fragment:<name>` markers (or `region:template:<name>` for templates)
3. If markers were removed by the user, attempt to locate the equivalent code block by matching the component/style names from the original fragment

### Step 3: Compare Against Source

For each extracted region:

1. Read the source fragment/template file from the skill references
2. Normalize both code blocks (strip comments, normalize whitespace)
3. Compute a structural diff:
   - **No change**: The region matches the source → no action
   - **Adapted only**: Only data/props were changed (expected customization) → no action
   - **Structurally modified**: Component structure, styles, or patterns changed → trigger sync prompt

### Structural Change Detection Heuristics

A change is **structural** (not just data adaptation) if any of these are true:
- New Fluent components added or existing ones removed
- `makeStyles` properties added, removed, or changed (not just values, but property keys)
- Component props that affect layout or behavior changed (e.g., `appearance`, `orientation`)
- JSX tree depth changed (new wrapper elements, removed nesting)
- New interactive patterns added (event handlers, state management)

A change is **adaptation** (expected, no sync needed) if only these changed:
- String literals (labels, placeholder text, aria-labels)
- Array/object data (items in a list, table columns)
- Type definitions narrowed to the specific use case
- Variable/component names renamed to match page context

## Sync Prompt

When structural drift is detected, present the user with a clear comparison and ask:

```
📋 Template/Fragment Sync Check

The following skill references were modified during this build:

1. Fragment: command-bar
   Changed: Added overflow menu with `MenuButton` + `Menu` for secondary actions
   Source: .github/skills/fluent-azure-replicator/references/fragments/command-bar.tsx

2. Template: azure-browse-page
   Changed: Added sticky pagination bar with page size selector
   Source: .github/skills/fluent-azure-replicator/references/grid-templates/azure-browse-page.md

Would you like to:
  (a) Update the source fragments/templates with these improvements
  (b) Keep changes local to this build only
  (c) Review the diff for each change before deciding
```

If the user chooses **(a) Update** or selects specific items:

1. Read the current source fragment/template file
2. Apply the structural changes while preserving the fragment's generic, reusable nature:
   - Replace page-specific data with generic placeholder data
   - Replace page-specific type names with generic interface names
   - Keep the improved component structure, styles, and patterns
3. Write the updated fragment/template file
4. If the change adds a new feature (e.g., overflow menu), update the fragment's header comment to document it
5. Update the fragment README.md description table if needed
6. Log the change in the template's `## Changelog` section (for grid templates)

If the user chooses **(c) Review**:

1. Show a side-by-side diff of the source vs. modified version for each changed reference
2. Let the user approve/reject each change individually
3. Apply only the approved changes

## New Fragment Detection

During drift detection, also check for **new patterns** that don't correspond to any existing fragment:

1. Scan the output `index.tsx` for code blocks NOT wrapped in any `region:fragment:*` markers
2. If a new reusable pattern is detected (e.g., a filterable dropdown, a notification toast, a progress tracker):
   - Check if it matches any existing fragment by component name/structure
   - If it's genuinely new, prompt:

```
🆕 New Pattern Detected

A reusable pattern was created during this build that doesn't exist in the fragment library:

  Pattern: FilterableTagPicker
  Components used: TagPicker, TagPickerInput, TagPickerList, TagPickerOption
  Estimated reuse: High (common in Azure filter bars)

Would you like to save this as a new fragment?
  (a) Yes — save as fragments/filterable-tag-picker.tsx
  (b) No — keep it local to this build
```

If yes:
1. Extract the pattern from the output
2. Generalize it (replace page-specific data with generic types/placeholders)
3. Add the standard fragment header comment
4. Save to `references/fragments/<name>.tsx`
5. Update `references/fragments/README.md` with the new entry
6. Update `references/decision-table.md` to reference the new fragment where applicable

## Grid Template Sync

For grid template changes specifically, additional steps apply:

1. If layout slots were added or removed → update the ASCII structure diagram
2. If slot dimensions changed → update the TypeScript template definition object
3. If responsive breakpoints were added → update the responsive section
4. If the `makeStyles` usage example is now outdated → regenerate it from the template definition
5. Preserve the `## When to Use / When NOT to Use` section unless it's now inaccurate

Use the `fluent-azure-grid-library` skill's EXTEND operation to apply slot additions/modifications.

## Sync Timing

Run the sync check at these points:

1. **After every user-requested modification** to the generated code (iterations, fixes, "change the sidebar to...")
2. **At the end of BUILD** if any fragments were customized beyond data adaptation during initial generation
3. **During Incremental Versioning** — when creating v{N} from v{N-1}, compare v{N} against source fragments to detect accumulated drift

## Integration with Canonical Examples

When sync detects that a canonical example's patterns were significantly improved:

1. Prompt the user: "The {page-type} pattern in this build improves on the canonical example. Update the canonical example?"
2. If yes, update the files in `references/canonical-examples/<type>/` while keeping them generic
3. Canonical example updates require extra care — they anchor all future builds of that page type
