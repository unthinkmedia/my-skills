---
name: fluent-azure-grid-library
description: >-
  Manage reusable Fluent UI React grid/layout templates for Azure portal pages.
  List, match, create, diff, and refine grid templates that drive the
  fluent-azure-replicator skill's layout generation. USE FOR: list grid
  templates, find a grid template, match a layout, create a grid template, save
  this layout as a template, compare grid templates, template library, page
  layout templates. DO NOT USE FOR: building full pages (use
  fluent-azure-replicator), Coherence/cui-* components, non-Azure layouts.
tools:
  - read_file
  - create_file
  - replace_string_in_file
  - grep_search
  - file_search
  - list_dir
  - semantic_search
  - run_in_terminal
  - manage_todo_list
---

# Fluent Azure Grid Library

Manage reusable layout templates for Fluent UI React Azure portal pages. This skill is a companion to `fluent-azure-replicator` — it owns the template library and matching algorithm.

## Template Storage

All templates live at:
```
.github/skills/fluent-azure-replicator/references/grid-templates/
```

Each template is a markdown file containing:
1. ASCII art structure diagram
2. TypeScript template definition object
3. `makeStyles` usage example
4. Component pattern example
5. "When to Use" / "When NOT to Use" guidance

## Pre-Seeded Templates

| Template               | File                      | Description                                              |
| ---------------------- | ------------------------- | -------------------------------------------------------- |
| Azure Resource Blade   | `azure-resource-blade.md` | Side nav + content for resource detail pages              |
| Azure Browse Page      | `azure-browse-page.md`    | Full-width data grid with optional filter sidebar         |
| Azure Create Wizard    | `azure-create-wizard.md`  | Vertical stepper + form content for create flows          |
| Azure Dashboard        | `azure-dashboard.md`      | Responsive grid of cards/tiles for home/dashboard         |
| Azure Settings Page    | `azure-settings-page.md`  | Stacked form sections within a resource blade             |

## Operations

### 1. LIST — Show Available Templates

When the user asks to see available templates or wants to know what layouts exist:

1. Read the `grid-templates/` directory
2. For each `.md` file, extract the template name and description from the `# Grid Template:` header and the template definition's `description` field
3. Present a table:
   ```
   | Template             | Type | Description           |
   | -------------------- | ---- | --------------------- |
   | azure-resource-blade | flex | Resource detail page  |
   | ...                  | ...  | ...                   |
   ```

### 2. MATCH — Find Best Template for a Page

When the user describes a page or provides a URL, find the best-fitting template.

**Matching Algorithm (weighted scoring):**

| Factor             | Weight | How to Score                                                    |
| ------------------ | ------ | --------------------------------------------------------------- |
| Has side nav?      | 30%    | 1.0 if both have or both lack side nav; 0.0 if mismatch        |
| Content type       | 25%    | 1.0 if content type matches (form, grid, cards, mixed); 0.5 partial |
| Slot overlap       | 20%    | Count of matching slot names / max(slots in either)             |
| Has command bar?   | 15%    | 1.0 if both have or both lack command bar; 0.0 mismatch        |
| Responsive grid?   | 10%    | 1.0 if responsive requirements match; 0.5 partial              |

**Steps:**
1. Analyze the target page description or extracted layout
2. Score each template against the target
3. Return the best match with its score and the second-best alternative
4. If best score < 0.5, recommend creating a new template

**Output format:**
```
Best match: azure-resource-blade (score: 0.85)
  → Matches: side nav ✓, slot overlap 4/5 ✓, command bar ✓
  → Gaps: no KPI row in template (add as custom slot)
Runner-up: azure-settings-page (score: 0.60)
```

### 3. CREATE — Save a New Template

When the user wants to save a custom layout as a reusable template:

1. Ask for: name, description, type (`flex` | `grid`), and a description of the layout
2. Generate the template markdown file with all required sections:
   - ASCII structure diagram
   - TypeScript template definition
   - `makeStyles` usage
   - Component pattern example
   - When to Use / When NOT to Use
3. Save to `grid-templates/{name}.md`
4. Validate the template slots don't conflict with existing templates

**Naming convention:** lowercase-kebab-case, prefixed with `azure-` for Azure portal patterns.

