---
name: fluent-azure-replicator
description: >-
  Replicate, build, and verify Azure portal UI using Fluent UI React v9 with
  Azure theming. Three modes: URL replication (capture live page → analyze →
  build → verify), description-based (select template → build → verify), and
  Figma input (extract from Figma → analyze → build → verify). Produces
  self-contained React components with makeStyles, Azure brand theme, dark mode
  support, Storybook stories, and reusable grid templates. USE FOR: replicate
  Azure page, build Azure UI with Fluent, recreate Azure portal page, Fluent UI
  Azure prototype, create Azure page with React, convert Azure page to Fluent,
  build Azure UI from screenshot, build Azure UI from URL, Azure Fluent UI
  prototype, replicate this Azure blade, build a Fluent resource page, Azure
  portal mockup in React. DO NOT USE FOR: Coherence/cui-* components (use
  coherence-ui), non-Azure Fluent UI (use fluent2-converter for generic Fluent
  conversion), deploying to Azure (use azure-deploy).
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
  - runSubagent
  - search_subagent
  - multi_replace_string_in_file
  - fetch_webpage
  - mcp_microsoft_pla_browser_navigate
  - mcp_microsoft_pla_browser_snapshot
  - mcp_microsoft_pla_browser_take_screenshot
  - mcp_microsoft_pla_browser_evaluate
  - mcp_microsoft_pla_browser_click
  - mcp_microsoft_pla_browser_hover
  - mcp_microsoft_pla_browser_install
  - mcp_microsoft_pla_browser_close
---

# Fluent Azure Replicator

Build and replicate Azure portal UI pages using **Fluent UI React v9** with Azure brand theming. Produces self-contained, production-quality React components — NOT tied to any prototyping webapp.

## Quick Reference

| Reference File                          | Contains                                          |
| --------------------------------------- | ------------------------------------------------- |
| `references/azure-brand-ramp.md`        | Azure BrandVariants, light/dark themes, data viz palette, v8 compat, ThemeToggle |
| `references/token-map.md`               | CSS computed → Fluent v9 token map, Azure semantic color mapping |
| `references/component-patterns.md`      | UI pattern → Fluent v9 component decision tree, Azure-specific patterns |
| `references/icon-map.md`                | Azure portal icons → `@fluentui/react-icons` map  |
| `references/composition-rules.md`       | Component nesting validation (14 hard + 5 soft constraints) |
| `references/verification.md`            | Self-verification procedure with grid comparison, a11y, states |
| `references/grid-templates/*.md`        | Pre-seeded Azure page layout templates             |

**Load ALL reference files before starting any build.**

---

## Three Modes

### Mode A — URL Replication
**Trigger:** User provides a URL or says "replicate this page", "recreate this Azure page"
**Pipeline:** CAPTURE → ANALYZE → BUILD → VERIFY

### Mode B — Description-Based
**Trigger:** User describes a page ("build me a VM overview page", "create an Azure resource list")
**Pipeline:** TEMPLATE-SELECT → BUILD → VERIFY

### Mode C — Figma Input
**Trigger:** User provides a Figma URL or says "build from this Figma design"
**Pipeline:** FIGMA-EXTRACT → ANALYZE → BUILD → VERIFY

---

## Phase 1: CAPTURE (Mode A only)

Extract computed styles, DOM structure, and screenshots from a live page.

### Steps

1. **Install Playwright if needed:**
   ```
   Use mcp_microsoft_pla_browser_install
   ```

2. **Navigate to the target URL:**
   ```
   Use mcp_microsoft_pla_browser_navigate with url=<target>
   ```

3. **Take a reference screenshot:**
   ```
   Use mcp_microsoft_pla_browser_take_screenshot
   ```
   Save as `reference-screenshot.png` in the output directory.

