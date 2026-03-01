---
name: fluent2-converter
description: "Convert any web UI to Fluent 2 React by capturing its computed styles via browser automation, mapping every value to Fluent 2 tokens and components, generating production-ready code, and self-verifying the result with a detailed diff report. Use this skill whenever a user wants to recreate a UI in Fluent 2, migrate a page to Fluent UI React, convert a design to Fluent, extract styles from a live page and rebuild with Fluent tokens, or compare an existing UI against Fluent 2 design language. Also use when asked to audit a UI's deviation from Fluent 2, or map arbitrary CSS to Fluent 2 tokens."
---

# Fluent 2 UI Converter

Capture the computed styles of any web UI via browser automation, rebuild it with Fluent 2 React components and design tokens, then self-verify by comparing original vs. recreated styles — producing a clear diff report explaining every intentional deviation.

**Fluent 2 React docs:** https://fluent2.microsoft.design/components/web/react

## Skill Phases

This skill runs in five sequential phases. Complete each before moving to the next.

```
CAPTURE → ANALYZE → BUILD → VERIFY → REPORT
```

---

## Phase 1: CAPTURE — Extract styles from the source UI

Use the Playwright browser tools to navigate to the target page and extract everything needed to reconstruct it.

### 1.1 Navigate and screenshot

1. Navigate to the target URL with the browser navigate tool
2. Wait for the page to be fully loaded (network idle)
3. Take a full-page screenshot — this is the **reference image** for later comparison
4. Take a DOM snapshot to understand the page structure

### 1.2 Extract computed styles

Run JavaScript in the browser to extract computed styles from every visible element. The extraction script should capture:

```javascript
(() => {
  const seen = new Set();
  const results = [];

  function getSelector(el) {
    if (el.id) return `#${el.id}`;
    const parts = [];
    let current = el;
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      if (current.classList.length) {
        selector += '.' + [...current.classList].join('.');
      }
      const parent = current.parentElement;
      if (parent) {
        const siblings = [...parent.children].filter(c => c.tagName === current.tagName);
        if (siblings.length > 1) {
          selector += `:nth-child(${[...parent.children].indexOf(current) + 1})`;
        }
      }
      parts.unshift(selector);
      current = current.parentElement;
    }
    return parts.join(' > ');
  }

  document.querySelectorAll('*').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    if (!el.checkVisibility?.() && el.checkVisibility) return;

    const cs = window.getComputedStyle(el);
    const key = getSelector(el);
    if (seen.has(key)) return;
    seen.add(key);

    results.push({
      selector: key,
      tag: el.tagName.toLowerCase(),
      classes: [...el.classList],
      textContent: (el.textContent || '').trim().slice(0, 80),
      role: el.getAttribute('role'),
      ariaLabel: el.getAttribute('aria-label'),
      rect: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        w: Math.round(rect.width),
        h: Math.round(rect.height)
      },
      styles: {
        // Typography
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform,
        textDecoration: cs.textDecoration,
        textAlign: cs.textAlign,
        color: cs.color,

        // Backgrounds
        backgroundColor: cs.backgroundColor,
        backgroundImage: cs.backgroundImage,
        background: cs.background,

        // Spacing
        paddingTop: cs.paddingTop,
        paddingRight: cs.paddingRight,
        paddingBottom: cs.paddingBottom,
        paddingLeft: cs.paddingLeft,
        marginTop: cs.marginTop,
        marginRight: cs.marginRight,
        marginBottom: cs.marginBottom,
        marginLeft: cs.marginLeft,
        gap: cs.gap,
        rowGap: cs.rowGap,
        columnGap: cs.columnGap,

        // Borders
        borderTopWidth: cs.borderTopWidth,
        borderRightWidth: cs.borderRightWidth,
        borderBottomWidth: cs.borderBottomWidth,
        borderLeftWidth: cs.borderLeftWidth,
        borderTopColor: cs.borderTopColor,
        borderTopStyle: cs.borderTopStyle,
        borderRadius: cs.borderRadius,

        // Shadows & Effects
        boxShadow: cs.boxShadow,
        opacity: cs.opacity,
        filter: cs.filter,
        backdropFilter: cs.backdropFilter,

        // Layout
        display: cs.display,
        flexDirection: cs.flexDirection,
        flexWrap: cs.flexWrap,
        alignItems: cs.alignItems,
        justifyContent: cs.justifyContent,
        gridTemplateColumns: cs.gridTemplateColumns,
        gridTemplateRows: cs.gridTemplateRows,
        position: cs.position,
        overflow: cs.overflow,
        overflowX: cs.overflowX,
        overflowY: cs.overflowY,

        // Sizing
        width: cs.width,
        height: cs.height,
        minWidth: cs.minWidth,
        maxWidth: cs.maxWidth,
        minHeight: cs.minHeight,
        maxHeight: cs.maxHeight,

        // Transitions
        transition: cs.transition,
        cursor: cs.cursor
      }
    });
  });

  return JSON.stringify(results, null, 2);
})();
```

Save the extracted JSON to a working file (e.g., `captured-styles.json`). This is the raw material for the next phase.

### 1.3 Extract page structure

Also capture the DOM hierarchy at a semantic level — headings, navigation, main content, sidebars, footers, form groups, cards, lists, tables. This determines which Fluent 2 components to use.

---

## Phase 2: ANALYZE — Map styles to Fluent 2 tokens and components

This is the most critical phase. Read `references/token-map.md` for the complete CSS-to-Fluent-2-token mapping, and `references/component-patterns.md` for UI-pattern-to-component mapping.

### 2.1 Classify every element

Walk through the captured elements and classify each into a **visual role**:

| Role | Examples | Likely Fluent 2 component |
|------|----------|---------------------------|
| Page shell | Root container, app frame | `FluentProvider` |
| Navigation | Nav bars, menus, breadcrumbs | `TabList`, `Menu`, `Breadcrumb` |
| Heading | h1–h6, page titles | `Title1`–`Title3`, `Subtitle1`–`Subtitle2`, `Body1` |
| Body text | Paragraphs, descriptions | `Body1`, `Body2`, `Caption1`, `Caption2` |
| Button | Clickable actions | `Button`, `CompoundButton`, `MenuButton`, `ToggleButton` |
| Input | Text fields, selects | `Input`, `Textarea`, `Select`, `Combobox`, `Dropdown` |
| Card | Content containers | `Card`, `CardHeader`, `CardPreview`, `CardFooter` |
| Table | Data grids | `Table` or `DataGrid` |
| Dialog | Modals, overlays | `Dialog`, `DialogSurface` |
| List | Item lists | `List`, `ListItem` |
| Badge/Tag | Status indicators | `Badge`, `CounterBadge`, `Tag` |
| Avatar | User representations | `Avatar`, `AvatarGroup` |
| Divider | Separators | `Divider` |
| Tooltip | Hover information | `Tooltip` |
| Spinner | Loading states | `Spinner`, `ProgressBar` |
| Image | Visual content | `Image` |

### 2.2 Map every style value to a Fluent 2 token

For each element, map every extracted CSS value to the nearest Fluent 2 design token. Use `references/token-map.md` as the authoritative lookup.

**Process:**
1. Parse each CSS value (e.g., `rgb(50, 49, 48)` → this is near `colorNeutralForeground1`)
2. Find the closest Fluent 2 token by value
3. If no exact match exists, find the nearest neighbor and note the deviation
4. Record: `{ property, originalValue, fluentToken, fluentValue, isExactMatch, delta }`

Pay special attention to:
- **Colors** — convert to hex/rgb and find the closest token. The Fluent 2 neutral palette and brand ramp are specific; document any color that doesn't map cleanly.
- **Typography** — Fluent 2 has a fixed type ramp. The original may use sizes or weights outside this ramp.
- **Spacing** — Fluent 2 uses a 4px-based scale. Values like 5px, 7px, 10px, 15px need to snap to the nearest token.
- **Border radius** — Fluent 2 has specific radius tokens (0, 2, 4, 6, 8, circular). Custom radii must map to these.
- **Shadows** — Fluent 2 has elevation tokens (shadow2 through shadow64). Custom shadows should map to the nearest.

### 2.3 Identify component compositions

Look for groups of elements that together form a recognizable Fluent 2 pattern. For example:
- An image + heading + description in a container → `Card` with `CardHeader` and `CardPreview`
- A text input with label and helper text → `Field` wrapping `Input`
- A row of action buttons → `Toolbar`
- Tabs switching content → `TabList` + `Tab`

---

## Phase 3: BUILD — Generate Fluent 2 React code

### 3.1 Project setup

Generate a React component file (or set of files) using these imports:

```tsx
import {
  FluentProvider,
  webLightTheme,  // or webDarkTheme based on source
  tokens,
  makeStyles,
  // ... specific components identified in Phase 2
} from '@fluentui/react-components';
```

### 3.2 Style-with-tokens approach

Use `makeStyles` from Griffel (Fluent 2's CSS-in-JS) for custom styling. Every value MUST reference a Fluent 2 token where one exists:

```tsx
const useStyles = makeStyles({
  container: {
    backgroundColor: tokens.colorNeutralBackground1,
    padding: tokens.spacingVerticalL,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
  },
  heading: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase500,
    color: tokens.colorNeutralForeground1,
  },
});
```

**Hard rule:** Never use raw CSS values (like `'#333'` or `'16px'`) when a Fluent 2 token exists for that purpose. The whole point is token compliance.

### 3.3 Component hierarchy

Build the component tree following Fluent 2 composition patterns. Use the component classifications from Phase 2.

**Hard rule: Never create a non-Fluent component when a Fluent 2 equivalent exists.** Before writing any `<div>`, `<span>`, `<button>`, `<input>`, `<table>`, `<select>`, or other raw HTML element, check `references/component-patterns.md` for a matching Fluent 2 component. If one exists — use it, even if you need to adjust styling via `makeStyles` to match the original. The only time a raw HTML element is acceptable is when there is genuinely no Fluent 2 component that covers that purpose (e.g., a `<canvas>`, `<video>`, or a highly specialized layout `<div>` that serves only as a flex container with no semantic meaning).

Examples of violations:
- `<button onClick={...}>Submit</button>` → must be `<Button appearance="primary">Submit</Button>`
- `<input type="text" />` → must be `<Input />`
- `<table>` with manual rows → must be `<Table>` / `<DataGrid>`
- `<div class="card">` with shadow/border → must be `<Card>`
- `<div class="badge">3</div>` → must be `<CounterBadge value={3} />`
- `<span class="tooltip">` → must be `<Tooltip>`
- `<div class="modal">` with overlay → must be `<Dialog>`

Use Fluent 2 built-in component props over custom styling — e.g., use `<Button appearance="primary">` instead of styling a `<button>` to look primary.

### 3.4 Preserve layout faithfully

Recreate the original layout structure: flex directions, grid templates, widths, alignment. Layout tokens aren't as granular as color/typography tokens, so use `makeStyles` with token-based spacing for gaps and padding, but replicate exact layout mechanics (flex, grid, positioning).

### 3.5 Handle interactive states

If the source has hover, focus, active, or disabled states captured, implement them using Fluent 2 patterns:
- Prefer component props: `appearance`, `disabled`, `size`
- Use Griffel pseudo-selectors for custom states: `':hover'`, `':focus-visible'`
- Interactive tokens: `colorNeutralForeground1Hover`, `colorBrandBackgroundHover`, etc.

---

## Phase 4: VERIFY — Self-check the recreation

This is what separates a useful conversion from a guess. Read `references/verification.md` for the detailed procedure.

### 4.1 Render the Fluent 2 version

If possible, use the browser to navigate to the recreated UI (e.g., if a dev server is running) or create a standalone HTML file that loads the React component. Take a screenshot of the result.

### 4.2 Extract computed styles from the recreation

Run the same extraction script from Phase 1 on the recreated UI. Save as `recreated-styles.json`.

### 4.3 Element-by-element comparison

For each element pair (original → recreated), compare:

| Property | How to compare |
|----------|---------------|
| Colors | Convert both to hex, calculate deltaE (color distance). Flag if > 5. |
| Font size | Absolute pixel difference. Flag if > 1px. |
| Font weight | Must match numeric value (400, 500, 600, 700). |
| Font family | Check if same generic family (sans-serif, monospace). Exact match not required — Fluent uses Segoe UI / system font stack. |
| Spacing | Flag if difference > 4px (one spacing step). |
| Border radius | Flag if different token bucket (e.g., 3px original → 4px Fluent is fine; 3px → 8px needs explanation). |
| Box shadow | Compare blur/spread/color. Fluent shadows are specific — note which elevation token was used. |
| Layout | flex/grid direction and alignment must match exactly. |

### 4.4 Classify each difference

Every detected difference gets one of these labels:

- **TOKEN-SNAP**: Original value snapped to nearest Fluent 2 token (e.g., 15px → 16px / `spacingVerticalL`)
- **COMPONENT-DEFAULT**: Fluent 2 component enforces this value (e.g., Button has fixed padding)
- **TYPE-RAMP**: Original text size mapped to nearest point on Fluent 2 type ramp
- **COLOR-RAMP**: Original color mapped to nearest token on Fluent 2 color ramp
- **ELEVATION**: Shadow mapped to Fluent 2 elevation token
- **LAYOUT-PRESERVED**: Layout properties kept exactly (no diff)
- **INTENTIONAL-DEVIATION**: A deliberate design change to align with Fluent 2 design language — explain why
- **UNRESOLVED**: Could not find a good Fluent 2 equivalent — needs human decision

---

## Phase 5: REPORT — Deliver the diff report

### 5.1 Summary

Start with a high-level overview:
- Total elements compared
- Elements with zero differences
- Elements with TOKEN-SNAP or TYPE-RAMP adjustments (expected)
- Elements with INTENTIONAL-DEVIATION (explain each)
- Elements with UNRESOLVED gaps (need human input)

### 5.2 Detailed diff table

Present a table for each element that has differences:

```
┌─────────────┬──────────────┬───────────────────┬─────────────────────┬──────────┐
│ Element     │ Property     │ Original          │ Fluent 2            │ Category │
├─────────────┼──────────────┼───────────────────┼─────────────────────┼──────────┤
│ .page-title │ fontSize     │ 22px              │ 20px (fontSizeBase500) │ TYPE-RAMP │
│ .page-title │ fontWeight   │ 700               │ 600 (fontWeightSemibold) │ TYPE-RAMP │
│ .card       │ borderRadius │ 10px              │ 8px (borderRadiusXLarge) │ TOKEN-SNAP │
│ .card       │ boxShadow    │ 0 2px 8px rgba…   │ shadow4             │ ELEVATION │
│ .sidebar    │ width        │ 280px             │ 280px               │ LAYOUT-PRESERVED │
│ .btn-submit │ padding      │ 10px 20px         │ 5px 12px (Button M) │ COMPONENT-DEFAULT │
└─────────────┴──────────────┴───────────────────┴─────────────────────┴──────────┘
```

### 5.3 Deviation explanations

For every INTENTIONAL-DEVIATION and COMPONENT-DEFAULT, provide a 1–2 sentence explanation:

> **`.btn-submit` padding: 10px 20px → 5px 12px**
> Fluent 2 `Button` (size="medium") uses fixed internal padding defined by the component specification. Overriding this would break consistency with the rest of the design system.

> **`.page-title` fontWeight: 700 → 600**
> Fluent 2's type ramp tops out at `fontWeightSemibold` (600) for most heading components. Using 700 (bold) would deviate from the established visual hierarchy.

### 5.4 UNRESOLVED items

List anything that couldn't be cleanly mapped with a recommendation for the user:

> **`.gradient-header` background: `linear-gradient(135deg, #667eea, #764ba2)`**
> Fluent 2 doesn't have gradient tokens. Options:
> 1. Use `colorBrandBackground` (solid) — simplest, most aligned
> 2. Keep the gradient as custom CSS — works but breaks token governance
> 3. Use two adjacent solid-color sections — maintains token compliance with visual compromise

---

## Reference files

- **`references/token-map.md`** — Complete CSS property → Fluent 2 token mapping. Read during Phase 2 analysis. Contains token names, values, and the CSS properties they replace.
- **`references/component-patterns.md`** — UI patterns → Fluent 2 React components. Read during Phase 2 element classification. Shows which component to use for common UI patterns and how to compose them.
- **`references/verification.md`** — Self-verification procedure. Read during Phase 4. Details color distance calculation, tolerance thresholds, and the diff classification taxonomy.

---

## Key principles

1. **Token compliance is the goal.** Every hardcoded CSS value in the output is a failure. If a token exists, use it.
2. **Component compliance is mandatory.** Never use a raw HTML element when a Fluent 2 component covers that purpose. A `<div>` styled to look like a button is always wrong — use `<Button>`. Check the component library before writing any HTML tag.
3. **Prefer component semantics over visual mimicry.** Use `<Button appearance="primary">` not a styled `<div>` that looks like a button. Let the component's built-in props (`appearance`, `size`, `shape`) control the look.
4. **Layout fidelity matters.** The spatial arrangement should feel identical. Spacing tokens are close enough (4px grid) that layouts should reproduce well.
5. **Explain every deviation.** The user needs to understand WHY something changed, not just what changed. "Fluent 2 doesn't have a 22px font size" is more useful than "font size differs."
6. **Flag what you can't solve.** UNRESOLVED items are honest and valuable. Don't force a bad mapping just to avoid admitting a gap.
