# Verification Procedure

How to verify a Fluent Azure recreation against the original UI. This is Phase 4 of the fluent-azure-replicator skill. The agent opens **both** the source page and the rendered output in Playwright, extracts computed styles from each, and compares element-by-element.

> **This is a live comparison — not a code review.** Both pages must be running in a browser. The agent navigates between them, extracts real computed styles, and flags every deviation with a severity, classification, and recommended action.

---

## Table of Contents

1. [Live Comparison Procedure](#live-comparison-procedure)
2. [Element Matching](#element-matching)
3. [Property Comparison Logic](#property-comparison)
4. [Tolerance Thresholds](#tolerances)
5. [Diff Classification Taxonomy](#classification)
6. [Color Distance Calculation](#color-distance)
7. [Grid Structure Comparison](#grid-comparison)
8. [Accessibility Audit](#accessibility-audit)
9. [Interactive State Verification](#interactive-states)
10. [Azure Theme Compliance](#azure-compliance)
11. [Report Format](#report-format)
12. [Next Steps & Questions Logic](#next-steps-logic)
13. [Auto-Fix & Re-Verify Loop](#auto-fix-loop)

---

## Live Comparison Procedure

### Prerequisites

Two pages must be accessible in the browser simultaneously:
- **Source page** — the original URL being replicated (or a screenshot + `captured-styles.json` from CAPTURE phase)
- **Output page** — the built component rendered via Storybook (`localhost:6006`), Vite dev server, or a temp HTML harness

### Extraction

Run the identical computed-style extraction script on both pages (see SKILL.md Phase 4, Step 3). This produces two comparable JSON arrays of element data:
- `source-styles.json` — from the source page
- `output-styles.json` — from the output page

Each element entry contains: `tag`, `text`, `role`, `ariaLabel`, `isIcon`, `rect { x, y, w, h }`, and `styles { color, backgroundColor, fontSize, fontWeight, ... }`

### Comparison Flow

```
For each source element:
  1. Find matching output element (see Element Matching)
  2. If no match → flag as MISSING
  3. If match found → compare every property (see Property Comparison)
  4. Classify each deviation (see Classification)
  5. Determine severity (see Tolerances)
  6. If isIcon → apply 0px tolerance for size

For each output element with no source match:
  → flag as EXTRA (may be intentional Fluent wrapper, or an error)
```

---

## Element Matching

Elements are matched between original and recreation by:
1. **Semantic role** — matching by ARIA role, tag purpose (heading level, nav, main, etc.)
2. **Visual position** — elements at similar positions in the visual hierarchy
3. **Text content** — elements containing the same text
4. **DOM structure** — similar depth and sibling position in the tree

If the original has N elements and the recreation has M, expect M ≤ N because Fluent components may consolidate multiple DOM elements into one. Unmatched original elements should be noted but aren't diffs.

---

## Property Comparison

### Critical (always compare)

- `color` — text color
- `backgroundColor` — surface color
- `fontSize` — text size
- `fontWeight` — text weight
- `fontFamily` — font stack (generic family match only)
- `lineHeight` — text line height

### Important (layout fidelity)

- `display` — flex, grid, block, etc.
- `flexDirection`, `alignItems`, `justifyContent` — flex layout
- `gridTemplateColumns`, `gridTemplateRows`, `gridTemplateAreas` — grid layout
- `paddingTop/Right/Bottom/Left` — internal spacing
- `marginTop/Right/Bottom/Left` — external spacing
- `gap` — flex/grid gap
- `width`, `height` — sizing (only for fixed-size elements)
- `borderRadius`

### Visual polish

- `borderTopWidth`, `borderTopColor`, `borderTopStyle`
- `boxShadow`
- `opacity`
- `cursor`

### Skip (don't compare)

- `transition`, `position`, `overflow`, `filter`, `backdropFilter`
- `maxWidth`, `minWidth`, `maxHeight`, `minHeight` — responsive constraints vary

---

## Tolerances

### Color tolerance

RGB euclidean distance: `sqrt((r1-r2)² + (g1-g2)² + (b1-b2)²)`

| Distance | Verdict |
|----------|---------|
| 0 | Exact match |
| 1–15 | Close enough — don't report |
| 16–40 | Minor — report as TOKEN-SNAP or COLOR-RAMP |
| 41–80 | Significant — report with explanation |
| > 80 | Major change — must explain |

### Size tolerance

| Pixel difference | Verdict |
|-----------------|---------|
| 0 | Exact match |
| 1–2px | Close enough — don't report |
| 3–4px | Minor — report as TOKEN-SNAP |
| 5–8px | Significant — report with explanation |
| > 8px | Major — must explain |
### Icon size tolerance

Icon sizes are **pixel-perfect — 0px tolerance**. The source icon dimensions (captured via `getBoundingClientRect()`) must be reproduced exactly in the output via `makeStyles` `fontSize` (or explicit `width`/`height` for non-square icons). Any deviation is reported as severity **major**.

| Pixel difference | Verdict |
|-----------------|--------|
| 0 | Exact match |
| ≥ 1px | Major — must fix. Set exact `fontSize` in `makeStyles` to match source dimensions. |
### Font weight tolerance

Must be exact match to a Fluent weight token (400, 500, 600, 700). Any change gets reported.

### Layout tolerance

`display`, `flexDirection`, `alignItems`, `justifyContent` must match exactly. Any change in layout type is always reported.

---

## Classification

Every difference gets exactly one label:

### TOKEN-SNAP
Original value snapped to nearest Fluent token (e.g., `15px` → `16px`).

### COMPONENT-DEFAULT
Fluent component enforces specific styling (e.g., `Button` padding is fixed).

### TYPE-RAMP
Text styling mapped to Fluent typographic scale (e.g., `22px` → `20px`).

### COLOR-RAMP
Color mapped to nearest Fluent color token (e.g., `#555` → `#616161`).

### ELEVATION
Shadow mapped to a Fluent elevation token (e.g., custom shadow → `shadow4`).

### LAYOUT-PRESERVED
Layout property kept identical. Used for context in elements where other properties changed.

### GRID-MATCH
Grid/flex structure successfully matched to a stored grid template. Note which template was used.

### GRID-DEVIATION
Grid structure differs from the matched template. Detail which slots, columns, or rows differ.

### INTENTIONAL-DEVIATION
Deliberate design change to align with Fluent design principles. Requires justification.

### UNRESOLVED
No satisfactory Fluent equivalent found. Present 2–3 options with tradeoffs.

---

## Color Distance Calculation

### RGB Euclidean Distance

```
Parse colors to RGB:
  "rgb(50, 49, 48)" → r=50, g=49, b=48
  "#323130" → r=50, g=49, b=48

Distance = sqrt((r1-r2)² + (g1-g2)² + (b1-b2)²)
Max possible = sqrt(3 × 255²) ≈ 441
```

### Parsing formats

| Format | Approach |
|--------|----------|
| `rgb(r, g, b)` | Extract three integers |
| `rgba(r, g, b, a)` | Extract RGB + alpha (compare alpha separately) |
| `#RRGGBB` | Parse hex pairs |
| `#RGB` | Expand: `#abc` → `#aabbcc` |
| Named colors | Lookup table |
| `transparent` | → `rgba(0, 0, 0, 0)` — compare alpha only |

### WCAG Contrast Ratio (for Accessibility Audit)

```
relativeLuminance(rgb) = 0.2126 * R + 0.7152 * G + 0.0722 * B
  where R = (r/255)^2.2 (simplified gamma)
  
contrastRatio = (L1 + 0.05) / (L2 + 0.05)
  where L1 = lighter, L2 = darker

WCAG AA: ≥ 4.5:1 for normal text, ≥ 3:1 for large text (≥18px or ≥14px bold)
WCAG AAA: ≥ 7:1 for normal text, ≥ 4.5:1 for large text
```

---

## Grid Structure Comparison

### What to compare

For each layout container (grid or flex parent), compare:

| Property | How |
|----------|-----|
| `display` | Must match (grid vs flex vs block) |
| `gridTemplateColumns` | Column count and track sizes |
| `gridTemplateRows` | Row count and track definitions |
| `gridTemplateAreas` | Named area strings |
| `flexDirection` | Must match (row, column) |
| `flexWrap` | Must match |
| `gap` | Within token-snap tolerance |
| Child count | Must match |
| Child placement | Grid area or flex order |

### Template matching

If a grid template was selected during BUILD, compare the output against the template definition:

```
Score = weighted sum of:
  - Column count match (30%)
  - Row structure similarity (20%)
  - Slot name/area overlap (25%)
  - Responsive breakpoint similarity (15%)
  - Slot constraint similarity (10%)
  
Template fidelity: score > 0.8 = GRID-MATCH, otherwise GRID-DEVIATION
```

### Grid deviation reporting

For each GRID-DEVIATION, report:
- Which property differs
- Original value vs. recreation value
- Whether this is a TOKEN-SNAP (e.g., column gap 15px → 16px) or structural change

---

## Accessibility Audit

Run after rendering the Fluent v9 output. This is a separate sub-phase within VERIFY.

### Checks

1. **Focus order** — Tab through all interactive elements. Verify logical order matches visual layout. Report any skips or loops.

2. **Interactive element labels** — Every `<Button>`, `<Input>`, `<Link>`, `<Checkbox>`, `<Select>`, etc. must have:
   - Visible label text, OR
   - `aria-label`, OR
   - `aria-labelledby` pointing to a visible element
   
   Report any unlabeled interactive elements as a11y violations.

3. **Color contrast** — For every foreground/background pair in the rendered output:
   - Calculate WCAG contrast ratio
   - Flag any pair below 4.5:1 (normal text) or 3:1 (large text / UI components)
   - Check both light and dark theme variants

4. **Heading hierarchy** — Verify heading levels are sequential (no skipping from h1 to h3). Typography components (`Title1`, `Subtitle1`, etc.) should correspond to semantic heading levels.

5. **ARIA roles** — If the source had `role` attributes, verify they're preserved or the Fluent component provides equivalent semantics.

6. **Keyboard interaction** — Fluent v9 components handle this natively. Check that custom `makeStyles` containers with `onClick` also have `role="button"`, `tabIndex={0}`, and `onKeyDown` for Enter/Space.

7. **Alt text** — Every `<Image>` has `alt`. Decorative images have `alt=""` and `aria-hidden="true"`.

### Contrast Matrix Output

Generate a table of every foreground/background token pair used:

```markdown
| Foreground token | Background token | Ratio | Pass (AA) |
|------------------|------------------|-------|-----------|
| colorNeutralForeground1 (#242424) | colorNeutralBackground1 (#fff) | 16.6:1 | ✅ |
| colorNeutralForeground3 (#616161) | colorNeutralBackground1 (#fff) | 5.9:1 | ✅ |
| colorNeutralForegroundOnBrand (#fff) | colorBrandBackground (#0078d4) | 4.5:1 | ✅ |
| colorNeutralForeground4 (#707070) | colorNeutralBackground2 (#fafafa) | 4.2:1 | ⚠️ borderline |
```

---

## Interactive State Verification

If interactive states were captured in Phase 1, verify them:

### Hover states

1. Use Playwright `browser_hover` on each interactive element
2. Take a screenshot after hover
3. Extract computed styles while hovered
4. Compare hover color/background against the Fluent token used:
   - `colorNeutralBackground1Hover` should appear on hoverable surfaces
   - `colorBrandBackgroundHover` should appear on brand buttons
   - If the source hover color doesn't match any hover token, flagas COLOR-RAMP

### Focus states

1. Tab to each interactive element
2. Verify a focus ring is visible (Fluent v9 components use `outline` for focus-visible)
3. Takes screenshot of focus state
4. Focus ring should use `colorStrokeFocus1` and `colorStrokeFocus2` tokens

### Disabled states

1. If source had disabled elements, verify the recreation shows:
   - Reduced opacity or `colorNeutralForegroundDisabled` text
   - `colorNeutralStrokeDisabled` border
   - No hover/focus response

---

## Azure Theme Compliance

When the output uses the Azure brand theme, verify Azure-specific patterns:

1. **Brand color usage** — Primary actions use `colorBrandBackground` (Azure blue). Verify it renders close to `#0078d4`.

2. **Status colors** — Success/warning/error use the correct status tokens, not brand tokens.

3. **Data visualization** — If charts/graphs are present, verify colors come from `azureDataColors` (see `azure-brand-ramp.md`), not arbitrary values.

4. **Command bar** — If present, verify it uses `Toolbar` with `appearance="subtle"` buttons and the correct border/background tokens.

5. **Dark mode** — If dual output was generated, verify the dark theme renders correctly:
   - Background is dark (`colorNeutralBackground1` → `#1e1e1e`)
   - Text is light (`colorNeutralForeground1` → `#cccccc`)
   - Brand colors adjust automatically via the theme
   - No hardcoded colors that break in dark mode

---

## Report Format

### Summary block

```markdown
## Conversion Summary

| Metric | Count |
|--------|-------|
| Total elements compared | 47 |
| Exact matches | 12 |
| TOKEN-SNAP adjustments | 18 |
| TYPE-RAMP adjustments | 6 |
| COLOR-RAMP adjustments | 8 |
| ELEVATION mapping | 3 |
| COMPONENT-DEFAULT | 5 |
| GRID-MATCH | 2 |
| GRID-DEVIATION | 0 |
| INTENTIONAL-DEVIATION | 2 |
| UNRESOLVED | 1 |

**Visual fidelity: 93%** (excluding UNRESOLVED)
**Grid template fidelity: 100%**
**Accessibility: 12/12 checks passed**
**Dark mode: ✅ verified**
```

### A11y section

```markdown
## Accessibility Audit

| Check | Result |
|-------|--------|
| All interactive elements labeled | ✅ |
| Color contrast (AA) | ✅ 22/22 pairs pass |
| Heading hierarchy | ✅ sequential |
| Focus order logical | ✅ |
| Keyboard navigation | ✅ |
| ARIA roles preserved | ✅ |
| Image alt text | ✅ |

### Contrast Matrix
(table of foreground/background pairs with ratios)
```

### Detailed diff table

For each element with differences:

```markdown
### `.page-title` → `<Subtitle1>`

| Property | Original | Fluent v9 | Token | Category |
|----------|----------|-----------|-------|----------|
| fontSize | 22px | 20px | fontSizeBase500 | TYPE-RAMP |
| fontWeight | 700 | 600 | fontWeightSemibold | TYPE-RAMP |
| color | #333 | #242424 | colorNeutralForeground1 | COLOR-RAMP |
```

### Grid template section

```markdown
## Grid Template

**Matched template:** `azure-resource-blade`
**Template fidelity:** 95%

| Slot | Template | Actual | Match |
|------|----------|--------|-------|
| sidebar width | 220px | 220px | ✅ |
| content columns | 1fr | 1fr | ✅ |
| header height | auto | auto | ✅ |
| gap | 0 | 0 | ✅ |
```

### UNRESOLVED items

```markdown
## Unresolved Items

### 1. Custom gradient header
**Original:** `linear-gradient(135deg, #667eea, #764ba2)`
**Options:**
1. `colorBrandBackground` (solid) — simplest
2. Keep gradient as custom CSS — breaks token governance
3. Two-tone adjacent sections
**Recommendation:** Option 1
```

### Interactive states section

```markdown
## Interactive States

| Element | State | Expected Token | Actual | Match |
|---------|-------|---------------|--------|-------|
| Primary button | hover | colorBrandBackgroundHover | #115ea3 | ✅ |
| Primary button | focus | focus ring visible | yes | ✅ |
| Table row | hover | colorNeutralBackground1Hover | #f5f5f5 | ✅ |
| Nav item | active | colorNeutralBackground1Pressed | #e0e0e0 | ✅ |
```

### Next Steps & Questions section

The report must end with **Next Steps** and **Questions for User**. These are generated automatically based on deviation severity and classification.

```markdown
### Next Steps

- [ ] **Fix:** Sidebar icon is 18px but source is 16px — update `makeStyles` fontSize to 16px [MAJOR]
- [ ] **Fix:** Missing `aria-label` on filter button — add descriptive label [MAJOR]
- [ ] **Review:** Header background is #f5f5f5 vs source #f0f0f0 — ΔE 8, within TOKEN-SNAP but visible [SIGNIFICANT]
- [ ] **Accept:** Card padding 14px → 16px (spacingHorizontalM) — standard Fluent token snap [MINOR]
- [ ] **Accept:** Font weight 450 → 400 — nearest Fluent weight token [MINOR]

### Questions for User

1. The source header uses `linear-gradient(135deg, #667eea, #764ba2)` — should we (a) replace with solid `colorBrandBackground`, (b) keep as custom CSS, or (c) use two adjacent colored sections?
2. The source sidebar is 215px — the nearest Fluent-friendly value is 220px (spacingHorizontalXXXL × multiples). Accept 220px or force 215px with a custom value?
3. The source has no dark mode — should the dark theme variant match a "best guess" dark version, or skip dark mode entirely?
```

### Decision rules for Next Steps vs Questions

**Auto-generate as "Fix" (severity MAJOR):**
- Icon size mismatch (any Δ ≥ 1px)
- Missing accessibility attributes (aria-label, alt text, role)
- Hardcoded color/font/spacing in `styles.ts` (should be a token)
- Broken or missing icon (not rendering)
- Layout type mismatch (flex vs grid vs block)

**Auto-generate as "Review" (severity SIGNIFICANT):**
- Color difference ΔE 41–80
- Spacing difference 5–8px
- Font size difference 5–8px
- Shadow mismatch that doesn't map to any Fluent elevation

**Auto-generate as "Accept" (severity MINOR):**
- Color difference ΔE 16–40 (token snap)
- Spacing difference 3–4px (token snap)
- Font weight mapped to nearest Fluent weight
- Border radius snapped to Fluent token

**Auto-generate as "Question" (agent can't decide):**
- Source uses custom CSS with no Fluent equivalent (gradients, animations, clip-path)
- Source spacing doesn't align to any Fluent token AND the visual gap is >4px
- Multiple valid Fluent components could represent the same source pattern
- Dark mode reveals issues not present in source (source had no dark mode)
- Source has accessibility issues that would be inherited (low contrast in original)
- Source uses a third-party component with no Fluent counterpart

---

## Auto-Fix & Re-Verify Loop

When the report contains **MAJOR** severity items:

1. **Auto-fix each major item** — the agent edits the source files directly:
   - Icon size wrong → update `fontSize` in `styles.ts`
   - Missing aria-label → add to the JSX in `index.tsx`
   - Hardcoded color → replace with `tokens.*`
   - Missing icon → re-run icon detection or auto-extract

2. **Rebuild** — hot-reload or rebuild the output component

3. **Re-verify** — re-run Steps 3–5 from the SKILL.md Phase 4 procedure:
   - Navigate to the output page
   - Re-extract computed styles
   - Compare against source styles again
   - Generate an updated report

4. **Repeat** until:
   - All MAJOR items are resolved, OR
   - A MAJOR item requires user input → convert to a Question

5. **Present the final report** to the user with:
   - All remaining deviations (MINOR/SIGNIFICANT only)
   - Any Questions that need user decisions
   - A confirmation that all MAJOR items have been resolved

The loop should not exceed **3 iterations**. If items can't be resolved in 3 passes, surface them as Questions.