4. **Extract computed styles from all visible elements:**
   ```javascript
   // Use mcp_microsoft_pla_browser_evaluate with this script:
   (() => {
     const results = [];
     const elements = document.querySelectorAll('*');
     const seen = new Set();

     for (const el of elements) {
       const rect = el.getBoundingClientRect();
       if (rect.width === 0 || rect.height === 0) continue;

       const tag = el.tagName.toLowerCase();
       const cs = getComputedStyle(el);
       const key = `${tag}|${Math.round(rect.x)}|${Math.round(rect.y)}|${Math.round(rect.width)}|${Math.round(rect.height)}`;
       if (seen.has(key)) continue;
       seen.add(key);

       results.push({
         tag,
         classes: el.className?.toString?.() || '',
         id: el.id || '',
         role: el.getAttribute('role') || '',
         ariaLabel: el.getAttribute('aria-label') || '',
         rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
         styles: {
           display: cs.display,
           position: cs.position,
           flexDirection: cs.flexDirection,
           gridTemplateColumns: cs.gridTemplateColumns,
           gridTemplateRows: cs.gridTemplateRows,
           gap: cs.gap,
           padding: cs.padding,
           margin: cs.margin,
           backgroundColor: cs.backgroundColor,
           color: cs.color,
           fontSize: cs.fontSize,
           fontWeight: cs.fontWeight,
           fontFamily: cs.fontFamily,
           lineHeight: cs.lineHeight,
           borderRadius: cs.borderRadius,
           border: cs.border,
           boxShadow: cs.boxShadow,
           overflow: cs.overflow,
           width: cs.width,
           height: cs.height,
           minWidth: cs.minWidth,
           maxWidth: cs.maxWidth,
         },
         textContent: el.childNodes.length === 1 && el.childNodes[0].nodeType === 3
           ? el.textContent?.trim().substring(0, 100) : '',
         childCount: el.children.length,
       });
     }
     return JSON.stringify(results.slice(0, 500));
   })()
   ```

5. **Detect v8 vs v9 source:**
   ```javascript
   // Use mcp_microsoft_pla_browser_evaluate:
   (() => {
     const hasV8 = !!(
       document.querySelector('.ms-Fabric') ||
       document.querySelector('[class*="ms-Button"]') ||
       document.querySelector('[class*="ms-TextField"]') ||
       document.querySelector('[class*="ms-Dropdown"]')
     );
     const hasV9 = !!(
       document.querySelector('[class*="fui-"]') ||
       document.querySelector('.fui-FluentProvider')
     );
     return JSON.stringify({ hasV8, hasV9 });
   })()
   ```

