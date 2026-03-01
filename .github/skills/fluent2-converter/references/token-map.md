# Fluent 2 Token Map

Complete mapping from CSS computed style values to `@fluentui/react-components` design tokens. Import tokens via:

```tsx
import { tokens } from '@fluentui/react-components';
```

Use in `makeStyles`:
```tsx
const useStyles = makeStyles({
  root: { color: tokens.colorNeutralForeground1 }
});
```

---

## Table of Contents

1. [Color Tokens](#color-tokens)
2. [Typography Tokens](#typography-tokens)
3. [Spacing Tokens](#spacing-tokens)
4. [Border Radius Tokens](#border-radius-tokens)
5. [Shadow / Elevation Tokens](#shadow-tokens)
6. [Stroke Width Tokens](#stroke-width-tokens)
7. [Duration / Easing Tokens](#motion-tokens)
8. [Z-Index Conventions](#z-index)
9. [Mapping Strategy](#mapping-strategy)

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

When mapping an original color to a Fluent 2 token:
1. Convert to hex (e.g., `rgb(50, 49, 48)` → `#323130`)
2. Calculate distance (deltaE or simple RGB euclidean) to each token value
3. Pick the token with smallest distance in the correct category:
   - If used as text `color` → try `colorNeutralForeground*` or `colorBrand*Foreground*` first
   - If used as `background-color` → try `colorNeutralBackground*` or `colorBrand*Background*`
   - If used as `border-color` → try `colorNeutralStroke*` or `colorBrand*Stroke*`
4. If the nearest token is > 15 hex-digit distance, flag as potential UNRESOLVED

---

## Typography Tokens

### Font Family

| Token | Value |
|-------|-------|
| `fontFamilyBase` | `'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif` |
| `fontFamilyMonospace` | `Consolas, 'Courier New', Courier, monospace` |
| `fontFamilyNumeric` | `Bahnschrift, 'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif` |

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

Brand shadow variants also exist: `shadow2Brand`, `shadow4Brand`, etc. Use these when the shadow color is tinted with the brand color rather than neutral black.

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

Fluent 2 doesn't export z-index tokens, but uses these conventions:

| Layer | Typical z-index |
|-------|----------------|
| Base content | `0` |
| Sticky headers | `1` |
| Popover / Tooltip | `1000000` |
| Dialog overlay | `1000000` |
| Toast / Notification | `1000000` |

Portaled components (`Dialog`, `Popover`, `Tooltip`, `Menu`) manage their own z-index via React portals — you rarely need to set z-index manually.

---

## Mapping Strategy

When encountering a CSS value that doesn't map to any token:

1. **Check adjacent categories** — a `background-color` might actually be a status or palette token, not neutral
2. **Check theme variants** — the value might exist in dark theme but not light, or vice versa
3. **Check component-specific tokens** — some components expose their own tokens (e.g., `colorNeutralForeground2BrandHover`)
4. **Snap to nearest** — pick the closest token and classify as TOKEN-SNAP
5. **Flag as UNRESOLVED** — if nothing is close, document it honestly

Priority order for token selection:
1. Exact match → use it
2. Same category, close value → TOKEN-SNAP
3. Different category but semantically correct → document the reinterpretation
4. No good match → UNRESOLVED
