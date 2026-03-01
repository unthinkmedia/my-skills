# Fluent Azure Token Map

Complete mapping from CSS computed style values to `@fluentui/react-components` design tokens, extended with Azure portal semantic color mappings. Import tokens via:

```tsx
import { tokens } from '@fluentui/react-components';
```

Use in `makeStyles`:
```tsx
import { makeStyles } from '@fluentui/react-components';
const useStyles = makeStyles({
  root: { color: tokens.colorNeutralForeground1 }
});
```

---

## Table of Contents

1. [Color Tokens](#color-tokens)
2. [Azure Portal Color Extensions](#azure-portal-colors)
3. [Typography Tokens](#typography-tokens)
4. [Spacing Tokens](#spacing-tokens)
5. [Border Radius Tokens](#border-radius-tokens)
6. [Shadow / Elevation Tokens](#shadow-tokens)
7. [Stroke Width Tokens](#stroke-width-tokens)
8. [Duration / Easing Tokens](#motion-tokens)
9. [Z-Index Conventions](#z-index)
10. [Mapping Strategy](#mapping-strategy)

---

## Color Tokens

### Neutral Foreground (text)

| Token | Light theme value | Use for |
|-------|-------------------|---------|
| `colorNeutralForeground1` | `#242424` | Primary text |
| `colorNeutralForeground2` | `#424242` | Secondary text |
| `colorNeutralForeground3` | `#616161` | Tertiary / placeholder |
| `colorNeutralForeground4` | `#707070` | Quaternary / disabled hint |
| `colorNeutralForegroundDisabled` | `#bdbdbd` | Disabled text |
| `colorNeutralForegroundInverted` | `#ffffff` | Text on dark backgrounds |
| `colorNeutralForegroundOnBrand` | `#ffffff` | Text on brand-colored backgrounds |

### Neutral Background

| Token | Light theme value | Use for |
|-------|-------------------|---------|
| `colorNeutralBackground1` | `#ffffff` | Page background, cards |
| `colorNeutralBackground1Hover` | `#f5f5f5` | Hover state on bg1 |
| `colorNeutralBackground1Pressed` | `#e0e0e0` | Pressed state on bg1 |
| `colorNeutralBackground2` | `#fafafa` | Secondary surface |
| `colorNeutralBackground3` | `#f5f5f5` | Tertiary surface |
| `colorNeutralBackground4` | `#f0f0f0` | Alternate rows, subtle containers |
| `colorNeutralBackground5` | `#ebebeb` | Deeper containers |
| `colorNeutralBackground6` | `#e6e6e6` | Deepest containers |
| `colorNeutralBackgroundDisabled` | `#f0f0f0` | Disabled surfaces |
| `colorNeutralBackgroundInverted` | `#292929` | Dark surfaces in light theme |

### Brand Colors

| Token | Default value (Web Light) | Use for |
|-------|--------------------------|---------|
| `colorBrandForeground1` | `#0f6cbd` | Brand-colored text |
| `colorBrandForeground2` | `#115ea3` | Brand text alt |
| `colorBrandForegroundLink` | `#0f6cbd` | Links |
| `colorBrandForegroundLinkHover` | `#115ea3` | Link hover |
| `colorBrandForegroundLinkPressed` | `#0c3b5e` | Link pressed |
| `colorBrandBackground` | `#0f6cbd` | Primary brand surface |
| `colorBrandBackgroundHover` | `#115ea3` | Brand hover |
| `colorBrandBackgroundPressed` | `#0c3b5e` | Brand pressed |
| `colorBrandBackground2` | `#ebf3fc` | Subtle brand surface |
| `colorBrandBackground2Hover` | `#b4d6fa` | Subtle brand hover |
| `colorBrandStroke1` | `#0f6cbd` | Brand borders |
| `colorBrandStroke2` | `#b4d6fa` | Subtle brand borders |
| `colorCompoundBrandForeground1` | `#0f6cbd` | Interactive brand elements |
| `colorCompoundBrandBackground` | `#0f6cbd` | Checkboxes, toggles, sliders |
| `colorCompoundBrandStroke` | `#0f6cbd` | Active borders |

### Status Colors

| Token | Value | Use for |
|-------|-------|---------|
| `colorStatusSuccessForeground1` | `#0e700e` | Success text |
| `colorStatusSuccessBackground1` | `#f1faf1` | Success bg (subtle) |
| `colorStatusSuccessBackground3` | `#107c10` | Success bg (filled) |
| `colorStatusWarningForeground1` | `#bc4b09` | Warning text |
| `colorStatusWarningBackground1` | `#fff9f5` | Warning bg (subtle) |
| `colorStatusWarningBackground3` | `#f7630c` | Warning bg (filled) |
| `colorStatusDangerForeground1` | `#b10e1c` | Error text |
| `colorStatusDangerBackground1` | `#fdf3f4` | Error bg (subtle) |
| `colorStatusDangerBackground3` | `#c50f1f` | Error bg (filled) |
| `colorPaletteRedForeground1` | `#bc2f32` | Red accent text |
| `colorPaletteGreenForeground1` | `#0e700e` | Green accent text |
| `colorPaletteBlueForeground2` | `#0c3b5e` | Blue accent text |
| `colorPaletteYellowBackground2` | `#fef7b2` | Yellow accent bg |

### Neutral Stroke (borders)

| Token | Light theme value | Use for |
|-------|-------------------|---------|
| `colorNeutralStroke1` | `#d1d1d1` | Default borders |
| `colorNeutralStroke1Hover` | `#c7c7c7` | Border hover |
| `colorNeutralStroke1Pressed` | `#b3b3b3` | Border pressed |
| `colorNeutralStroke2` | `#e0e0e0` | Subtle borders |
| `colorNeutralStroke3` | `#f0f0f0` | Subtlest borders |
| `colorNeutralStrokeAccessible` | `#616161` | High-contrast borders |
| `colorNeutralStrokeDisabled` | `#e0e0e0` | Disabled borders |

### Color Mapping Strategy

When mapping an original color to a Fluent token:
1. Convert to hex (e.g., `rgb(50, 49, 48)` → `#323130`)
2. Calculate distance (deltaE or simple RGB euclidean) to each token value
3. Pick the token with smallest distance in the correct category:
   - If used as text `color` → try `colorNeutralForeground*` or `colorBrand*Foreground*` first
   - If used as `background-color` → try `colorNeutralBackground*` or `colorBrand*Background*`
   - If used as `border-color` → try `colorNeutralStroke*` or `colorBrand*Stroke*`
4. If the nearest token is > 15 hex-digit distance, flag as potential UNRESOLVED

---

## Azure Portal Color Extensions

These colors are specific to Azure portal UI. They don't exist as standard Fluent v9 tokens but are derived from `@fluentui/azure-themes` and the live portal. When replicating Azure portal pages, use these as `makeStyles` hardcoded values (with `/* azure-portal-extended */` comment) or define them as CSS custom properties on the `FluentProvider`.

### Azure Portal — v8 Semantic → v9 Token Mapping

| v8 Extended Semantic Color | Light Value | Best v9 Token | Notes |
|---------------------------|-------------|---------------|-------|
| `bodyBackground` | `#ffffff` | `colorNeutralBackground1` | Exact |
| `bodyText` | `#323130` | `colorNeutralForeground1` | Close (v9 is `#242424`) |
| `bodyTextHovered` | `#201f1e` | `colorNeutralForeground1` | Close |
| `bodyDivider` | `#edebe9` | `colorNeutralStroke2` | Close (v9 is `#e0e0e0`) |
| `primaryButtonBackground` | `#0078d4` | `colorBrandBackground` | Close (v9 is `#0f6cbd`) |
| `primaryButtonText` | `#ffffff` | `colorNeutralForegroundOnBrand` | Exact |
| `buttonBackground` | `#ffffff` | `colorNeutralBackground1` | Exact |
| `buttonText` | `#323130` | `colorNeutralForeground1` | Close |
| `inputBackground` | `#ffffff` | `colorNeutralBackground1` | Exact |
| `inputBorder` | `#8a8886` | `colorNeutralStrokeAccessible` | Close (v9 is `#616161`) |
| `inputText` | `#323130` | `colorNeutralForeground1` | Close |
| `link` | `#0078d4` | `colorBrandForegroundLink` | Close |
| `linkHovered` | `#004578` | `colorBrandForegroundLinkHover` | Close |
| `listText` | `#323130` | `colorNeutralForeground1` | Close |
| `menuItemBackgroundHovered` | `#f3f2f1` | `colorNeutralBackground1Hover` | Close |
| `errorText` | `#a4262c` | `colorStatusDangerForeground1` | Close |
| `warningText` | `#8a8886` | `colorStatusWarningForeground1` | Different |

### Azure Portal — Control Outlines

| Purpose | Light Value | v9 Mapping |
|---------|-------------|------------|
| Control rest border | `#323130` | `colorNeutralStrokeAccessible` |
| Control hover border | `#201f1e` | `colorNeutralStroke1Hover` |
| Control focus border | `#0078d4` | `colorCompoundBrandStroke` |
| Control disabled border | `#c8c6c4` | `colorNeutralStrokeDisabled` |
| Control accent (checked) | `#0078d4` | `colorCompoundBrandBackground` |
| Control background | `#ffffff` | `colorNeutralBackground1` |

---

## Typography Tokens

### Font Family

| Token | Value |
|-------|-------|
| `fontFamilyBase` | `'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif` |
| `fontFamilyMonospace` | `Consolas, 'Courier New', Courier, monospace` |
| `fontFamilyNumeric` | `Bahnschrift, 'Segoe UI', ...` |

Map any `sans-serif` family → `fontFamilyBase`, any `monospace` family → `fontFamilyMonospace`.

### Font Size

| Token | Value | Common CSS equivalent |
|-------|-------|-----------------------|
| `fontSizeBase100` | `10px` | — |
| `fontSizeBase200` | `12px` | `0.75rem`, `12px` |
| `fontSizeBase300` | `14px` | `0.875rem`, `14px` (body) |
| `fontSizeBase400` | `16px` | `1rem`, `16px` |
| `fontSizeBase500` | `20px` | `1.25rem`, `20px` |
| `fontSizeBase600` | `24px` | `1.5rem`, `24px` |
| `fontSizeHero700` | `28px` | `1.75rem` |
| `fontSizeHero800` | `32px` | `2rem` |
| `fontSizeHero900` | `40px` | `2.5rem` |
| `fontSizeHero1000` | `68px` | `4.25rem` |

**Snap rule:** Map to the nearest token. 13px → `fontSizeBase300` (14px). 18px → `fontSizeBase400` (16px) or `fontSizeBase500` (20px) — pick based on visual role (body → 16, heading → 20).

### Azure Portal Font Size Notes

The Azure portal uses these specific sizes (slightly different from stock Fluent):
- Page title: 20px semibold → `fontSizeBase500` + `fontWeightSemibold` → `<Subtitle1>`
- Section header: 16px semibold → `fontSizeBase400` + `fontWeightSemibold` → `<Subtitle2>`
- Body text: 13px regular → snap to `fontSizeBase300` (14px) — **1px deviation, classify as TOKEN-SNAP**
- Secondary text: 12px regular → `fontSizeBase200` → `<Caption1>`
- Tiny / metadata: 10px → `fontSizeBase100` → `<Caption2>`
- Command bar text: 13px → snap to `fontSizeBase300` (14px)

### Font Weight

| Token | Value |
|-------|-------|
| `fontWeightRegular` | `400` |
| `fontWeightMedium` | `500` |
| `fontWeightSemibold` | `600` |
| `fontWeightBold` | `700` |

### Line Height

| Token | Value |
|-------|-------|
| `lineHeightBase100` | `14px` |
| `lineHeightBase200` | `16px` |
| `lineHeightBase300` | `20px` |
| `lineHeightBase400` | `22px` |
| `lineHeightBase500` | `28px` |
| `lineHeightBase600` | `32px` |

Line heights pair with font sizes: `fontSizeBase300` pairs with `lineHeightBase300`, etc.

### Typography Presets (component shortcuts)

Instead of manual font tokens, prefer these Text component variants when applicable:

| Component | Font Size | Weight | Line Height |
|-----------|-----------|--------|-------------|
| `<Caption2>` | 10px | Regular | 14px |
| `<Caption1>` | 12px | Regular | 16px |
| `<Body1>` | 14px | Regular | 20px |
| `<Body2>` | 14px | Semibold | 20px |
| `<Subtitle2>` | 16px | Semibold | 22px |
| `<Subtitle1>` | 20px | Semibold | 28px |
| `<Title3>` | 24px | Semibold | 32px |
| `<Title2>` | 28px | Semibold | 36px |
| `<Title1>` | 32px | Semibold | 44px |
| `<LargeTitle>` | 40px | Semibold | 52px |
| `<Display>` | 68px | Semibold | 92px |

---

## Spacing Tokens

All spacing follows a 4px base scale.

### Horizontal Spacing

| Token | Value |
|-------|-------|
| `spacingHorizontalNone` | `0` |
| `spacingHorizontalXXS` | `2px` |
| `spacingHorizontalXS` | `4px` |
| `spacingHorizontalSNudge` | `6px` |
| `spacingHorizontalS` | `8px` |
| `spacingHorizontalMNudge` | `10px` |
| `spacingHorizontalM` | `12px` |
| `spacingHorizontalL` | `16px` |
| `spacingHorizontalXL` | `20px` |
| `spacingHorizontalXXL` | `24px` |
| `spacingHorizontalXXXL` | `32px` |

### Vertical Spacing

| Token | Value |
|-------|-------|
| `spacingVerticalNone` | `0` |
| `spacingVerticalXXS` | `2px` |
| `spacingVerticalXS` | `4px` |
| `spacingVerticalSNudge` | `6px` |
| `spacingVerticalS` | `8px` |
| `spacingVerticalMNudge` | `10px` |
| `spacingVerticalM` | `12px` |
| `spacingVerticalL` | `16px` |
| `spacingVerticalXL` | `20px` |
| `spacingVerticalXXL` | `24px` |
| `spacingVerticalXXXL` | `32px` |

**Snap rule:** Map to nearest value. 5px → `spacingHorizontalXS` (4px). 15px → `spacingHorizontalL` (16px). 7px → `spacingHorizontalSNudge` (6px) or `spacingHorizontalS` (8px).

### Azure Portal Spacing Notes

The portal uses some non-standard spacing in specific contexts:
- Command bar internal padding: 0 8px → `spacingHorizontalS`
- Blade content padding: 14px 20px → snap to `spacingVerticalM` (12px) / `spacingHorizontalXL` (20px) or `spacingVerticalL` (16px) / `spacingHorizontalXL` (20px). Prefer 16px/20px.
- Side nav item padding: 8px 16px → `spacingVerticalS` / `spacingHorizontalL`
- Table row padding: 11px 12px → snap to `spacingVerticalM` (12px) / `spacingHorizontalM` (12px)
- Card internal padding: 16px → `spacingVerticalL` / `spacingHorizontalL`

---

## Border Radius Tokens

| Token | Value |
|-------|-------|
| `borderRadiusNone` | `0px` |
| `borderRadiusSmall` | `2px` |
| `borderRadiusMedium` | `4px` |
| `borderRadiusLarge` | `6px` |
| `borderRadiusXLarge` | `8px` |
| `borderRadiusCircular` | `10000px` |

**Snap rule:** 1px → Small. 3px → Small or Medium. 5px → Medium or Large. 10–12px → XLarge. 50%/9999px → Circular.

### Azure Portal Radius Notes

The Azure portal uses minimal border radius:
- Most containers: 0px → `borderRadiusNone`
- Buttons: 2px → `borderRadiusSmall` (v9 default Button uses `borderRadiusMedium` — classify as COMPONENT-DEFAULT)
- Input fields: 2px → `borderRadiusSmall`
- Cards/tiles: 2px → `borderRadiusSmall`
- Tags/pills: 2px → `borderRadiusSmall`
- Avatar (when circular): `borderRadiusCircular`

---

## Shadow Tokens

| Token | Value (approx) |
|-------|----------------|
| `shadow2` | `0 1px 2px rgba(0,0,0,0.14), 0 0 2px rgba(0,0,0,0.12)` |
| `shadow4` | `0 2px 4px rgba(0,0,0,0.14), 0 0 2px rgba(0,0,0,0.12)` |
| `shadow8` | `0 4px 8px rgba(0,0,0,0.14), 0 0 2px rgba(0,0,0,0.12)` |
| `shadow16` | `0 8px 16px rgba(0,0,0,0.14), 0 0 2px rgba(0,0,0,0.12)` |
| `shadow28` | `0 14px 28px rgba(0,0,0,0.24), 0 0 8px rgba(0,0,0,0.20)` |
| `shadow64` | `0 32px 64px rgba(0,0,0,0.24), 0 0 8px rgba(0,0,0,0.20)` |

**Mapping by blur radius:** blur ≤ 2px → `shadow2`. ≤ 4px → `shadow4`. ≤ 8px → `shadow8`. ≤ 16px → `shadow16`. ≤ 28px → `shadow28`. > 28px → `shadow64`.

Brand shadow variants: `shadow2Brand`, `shadow4Brand`, etc. Use when shadow color is tinted with brand color.

### Azure Portal Shadow Notes

| Portal element | Shadow | v9 mapping |
|----------------|--------|------------|
| Cards at rest | `0 0 2px rgba(0,0,0,0.18)` | `shadow2` |
| Cards hovered | `0 0 4px rgba(0,0,0,0.18)` | `shadow4` |
| Dialogs / modals | `0 25.6px 57.6px rgba(0,0,0,0.22)` | `shadow64` |
| Command bar | `none` or `0 1px 0 rgba(0,0,0,0.08)` | `shadow2` or none |
| Dropdowns / menus | `0 3.2px 7.2px rgba(0,0,0,0.13)` | `shadow8` |
| Tooltips | `0 3.2px 7.2px rgba(0,0,0,0.13)` | `shadow8` |

---

## Stroke Width Tokens

| Token | Value |
|-------|-------|
| `strokeWidthThin` | `1px` |
| `strokeWidthThick` | `2px` |
| `strokeWidthThicker` | `3px` |
| `strokeWidthThickest` | `4px` |

---

## Motion Tokens

### Duration

| Token | Value |
|-------|-------|
| `durationUltraFast` | `50ms` |
| `durationFaster` | `100ms` |
| `durationFast` | `150ms` |
| `durationNormal` | `200ms` |
| `durationGentle` | `250ms` |
| `durationSlow` | `300ms` |
| `durationSlower` | `400ms` |
| `durationUltraSlow` | `500ms` |

### Easing

| Token | Value |
|-------|-------|
| `curveAccelerateMax` | `cubic-bezier(1, 0, 1, 1)` |
| `curveAccelerateMid` | `cubic-bezier(0.7, 0, 1, 0.5)` |
| `curveAccelerateMin` | `cubic-bezier(0.8, 0, 1, 1)` |
| `curveDecelerateMax` | `cubic-bezier(0, 0, 0, 1)` |
| `curveDecelerateMid` | `cubic-bezier(0.1, 0.9, 0.2, 1)` |
| `curveDecelerateMin` | `cubic-bezier(0.33, 0, 0.1, 1)` |
| `curveEasyEaseMax` | `cubic-bezier(0.8, 0, 0.1, 1)` |
| `curveEasyEase` | `cubic-bezier(0.33, 0, 0.67, 1)` |
| `curveLinear` | `cubic-bezier(0, 0, 1, 1)` |

---

## Z-Index

Fluent v9 doesn't export z-index tokens, but uses these conventions:

| Layer | Typical z-index |
|-------|----------------|
| Base content | `0` |
| Sticky headers | `1` |
| Popover / Tooltip | `1000000` |
| Dialog overlay | `1000000` |
| Toast / Notification | `1000000` |

Portaled components (`Dialog`, `Popover`, `Tooltip`, `Menu`) manage their own z-index via React portals.

---

## Mapping Strategy

When encountering a CSS value that doesn't map to any token:

1. **Check adjacent categories** — a `background-color` might actually be a status or palette token
2. **Check theme variants** — the value might exist in dark theme but not light
3. **Check component-specific tokens** — some components expose their own tokens (e.g., `colorNeutralForeground2BrandHover`)
4. **Snap to nearest** — pick the closest token and classify as TOKEN-SNAP
5. **Check Azure portal extensions** — might be an Azure-specific color from the `azure-brand-ramp.md` reference
6. **Flag as UNRESOLVED** — if nothing is close, document it

Priority order for token selection:
1. Exact match → use it
2. Same category, close value → TOKEN-SNAP
3. Azure portal extension match → document with `/* azure-portal-extended */`
4. Different category but semantically correct → document the reinterpretation
5. No good match → UNRESOLVED