6. **Extract grid/layout structure:**
   ```javascript
   // Use mcp_microsoft_pla_browser_evaluate:
   (() => {
     const containers = [];
     document.querySelectorAll('*').forEach(el => {
       const cs = getComputedStyle(el);
       if (cs.display === 'flex' || cs.display === 'inline-flex' || cs.display === 'grid' || cs.display === 'inline-grid') {
         const rect = el.getBoundingClientRect();
         if (rect.width < 100 || rect.height < 50) return;
         containers.push({
           selector: el.id ? `#${el.id}` : el.className?.toString?.().split(' ').map(c => `.${c}`).join('') || el.tagName.toLowerCase(),
           display: cs.display,
           flexDirection: cs.flexDirection,
           gridTemplateColumns: cs.gridTemplateColumns,
           gridTemplateRows: cs.gridTemplateRows,
           gridTemplateAreas: cs.gridTemplateAreas,
           gap: cs.gap,
           rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
           childCount: el.children.length,
         });
       }
     });
     return JSON.stringify(containers.slice(0, 100));
   })()
   ```

7. **Extract interactive state baseline (hover/focus/disabled):**
   For key interactive elements (buttons, links, inputs), capture their base styles. Then use `mcp_microsoft_pla_browser_hover` and `mcp_microsoft_pla_browser_evaluate` to capture hover states. Compare deltas.

8. **Extract accessibility tree:**
   ```
   Use mcp_microsoft_pla_browser_snapshot
   ```
   Save the accessibility snapshot for reference during BUILD.

9. **Detect and extract assets (including icon auto-extraction):**
   ```javascript
   // Use mcp_microsoft_pla_browser_evaluate:
   (() => {
     const assets = [];
     document.querySelectorAll('img, svg, [style*="background-image"]').forEach(el => {
       const rect = el.getBoundingClientRect();
       if (rect.width === 0 || rect.height === 0) return;

       // Determine if this is an icon (small dimensions, typically ≤48px)
       const isIcon = rect.width <= 48 && rect.height <= 48;
       const nearbyLabel = isIcon
         ? (el.closest('[aria-label]')?.getAttribute('aria-label')
           || el.closest('button, a, [role="menuitem"]')?.textContent?.trim()?.substring(0, 50)
           || el.parentElement?.textContent?.trim()?.substring(0, 50)
           || '')
         : '';

       if (el.tagName === 'IMG') {
         assets.push({
           type: 'img', src: el.src, alt: el.alt,
           w: Math.round(rect.width), h: Math.round(rect.height),
           isIcon, nearbyLabel,
         });
       } else if (el.tagName === 'svg' || el.tagName === 'SVG') {
         assets.push({
           type: 'svg',
           // Full SVG markup for icons (needed for Tier 2 extraction)
           markup: isIcon ? el.outerHTML : el.outerHTML.substring(0, 500),
           viewBox: el.getAttribute('viewBox') || '',
           w: Math.round(rect.width), h: Math.round(rect.height),
           isIcon, nearbyLabel,
           // Capture parent context for icon mapping
           parentClasses: el.parentElement?.className?.toString?.() || '',
           dataIconName: el.closest('[data-icon-name]')?.getAttribute('data-icon-name') || '',
         });
       } else {
         const bg = getComputedStyle(el).backgroundImage;
         if (bg && bg !== 'none') assets.push({
           type: 'bg-image', url: bg,
           w: Math.round(rect.width), h: Math.round(rect.height),
           isIcon, nearbyLabel,
         });
       }
     });
     return JSON.stringify(assets.slice(0, 100));
   })()
   ```

   After extraction, for each asset where `isIcon: true`:
   - First attempt to match to `@fluentui/react-icons` using `icon-map.md` tables (check `dataIconName`, `nearbyLabel`, `alt` text)
   - If no match found, save the SVG markup or download the image URL to `<output-dir>/assets/`
   - Create a React wrapper component in `icons.ts` following the Tier 2 pattern in `icon-map.md`
   - Goal: **zero broken icons** in the final output

---

## Phase 1 (Mode C): FIGMA-EXTRACT

When user provides a Figma URL:

1. Use the Figma MCP tools to extract design context:
   - `mcp_figma_dev_mod_get_design_context` — layout, spacing, colors
   - `mcp_figma_dev_mod_get_screenshot` — visual reference
   - `mcp_figma_dev_mod_get_metadata` — component names
   - `mcp_figma_dev_mod_get_variable_defs` — design tokens

2. Map Figma tokens to Fluent v9 tokens using `references/token-map.md`
3. Proceed to ANALYZE phase with the extracted data

---

## Phase 2: ANALYZE

Transform raw extracted data into a build plan.

### Steps

1. **Read all reference files:**
   - `references/token-map.md`
   - `references/component-patterns.md`
   - `references/icon-map.md`
   - `references/azure-brand-ramp.md`
   - `references/composition-rules.md`

2. **Map computed styles → Fluent tokens:**
   For each extracted element's computed styles, find the closest Fluent v9 token:
   - Colors → `tokens.color*` (use the Azure semantic mapping if source is v8)
   - Font sizes → `tokens.fontSize*`
   - Font weights → `tokens.fontWeight*`
   - Spacing/padding → `tokens.spacing*`
   - Border radius → `tokens.borderRadius*`
   - Shadows → `tokens.shadow*`

   **Tolerance:** Accept ±2px for spacing, ±1px for font size, ΔE2000 ≤ 5 for colors.

3. **Map UI patterns → Fluent components:**
   Using `component-patterns.md`, identify what each visual element maps to:
   - Navigation sidebar → `NavDrawer` or flex column + `NavItem`
   - Data table → `DataGrid` with `DataGridHeader`, `DataGridBody`, `DataGridRow`, `DataGridCell`
   - Command bar → `Toolbar` with `ToolbarButton`, `ToolbarDivider`
   - Status indicators → `Badge`, `Tag`, or `MessageBar` based on context
   - Forms → `Field` + `Input`/`Dropdown`/`Switch`/`Checkbox`
   - Actions → `Button` with appearance `primary`/`subtle`/`outline`/`transparent`

4. **Map icons (two-tier strategy):**
   Using `icon-map.md`, identify icon names from SVG paths, class names, or aria-labels.
   - **Tier 1 (primary):** Match every detected icon to a named export from `@fluentui/react-icons` using the mapping tables. Import as individual React components — never wildcard import.
   - **Tier 2 (fallback):** For truly custom Azure-branded icons with no Fluent equivalent, plan an inline SVG component with `fill="currentColor"` and `aria-hidden="true"`.
   - For any icon that toggles between selected/unselected states (nav items, favorites), plan a `bundleIcon(Filled, Regular)` composite.
   - Use the Icon Detection Heuristic in `icon-map.md` to identify icon source (Fluent v9 SVG, v8 `ms-Icon` font, Font Awesome, Material, image, CSS background).

5. **Match grid template:**
   Use the `fluent-azure-grid-library` skill's MATCH algorithm:
   - Score the extracted layout against all templates in `grid-templates/`
   - If best score ≥ 0.5 → use that template as layout foundation
   - If best score < 0.5 → generate a custom layout and offer to save it as a new template

6. **Build the component tree:**
   Create a hierarchical plan of components:
   ```
   FluentProvider (azureLightTheme)
   └── Root (template: azure-resource-blade)
       ├── Breadcrumb
       │   └── BreadcrumbItem × N
       ├── Header
       │   ├── Title (Subtitle1)
       │   └── Toolbar (command bar)
       ├── Body
       │   ├── Sidebar (NavDrawer / nav)
       │   │   └── NavItem × N
       │   └── Content
       │       └── ... (page-specific)
       └── Footer (optional)
   ```

7. **Validate composition rules:**
   Read `composition-rules.md` and check the planned component tree against all 14 hard constraints and 5 soft constraints. Fix any violations before proceeding.

8. **Detect v8 compat requirement:**
   If v8 was detected in CAPTURE step, note that the output should use `ThemeProvider` + `AzureThemeLight` alongside `FluentProvider` for any v8-only components. See `azure-brand-ramp.md` for the compat wrapper.

---

## Phase 2 (Mode B): TEMPLATE-SELECT

For description-based builds, skip CAPTURE and ANALYZE:

1. Read the user's description
2. LIST available templates (via grid-library skill)
3. MATCH the description against templates
4. If match found → confirm with user → proceed to BUILD
5. If no match → offer to CREATE a new template or build with closest match

---

## Phase 3: BUILD

Generate the actual React component files.

### Output Structure

```
<output-dir>/
├── index.tsx          # Main component with FluentProvider wrapper
├── styles.ts          # makeStyles definitions (light + dark)
├── data.ts            # Mock data and type definitions
├── types.ts           # TypeScript interfaces
├── theme.ts           # Azure brand theme (light + dark)
├── grid-template.ts   # Extracted/matched grid template definition
├── icons.ts           # Icon imports + auto-extracted icon wrappers
├── assets/            # Auto-extracted SVGs and downloaded images (Tier 2 icons)
│   ├── icon-*.svg
│   └── icon-*.png
├── [ComponentName].stories.tsx  # Storybook story
└── README.md          # Component documentation
```

### Output Placement

Place output in the project based on detected project structure:
1. If `src/components/` exists → `src/components/<ComponentName>/`
2. If `src/pages/` exists → `src/pages/<ComponentName>/`
3. If `src/features/` exists → `src/features/<ComponentName>/`
4. If `app/` exists (Next.js) → `app/<component-name>/`
5. If none detected → `src/<ComponentName>/`
6. If incremental version → `<parent>/<ComponentName>/v{N}/`

### File Generation Rules

#### theme.ts
```typescript
import { createLightTheme, createDarkTheme, type BrandVariants, type Theme } from '@fluentui/react-components';

