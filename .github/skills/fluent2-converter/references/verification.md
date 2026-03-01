# Verification Procedure

How to self-check a Fluent 2 recreation against the original UI. This is Phase 4 of the fluent2-converter skill.

---

## Table of Contents

1. [Comparison Setup](#comparison-setup)
2. [Property Comparison Logic](#property-comparison)
3. [Tolerance Thresholds](#tolerances)
4. [Diff Classification Taxonomy](#classification)
5. [Color Distance Calculation](#color-distance)
6. [Report Format](#report-format)

---

## Comparison Setup

### Prerequisites

You need two JSON files from the style extraction script:
- `captured-styles.json` — extracted from the original UI (Phase 1)
- `recreated-styles.json` — extracted from the Fluent 2 version (Phase 4)

### Element Matching

Elements are matched between original and recreation by:
1. **Semantic role** — matching by ARIA role, tag purpose (heading level, nav, main, etc.)
2. **Visual position** — elements at similar positions in the visual hierarchy
3. **Text content** — elements containing the same text
4. **DOM structure** — similar depth and sibling position in the tree

If the original has N elements and the recreation has M, expect M ≤ N because Fluent 2 components may collapse multiple DOM elements into one. Unmatched original elements should be noted but aren't diffs — they're consolidation.

---

## Property Comparison

For each matched element pair, compare every style property and classify the result.

### Properties to compare (in priority order)

**Critical (always compare):**
- `color` — text color
- `backgroundColor` — surface color
- `fontSize` — text size
- `fontWeight` — text weight
- `fontFamily` — font stack (generic family match only)
- `lineHeight` — text line height

**Important (compare for layout fidelity):**
- `display` — flex, grid, block, etc.
- `flexDirection`, `alignItems`, `justifyContent` — flex layout
- `gridTemplateColumns`, `gridTemplateRows` — grid layout
- `paddingTop/Right/Bottom/Left` — internal spacing
- `marginTop/Right/Bottom/Left` — external spacing
- `gap` — flex/grid gap
- `width`, `height` — sizing (only for fixed-size elements)
- `borderRadius` — corner rounding

**Visual polish (compare for design fidelity):**
- `borderTopWidth`, `borderTopColor`, `borderTopStyle` — borders
- `boxShadow` — elevation
- `opacity` — transparency
- `cursor` — interaction hint

**Skip (don't compare):**
- `transition` — animation timing doesn't affect visual output
- `position` — layout differences are expected
- `overflow` — component internals handle this
- `filter`, `backdropFilter` — rarely used, Fluent doesn't have tokens for these
- `maxWidth`, `minWidth`, `maxHeight`, `minHeight` — responsive constraints vary

---

## Tolerances

Each property type has a tolerance threshold. Differences within tolerance are marked "close enough" and don't need reporting.

### Color tolerance

Use deltaE (CIE76 simplified) or RGB euclidean distance:

```
distance = sqrt((r1-r2)² + (g1-g2)² + (b1-b2)²)
```

| Distance | Verdict |
|----------|---------|
| 0 | Exact match |
| 1–15 | Close enough — don't report |
| 16–40 | Minor deviation — report as TOKEN-SNAP or COLOR-RAMP |
| 41–80 | Significant — report with explanation |
| > 80 | Major change — must explain |

### Size tolerance (font-size, padding, margin, gap, border-radius)

| Pixel difference | Verdict |
|-----------------|---------|
| 0 | Exact match |
| 1–2px | Close enough — don't report |
| 3–4px | Minor — report as TOKEN-SNAP |
| 5–8px | Significant — report with explanation |
| > 8px | Major — must explain |

### Font weight tolerance

Must be exact match to a Fluent 2 weight token (400, 500, 600, 700). Any weight change gets reported.

### Layout tolerance

`display`, `flexDirection`, `alignItems`, `justifyContent` must match exactly. Any change in layout type (flex→grid, block→flex) is always reported.

---

## Classification

Every difference gets exactly one of these labels:

### TOKEN-SNAP
The original value was nudged to the nearest Fluent 2 token.
- Example: `padding: 15px` → `padding: 16px` (spacingVerticalL)
- Example: `border-radius: 5px` → `border-radius: 4px` (borderRadiusMedium)
- This is the most common category. Expected and non-controversial.

### COMPONENT-DEFAULT
A Fluent 2 component enforces specific styling that overrides the source.
- Example: `<Button>` has fixed padding of `5px 12px` for medium size — can't be changed without breaking component consistency
- Example: `<Input>` has specific height and border behavior built in
- Explanation should reference the specific component and why overriding would be harmful.

### TYPE-RAMP
Text styling mapped to the Fluent 2 typographic scale.
- Example: `font-size: 22px` → `20px` (fontSizeBase500 via `<Subtitle1>`)
- Example: `font-weight: 800` → `700` (fontWeightBold — Fluent max)
- Pair the before/after with the typography preset name for clarity.

### COLOR-RAMP
Color mapped to the nearest Fluent 2 color token.
- Example: `color: #555` → `#616161` (colorNeutralForeground3)
- Include the deltaE distance if > 15.

### ELEVATION
Shadow/depth mapped to a Fluent 2 elevation token.
- Example: `box-shadow: 0 3px 6px rgba(0,0,0,0.16)` → `shadow4`
- Fluent shadows are very specific — explain which elevation was chosen and why.

### LAYOUT-PRESERVED
A layout property that was kept identical. Not a diff — used to confirm fidelity.
- Only include in the detailed report for elements where other properties changed (provides context).

### INTENTIONAL-DEVIATION
A deliberate design change to align with Fluent 2 design principles.
- Example: Removing a gradient background in favor of a solid brand token
- Example: Replacing a custom icon set with Fluent icons
- Always requires a clear justification explaining the design rationale.

### UNRESOLVED
Could not find a satisfactory Fluent 2 equivalent.
- Example: Custom gradient, complex animation, SVG filter effect
- Present 2–3 options for the user to choose from, with tradeoffs for each.

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

### Parsing common formats

| Format | Regex / approach |
|--------|-----------------|
| `rgb(r, g, b)` | Extract three integers |
| `rgba(r, g, b, a)` | Extract RGB + alpha (compare alpha separately) |
| `#RRGGBB` | Parse hex pairs |
| `#RGB` | Expand: `#abc` → `#aabbcc` |
| Named colors | Lookup table (e.g., `white` → `#ffffff`) |
| `transparent` | → `rgba(0, 0, 0, 0)` — compare alpha only |

### Alpha comparison

If the original has alpha < 1 and the token uses alpha = 1 (or vice versa), this is always reported. Fluent 2 tokens are almost entirely opaque.

---

## Report Format

### Summary block

```markdown
## Conversion Summary

| Metric | Count |
|--------|-------|
| Total elements compared | 47 |
| Exact matches (all properties) | 12 |
| TOKEN-SNAP adjustments | 18 |
| TYPE-RAMP adjustments | 6 |
| COLOR-RAMP adjustments | 8 |
| ELEVATION mapping | 3 |
| COMPONENT-DEFAULT | 5 |
| INTENTIONAL-DEVIATION | 2 |
| UNRESOLVED | 1 |

**Overall fidelity: 93%** (excluding UNRESOLVED)
```

Fidelity is calculated as: `(exact + token_snap + type_ramp + color_ramp + elevation + component_default) / total_comparisons × 100`

UNRESOLVED items are excluded from the fidelity percentage since they need human input.

### Detailed diff table

For each element with differences, produce:

```markdown
### `.page-title` → `<Title1>`

| Property | Original | Fluent 2 | Token | Category |
|----------|----------|----------|-------|----------|
| fontSize | 22px | 20px | fontSizeBase500 | TYPE-RAMP |
| fontWeight | 700 | 600 | fontWeightSemibold | TYPE-RAMP |
| color | #333333 | #242424 | colorNeutralForeground1 | COLOR-RAMP |
| lineHeight | 30px | 28px | lineHeightBase500 | TOKEN-SNAP |

**Notes:** Title1 uses semibold (600) per Fluent 2 type scale.
The original's bold (700) is slightly heavier — visually subtle difference.
```

### Deviation explanations

Collect all INTENTIONAL-DEVIATION and UNRESOLVED in a dedicated section at the end:

```markdown
## Design Deviations

### 1. INTENTIONAL: Gradient header → solid brand background
**Original:** `linear-gradient(135deg, #667eea, #764ba2)`
**Fluent 2:** `colorBrandBackground` (`#0f6cbd`)
**Why:** Fluent 2 design language uses solid surface colors exclusively.
Gradients break theme-ability (dark mode, high contrast) and token governance.

### 2. UNRESOLVED: Custom decorative border
**Original:** `border-left: 4px solid #667eea` (accent border on cards)
**Options:**
1. Use `colorBrandStroke1` — closest brand border token (would change color)
2. Use `colorCompoundBrandStroke` — interactive element token (semantically wrong for decorative use)
3. Keep as-is with hardcoded value — breaks token compliance
**Recommendation:** Option 1, but flagging for your review.
```

### Per-component code annotation

For complex diffs, show the generated code with inline comments marking which tokens were mapped:

```tsx
const useStyles = makeStyles({
  header: {
    fontSize: tokens.fontSizeBase500,      // was 22px → snapped to 20px
    fontWeight: tokens.fontWeightSemibold,  // was 700 → Fluent max for headings is 600
    color: tokens.colorNeutralForeground1,  // was #333 → mapped to #242424
    lineHeight: tokens.lineHeightBase500,   // was 30px → snapped to 28px
    marginBottom: tokens.spacingVerticalL,  // was 15px → snapped to 16px
  },
});
```
