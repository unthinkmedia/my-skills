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
| `references/decision-table.md`          | Intent → deterministic build plan mapping (layout, fragments, canonical example) |
| `references/style-assertions.md`        | Hard style constraints checked during BUILD (token values, layout rules) |
| `references/output-schema.md`           | Structural validation checklist + grep checks for generated files |
| `references/canonical-examples/*/`      | Gold-standard complete outputs for few-shot anchoring (resource-blade, browse-list, dashboard) |
| `references/fragments/*.tsx`            | Copy-paste-ready composable sub-patterns (command-bar, sidebar-nav, data-table, etc.) |

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
   - **Record the exact `w` and `h` pixel dimensions** — these are the pixel-perfect target sizes for the BUILD phase
   - First attempt to match to `@fluentui/react-icons` using `icon-map.md` tables (check `dataIconName`, `nearbyLabel`, `alt` text)
   - If no match found, save the SVG markup or download the image URL to `<output-dir>/assets/`
   - Create a React wrapper component in `icons.ts` following the Tier 2 pattern in `icon-map.md`
   - For **every icon** (Tier 1 or Tier 2), add the source dimensions as a comment in `icons.ts` and apply the exact size via a `makeStyles` class — see the pixel-perfect sizing rules in `icon-map.md`
   - Goal: **zero broken icons AND pixel-perfect sizes** in the final output

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
   - `references/decision-table.md`
   - `references/style-assertions.md`
   - `references/output-schema.md`

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

5b. **Look up decision table:**
   Read `references/decision-table.md` and match the detected page type against the Intent Patterns column:
   - If a row matches → the build plan is fully determined: use its Layout Template, Fragments, and Canonical Example
   - Record which fragments are required (command-bar, sidebar-nav, data-table, etc.)
   - This overrides any ambiguous component mapping from step 3

5c. **Load canonical example:**
   Based on the decision table match, read the corresponding canonical example from `references/canonical-examples/<type>/`:
   - Read ALL files in the example directory (index.tsx, styles.ts, data.ts, icons.ts, theme.ts, stories)
   - Use the canonical example as the primary structural template — match its file organization, import patterns, and component composition
   - The canonical example anchors the output more strongly than prose rules

5d. **Load required fragments:**
   For each fragment listed in the decision table row, read the fragment file from `references/fragments/<name>.tsx`:
   - Use the fragment's exact component structure, styles, and patterns
   - Adapt prop names and type definitions to the specific page being built
   - Never regenerate a pattern from scratch when a fragment exists for it

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

For description-based builds, skip CAPTURE and use the decision table for deterministic planning:

1. Read the user's description
2. **Look up the decision table** (`references/decision-table.md`): match the description against Intent Patterns
3. If a row matches → the build plan is fully determined:
   - Layout Template, Fragments, Canonical Example, and feature flags (Sidebar, DataGrid, etc.) are all specified
   - Read the matched canonical example from `references/canonical-examples/<type>/` — use as the structural anchor
   - Read each required fragment from `references/fragments/` — compose into the build
   - Confirm with user → proceed to BUILD
4. If no row matches → fall back to grid-library MATCH:
   - LIST available templates (via grid-library skill)
   - MATCH the description against templates
   - If match found → confirm with user → proceed to BUILD
   - If no match → offer to CREATE a new template or build with closest match

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

### Pre-Build: Load Canonical Example & Fragments

Before generating any file:

1. **Read the canonical example** identified during ANALYZE/TEMPLATE-SELECT from `references/canonical-examples/<type>/`
   - Read every file in the directory (index.tsx, styles.ts, data.ts, icons.ts, theme.ts, stories)
   - Use the canonical example as the primary template — match its structure, patterns, and conventions

2. **Read each required fragment** from `references/fragments/`
   - For each sub-pattern needed (command bar, sidebar, data table, etc.), read the fragment file
   - Copy the fragment's component structure and adapt only the data/prop types

3. **Read style assertions** from `references/style-assertions.md`
   - Every makeStyles class must satisfy the assertions for its element type
   - Check each generated style value against the assertion table before writing

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

## Phase 4: VERIFY — Live Side-by-Side Comparison

Open **both** the original source page and the rendered output in Playwright, extract computed styles from each, and compare element-by-element. This is not a code review — it's a **live visual and data-driven audit**.

**Read `references/verification.md` for tolerance thresholds, classification taxonomy, and color distance formulas.**

### Step 1: Render the Output

Before comparing, the output must be running in a browser.

1. **If the project has Storybook:**
   ```bash
   # Start Storybook (background process)
   npx storybook dev -p 6006 --no-open
   ```
   The component's story URL will be `http://localhost:6006/?path=/story/azure-<component-name>--light`

2. **If no Storybook, create a temp HTML harness:**
   ```bash
   # Build the component and serve
   npx vite preview  # or any dev server
   ```

3. **If neither works, create a minimal harness file** (`verify-harness.html`) that imports React + FluentProvider + the built component and renders it full-page. Serve with `npx serve .`

Record the **output URL** (e.g., `http://localhost:6006/...` or `http://localhost:3000`).