// Read azure-brand-ramp.md for the full BrandVariants object
const azureBrand: BrandVariants = { /* ... from reference ... */ };

export const azureLightTheme: Theme = {
  ...createLightTheme(azureBrand),
  // Azure-specific overrides from azure-brand-ramp.md
};

export const azureDarkTheme: Theme = {
  ...createDarkTheme(azureBrand),
  // Dark mode overrides from azure-brand-ramp.md
};
```

#### styles.ts
- Use `makeStyles` from `@fluentui/react-components` (Griffel)
- Reference `tokens.*` for ALL design values — **never hardcode colors, spacing, fonts, or shadows**
- Follow the matched grid template's `makeStyles` example
- Include dark mode styles only where theme tokens don't auto-adapt (rare — most Fluent tokens are theme-aware)

#### index.tsx
- Wrap entire component in `<FluentProvider theme={azureLightTheme}>` (or with ThemeToggle for dark mode)
- Import styles from `./styles`
- Import data from `./data`
- Import icons from `./icons`
- Follow the matched grid template's structural layout
- All interactive elements must have proper `aria-label` or `aria-labelledby`
- Use semantic HTML (`<nav>`, `<main>`, `<header>`, `<section>`)

#### data.ts
- Export typed mock data objects
- Use realistic Azure resource data (names like `vm-prod-west-01`, regions like `East US`, statuses)
- Export type interfaces alongside data

#### icons.ts
- **Read `icon-map.md` fully** before writing this file — it defines the two-tier strategy, import patterns, `bundleIcon()` usage, sizing, and component integration.
- Import only the icons actually used from `@fluentui/react-icons` — **named imports only, never `import *`** (the package has 10k+ exports).
- Use the mapping tables in `icon-map.md` to find the correct Fluent icon for each Azure portal concept.
- Use `Regular` variant by default; create `bundleIcon(Filled, Regular)` composites for icons that toggle between selected/unselected states.
- Export aliased names for each icon (e.g., `export { SearchRegular as SearchIcon }`) so `index.tsx` imports from `./icons` with semantic names.
- For icons with no `@fluentui/react-icons` match, auto-extract the SVG markup or download the image from the source page, save to `assets/` directory, and create a React wrapper component (see Tier 2 in `icon-map.md`).
- **Never use Iconify URLs, icon CDNs, or external icon services** — all icons must be locally bundled React components.
- **Never leave broken or placeholder icons** — every icon in the output must render.
- Follow the `icons.ts` file pattern example in `icon-map.md`.

#### [ComponentName].stories.tsx
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './index';

const meta: Meta<typeof ComponentName> = {
  title: 'Azure/<ComponentName>',
  component: ComponentName,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof ComponentName>;

export const Light: Story = {};
export const Dark: Story = {
  decorators: [(Story) => (
    <FluentProvider theme={azureDarkTheme}>
      <Story />
    </FluentProvider>
  )],
};
```