### 4. DIFF — Compare Two Templates

Compare two templates to understand their structural differences:

1. Read both template files
2. Compare: slot names, slot dimensions, layout type, presence of sidebar/commandbar/footer
3. Output a comparison table:
   ```
   | Aspect       | Template A           | Template B        |
   | ------------ | -------------------- | ----------------- |
   | Type         | flex                 | grid              |
   | Side nav     | ✓ (220px)           | ✗                 |
   | Command bar  | ✓                   | ✗                 |
   | Slots        | 5 (breadcrumb, ...) | 3 (header, ...)   |
   | Responsive   | No                  | Yes               |
   ```

### 5. EXTEND — Add Slots or Responsive Breakpoints

When an existing template almost fits but needs minor additions:

1. Read the existing template
2. Add the requested slots, responsive breakpoints, or style overrides
3. Write back the updated template
4. Note the change in a `## Changelog` section at the bottom of the file

## Template Interface

All templates follow this conceptual interface:

```typescript
interface GridTemplate {
  name: string;                // kebab-case identifier
  description: string;         // one-line description
  type: 'flex' | 'grid';      // CSS layout strategy
  responsive: boolean;         // whether responsive breakpoints are defined
  parentTemplate?: string;     // if this extends another template (e.g., settings extends resource-blade)

  layout: {
    [slotName: string]: {      // CSS properties for each slot
      [cssProp: string]: string;
    };
  };

  slots: {
    [slotName: string]: {
      flex?: string;
      width?: string;
      minWidth?: string;
      minHeight?: string;
      overflow?: string;
      padding?: string;
      optional?: boolean;
      [key: string]: any;
    };
  };

  responsive?: {
    [breakpoint: string]: {    // e.g., '@media (max-width: 768px)'
      [slotName: string]: {
        [cssProp: string]: string;
      };
    };
  };
}
```

## Integration with fluent-azure-replicator

The replicator skill calls into this library at three points:

1. **Mode A (URL replication) — ANALYZE phase:** After extracting the source page's computed grid structure, the replicator calls MATCH to find the closest template. If matched (score ≥ 0.5), the template is used as the layout foundation. If not, a new template is extracted and optionally saved.

2. **Mode B (description-based) — TEMPLATE-SELECT phase:** The replicator presents available templates via LIST, then uses MATCH with the user's description. If no good match exists, CREATE is invoked to build a custom template first.

3. **SYNC CHECK phase:** After the user modifies generated code, the replicator detects drift in template-sourced layout styles (tracked by `region:template:<name>` markers). If structural changes are found, the replicator prompts the user and—if approved—calls EXTEND to apply the changes back to the source template. See `references/sync-protocol.md` in the replicator skill for the full protocol.

### 6. SYNC-BACK — Apply Improvements from Built Prototypes

When the replicator's SYNC CHECK detects that a prototype's layout has structurally improved on a grid template and the user approves syncing:

1. Receive the modified layout slot definitions from the replicator
2. Read the existing template file
3. Apply changes using the EXTEND operation:
   - Add new slots if slots were added
   - Update slot dimensions/styles if they changed
   - Add responsive breakpoints if they were introduced
4. Update the ASCII structure diagram to reflect the new layout
5. Update the `makeStyles` usage example
6. Log the change in `## Changelog` at the bottom of the template file
7. If the change is substantial enough (score < 0.5 against the old template), consider if it should be a new template instead

## Rules

1. **Template files are reference documents** — they contain markdown with embedded TypeScript, not executable code. The replicator reads them to generate actual component code.
2. **One template per file** — do not combine multiple templates in one file.
3. **Extend, don't duplicate** — if a new template is very similar to an existing one (DIFF score > 0.8 overlap), extend the existing template or use `parentTemplate` reference instead.
4. **Azure naming** — prefix templates for Azure portal patterns with `azure-`. Custom/non-Azure layouts use descriptive names without the prefix.
5. **Keep `makeStyles` examples up to date** — whenever slot layout changes, update both the template definition and the `makeStyles` section.
6. **Accept sync-back updates from the replicator** — when the replicator's SYNC CHECK offers template improvements, apply them through EXTEND. The replicator generalizes the changes before passing them; verify they remain generic and reusable.