### Step 2: Open Both Pages

Open the **source page** and the **output page** in separate Playwright tabs:

```
1. Use mcp_microsoft_pla_browser_install (if not already installed)
2. Use mcp_microsoft_pla_browser_navigate with url=<source-url>
3. Use mcp_microsoft_pla_browser_take_screenshot — save as "verify-source.png"
```

Then open a new tab for the output:
```
4. Use mcp_microsoft_pla_browser_navigate with url=<output-url>
5. Use mcp_microsoft_pla_browser_take_screenshot — save as "verify-output.png"
```

### Step 3: Extract Computed Styles from Both Pages

Run the **same** style extraction script on both pages to produce comparable JSON. Switch between tabs to extract from each.

**On the SOURCE page:**
```javascript
// Use mcp_microsoft_pla_browser_evaluate:
(() => {
  const results = [];
  document.querySelectorAll('*').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const cs = getComputedStyle(el);
    const tag = el.tagName.toLowerCase();
    const text = (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3)
      ? el.textContent?.trim().substring(0, 80) : '';
    const role = el.getAttribute('role') || '';
    const ariaLabel = el.getAttribute('aria-label') || '';

    // Detect icons
    const isIcon = (tag === 'svg' || tag === 'img') && rect.width <= 48 && rect.height <= 48;

    results.push({
      tag, text, role, ariaLabel, isIcon,
      rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
      styles: {
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: cs.fontFamily,
        lineHeight: cs.lineHeight,
        display: cs.display,
        flexDirection: cs.flexDirection,
        alignItems: cs.alignItems,
        justifyContent: cs.justifyContent,
        gap: cs.gap,
        padding: cs.padding,
        margin: cs.margin,
        borderRadius: cs.borderRadius,
        border: cs.border,
        boxShadow: cs.boxShadow,
        width: cs.width,
        height: cs.height,
        opacity: cs.opacity,
      },
    });
  });
  return JSON.stringify(results.slice(0, 300));
})()
```

Save the result as `source-styles.json`.

**Switch to the OUTPUT page** and run the identical script. Save as `output-styles.json`.

### Step 4: Element-by-Element Comparison

Match elements between source and output using `verification.md` matching rules (semantic role → visual position → text content → DOM structure). For each matched pair, compare every property using the tolerance thresholds:

**Walk through these categories in order:**

#### 4a. Layout Structure
- Compare every flex/grid container: `display`, `flexDirection`, `gridTemplateColumns`, `gap`, child count
- Verify the overall page structure matches (sidebar width, content areas, header height)
- **Tolerance:** must match exactly — any layout type change is reported

#### 4b. Typography
- Compare every text element: `fontSize`, `fontWeight`, `fontFamily`, `lineHeight`, `color`
- **Tolerance:** font size ±2px, font weight exact, color ΔE ≤15

#### 4c. Colors & Backgrounds
- Compare every surface: `backgroundColor`, `color`, `borderColor`
- **Tolerance:** RGB distance ≤15 = close enough, 16–40 = minor, 41–80 = significant, >80 = major

#### 4d. Spacing
- Compare `padding`, `margin`, `gap` on all elements
- **Tolerance:** ±2px = close enough, 3–4px = minor, 5–8px = significant, >8px = major

#### 4e. Borders & Shadows
- Compare `border`, `borderRadius`, `boxShadow`
- **Tolerance:** borderRadius ±2px, shadow must map to a Fluent elevation token

#### 4f. Icons (Pixel-Perfect)
- For every element where `isIcon: true`, compare `rect.w` and `rect.h` between source and output
- **Tolerance: 0px** — icon sizes must match exactly
- Also verify icon color matches the source (via the `color` or `fill` property)
- Report any mismatch as severity **major**

#### 4g. Interactive States
Use Playwright to verify hover/focus/disabled states:

```
1. Use mcp_microsoft_pla_browser_hover on each button/link in the OUTPUT page
2. Use mcp_microsoft_pla_browser_evaluate to extract hovered computed styles
3. Compare against expected Fluent hover tokens (e.g., colorNeutralBackground1Hover)
4. Tab through interactive elements to verify focus ring visibility
```

#### 4h. Accessibility
```
1. Use mcp_microsoft_pla_browser_snapshot on the OUTPUT page
2. Check: all interactive elements have accessible names
3. Check: heading hierarchy is sequential
4. Check: images have alt text
5. Calculate WCAG contrast ratios for all foreground/background pairs
```

### Step 5: Generate Verification Report

Compile all findings into a **brief, actionable report**. The report has three sections:

```markdown
## Verification Report

### Summary
- Source: <source-url>
- Output: <output-url>  
- Mode: A (URL replication) / B (description) / C (Figma)
- Template: <matched-template> (score: X.XX)
- Elements compared: N source → M output (K matched)
- Overall: ✅ PASS / ⚠️ PASS WITH WARNINGS / ❌ FAIL

### Results

| Category | Status | Details |
|----------|--------|---------|
| Layout structure | ✅ | N/N containers match |
| Typography | ✅ | All text within ±2px |
| Colors | ⚠️ | 2 minor deviations (TOKEN-SNAP) |
| Spacing | ✅ | All within ±2px |
| Borders & shadows | ✅ | All mapped to Fluent tokens |
| Icon sizes | ✅ | N/N pixel-perfect |
| Icon rendering | ✅ | 0 broken, 0 missing |
| Interactive states | ✅ | Hover, focus, disabled verified |
| Accessibility | ✅ | All checks pass, contrast AA ✅ |
| Token compliance | ✅ | 0 hardcoded values |
| Dark mode | ✅ | Renders correctly |

### Deviations (if any)

| # | Element | Property | Source | Output | Δ | Severity | Classification |
|---|---------|----------|--------|--------|---|----------|----------------|
| 1 | sidebar bg | background | #f3f2f1 | #fafafa | ΔE 12 | minor | TOKEN-SNAP |
| 2 | card padding | padding | 14px | 16px | 2px | minor | TOKEN-SNAP |

### Next Steps

<!-- Auto-generated based on findings -->
- [ ] **Fix:** [list any MAJOR severity items that must be corrected]
- [ ] **Review:** [list SIGNIFICANT items that may need adjustment]
- [ ] **Accept:** [list MINOR items that are acceptable token snaps]

### Questions for User

<!-- Auto-generated when the agent can't determine intent -->
- The source uses a custom gradient on the header — should we keep it as custom CSS or replace with `colorBrandBackground`?
- The source sidebar is 215px but the nearest Fluent spacing token gives 220px — accept 220px or force 215px?
```

### Decision Rules for Next Steps vs Questions

**Auto-fix (no question needed):**
- Icon size mismatch → fix the `fontSize` in `makeStyles`
- Missing `aria-label` → add it
- Hardcoded color → replace with token
- Missing icon → re-run detection or auto-extract

**Ask the user (generate a Question):**
- Source uses custom styling with no clear Fluent equivalent (gradients, custom animations)
- Source spacing doesn't align to any Fluent token and the visual gap is >4px
- Source uses a component pattern that could map to multiple Fluent components
- Dark mode reveals issues that weren't in the source (source had no dark mode)
- Source has accessibility issues that would be inherited (low contrast in source)

**Report as accepted deviation:**
- Color difference ΔE ≤15 (imperceptible token snap)
- Spacing difference ≤2px (sub-pixel token snap)
- Font weight mapped to nearest Fluent weight (e.g., 450 → 400)
- Border radius snapped to Fluent token (e.g., 3px → `borderRadiusSmall` = 4px)

### Step 6: Auto-Fix and Re-Verify

If the report contains any **MAJOR** severity items:

1. Fix each major item in the source code
2. Rebuild / hot-reload the output
3. Re-run Steps 3–5 on the updated output
4. Continue until all major items are resolved or converted to user questions
5. Present the final report to the user

---

## Post-Build Self-Review

After BUILD and before the live VERIFY, run a static code audit:

1. **For every custom HTML element:** Check if a native Fluent v9 component already handles this. Reference `component-patterns.md`.
2. **For every hardcoded value:** Check if it should be a `tokens.*` reference. Reference `token-map.md`.
3. **For every icon:** Verify the import exists in `@fluentui/react-icons`, the name matches the tables in `icon-map.md`, and icons are passed via the `icon` prop slot (not rendered as text children). Verify `bundleIcon()` is used for any toggle/selection state icons. Verify no wildcard imports, no Iconify URLs, no external icon CDNs. **Verify that every icon has a `makeStyles` class setting its exact source pixel dimensions** — check the size comments in `icons.ts` against the `fontSize` values in `styles.ts`.
4. **For every layout section:** Verify it matches the grid template. Reference the matched template file.
5. **Run style assertions check:** Read `references/style-assertions.md` and verify every makeStyles class in `styles.ts` satisfies the relevant assertions. Fix any violations.
6. **Run output schema validation:** Read `references/output-schema.md` and execute the structural checklist against all generated files. Run the grep checks from the schema. Fix any failures before proceeding to VERIFY.
7. **Compare against canonical example:** Diff the generated output's structure against the canonical example used during BUILD. Flag any structural deviations (missing files, different import patterns, different component hierarchy).

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
12. **Always consult the decision table first.** Before any build, read `references/decision-table.md` and match the page type. If a row matches, its build plan is authoritative — do not deviate from the specified layout template, fragments, or canonical example.
13. **Always read the matching canonical example before generating code.** The canonical example in `references/canonical-examples/` is the structural anchor — match its file organization, import patterns, naming conventions, and component hierarchy.
14. **Always use fragments for recurring sub-patterns.** If a fragment exists in `references/fragments/` for a sub-pattern (command bar, sidebar nav, data table, etc.), use its exact structure. Never regenerate these patterns from scratch.
15. **Always validate against style assertions during BUILD.** Read `references/style-assertions.md` and check every makeStyles block against its element-type assertions before writing `styles.ts`. Violations must be fixed before the file is written.
16. **Always run output schema validation after BUILD.** Read `references/output-schema.md` and execute all structural checks and grep commands. All checks must pass before proceeding to VERIFY.