### v8 Compatibility Mode

If v8 was detected (or user explicitly requests v8 compat):

1. Add `@fluentui/react` and `@fluentui/azure-themes` to the imports
2. Wrap with `ThemeProvider` from v8 around v8 components
3. Wrap with `FluentProvider` from v9 around v9 components
4. Use `FluentProvider` as the outer wrapper, `ThemeProvider` as inner for v8 islands:
   ```tsx
   <FluentProvider theme={azureLightTheme}>
     {/* v9 components */}
     <ThemeProvider theme={AzureThemeLight}>
       {/* v8 components that have no v9 equivalent */}
     </ThemeProvider>
   </FluentProvider>
   ```
5. See `azure-brand-ramp.md` for the compat detection helper

### Dark Mode Dual Output

Every build produces both light and dark theme support:
- `theme.ts` exports both `azureLightTheme` and `azureDarkTheme`
- `index.tsx` accepts an optional `darkMode` prop or uses the `ThemeToggle` component
- Storybook stories include both `Light` and `Dark` variants

---

## Phase 4: VERIFY

Self-verify the generated output against the source (Mode A) or spec (Mode B/C).

**Read `references/verification.md` for the full verification procedure.**

### Verification Checks

1. **Visual comparison (Mode A):**
   - Render built component via Storybook or standalone HTML
   - Screenshot the rendered output
   - Compare against reference screenshot from CAPTURE
   - Classify deviations using the taxonomy in `verification.md`

2. **Grid template fidelity:**
   - Compare generated layout structure against the matched template
   - Verify all template slots are present and correctly styled
   - Check flex/grid properties match template definition

3. **Token compliance:**
   - Scan `styles.ts` for hardcoded values (hex colors, px font sizes, px spacing)
   - Every visual property must use a `tokens.*` reference
   - Azure-specific overrides must use the values from `azure-brand-ramp.md`

4. **Component composition validation:**
   - Read `composition-rules.md`
   - Check all 14 hard constraints against the generated JSX
   - Report any violations

5. **Accessibility audit:**
   - All images have `alt` text
   - All interactive elements have accessible names (`aria-label` or visible label)
   - Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text
   - Logical heading hierarchy (`h1` → `h2` → `h3`, no skips)
   - All form inputs associated with labels
   - Keyboard navigation works (tab order, focus visible)
   - No `tabIndex > 0`

6. **Interactive state verification:**
   - Hover states use `tokens.colorNeutralBackground1Hover` (or appropriate hover token)
   - Focus states show visible focus indicator using `tokens.colorStrokeFocus2`
   - Disabled states use `tokens.colorNeutralForegroundDisabled`
   - Active/pressed states use appropriate tokens

7. **Azure theme compliance:**
   - Brand color `#0078d4` used correctly (not overused)
   - Status colors match Azure conventions (green=running, red=error, yellow=warning, grey=stopped)
   - Navigation patterns follow Azure portal conventions

### Verification Report

Output a structured report:

```
## Verification Report

### Summary
- Mode: A (URL replication) / B (description) / C (Figma)
- Template: azure-resource-blade (score: 0.85)
- Overall: PASS / PASS WITH WARNINGS / FAIL

### Token Compliance: ✅ PASS
- 0 hardcoded values found

### Grid Fidelity: ✅ PASS
- 5/5 template slots present
- All flex/grid properties match

### Composition Rules: ✅ PASS
- 14/14 hard constraints satisfied
- 5/5 soft constraints satisfied

### Accessibility: ⚠️ WARNINGS
- 2 images missing alt text (lines 45, 67)
- Heading hierarchy: OK

### Interactive States: ✅ PASS
- Hover: verified
- Focus: verified
- Disabled: verified

### Visual Comparison (Mode A): ✅ PASS
- Color ΔE2000 max: 3.2 (within tolerance)
- Layout deviation: 2px max (within tolerance)
- 0 critical deviations, 2 minor deviations

### Deviations
| # | Type  | Severity | Element        | Source      | Output      | Action      |
|---|-------|----------|----------------|-------------|-------------|-------------|
| 1 | color | minor    | sidebar bg     | #f3f2f1     | #fafafa     | token match |
| 2 | space | minor    | card padding   | 14px        | 16px        | token snap  |
```

---

## Post-Build Self-Review

After BUILD and before VERIFY, run a custom code audit:

1. **For every custom HTML element:** Check if a native Fluent v9 component already handles this. Reference `component-patterns.md`.
2. **For every hardcoded value:** Check if it should be a `tokens.*` reference. Reference `token-map.md`.
3. **For every icon:** Verify the import exists in `@fluentui/react-icons`, the name matches the tables in `icon-map.md`, and icons are passed via the `icon` prop slot (not rendered as text children). Verify `bundleIcon()` is used for any toggle/selection state icons. Verify no wildcard imports, no Iconify URLs, no external icon CDNs.
4. **For every layout section:** Verify it matches the grid template. Reference the matched template file.

---

## Incremental Versioning

When updating an existing component:

1. Create a new version directory: `<parent>/<ComponentName>/v{N}/`
2. Copy the previous version's files as a starting point
3. Apply the requested changes
4. Generate a diff report comparing v{N} with v{N-1}:
   - Added/removed components
   - Changed styles
   - New/removed data fields
   - Layout changes

---

## Dependencies

The generated output requires these npm packages:

```json
{
  "@fluentui/react-components": "^9.x",
  "@fluentui/react-icons": "^2.x",
  "react": "^18.x",
  "react-dom": "^18.x"
}
```

Optional (v8 compat mode only):
```json
{
  "@fluentui/react": "^8.x",
  "@fluentui/azure-themes": "^8.x"
}
```

Optional (Storybook):
```json
{
  "@storybook/react": "^8.x"
}
```

---

## Hard Rules

1. **Never hardcode colors, fonts, spacing, or shadows.** Always use `tokens.*` from `@fluentui/react-components`.
2. **Always wrap in `FluentProvider`** with `azureLightTheme` or `azureDarkTheme`.
3. **Always produce both light and dark theme** support (via `theme.ts` exports + story variants).
4. **Always generate `.stories.tsx`** alongside the component.
5. **Always run composition validation** using `composition-rules.md` before finalizing.
6. **Always use `makeStyles`** (Griffel) — never inline styles, CSS modules, or styled-components.
7. **Always read all reference files** before starting BUILD. Do not rely on memory alone.
8. **Self-contained output** — no imports from shared prototyping apps or external experiment infrastructure.
9. **Project-structure-aware placement** — detect the project's directory conventions before placing files.
10. **Responsive breakpoints only when source has them** — do not add responsive behavior unless the source page or user request includes it.
11. **All icons must come from `@fluentui/react-icons`** as named React component imports — never use icon fonts (`ms-Icon`), Iconify CDN URLs, or external icon services. If no Fluent match exists, auto-extract the original asset from the source page (SVG markup or downloaded image), save to `assets/`, and wrap in a React component. **Every icon must render — no broken placeholders.** See `icon-map.md` for the full two-tier strategy.
