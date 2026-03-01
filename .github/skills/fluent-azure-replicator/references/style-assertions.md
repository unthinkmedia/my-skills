# Style Assertions Registry

Hard constraints applied **during BUILD** (not just during VERIFY). Before writing any `makeStyles` block, check the relevant assertions for each element type. If a generated style violates an assertion, fix it before writing the file.

## How to Use

1. During BUILD, before writing `styles.ts`, read this file
2. For each makeStyles class being generated, check if its element type has assertions below
3. Ensure every generated value matches the assertion — if not, replace with the asserted value
4. Assertions use `tokens.*` references — never substitute with raw values

---

## Layout Assertions

| Element | Property | Required Value | Notes |
|---|---|---|---|
| Root container | `display` | `flex` | Always flex column |
| Root container | `flexDirection` | `column` | Vertical stack |
| Root container | `height` | `100%` | Fill parent |
| Root container | `overflow` | `hidden` | Prevent double scroll |
| Body (sidebar+content) | `display` | `flex` | Horizontal split |
| Body (sidebar+content) | `flex` | `1` | Fill remaining height |
| Body (sidebar+content) | `overflow` | `hidden` | Prevent double scroll |
| Scroll content area | `flex` | `1` | Fill remaining space |
| Scroll content area | `overflowY` | `auto` | Only area that scrolls |

## Sidebar Assertions

| Element | Property | Required Value | Notes |
|---|---|---|---|
| Sidebar | `width` | `220px` | Fixed width |
| Sidebar | `minWidth` | `220px` | Prevent shrinking |
| Sidebar | `borderRight` | `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}` | Standard separator |
| Sidebar | `overflowY` | `auto` | Scroll if needed |
| Filter sidebar | `width` | `240px` | Slightly wider for checkboxes |
| Filter sidebar | `minWidth` | `240px` | Prevent shrinking |

## Header Assertions

| Element | Property | Required Value | Notes |
|---|---|---|---|
| Page header | `padding` | `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}` | Standard header padding |
| Page title | `fontSize` | — (use `<Subtitle1>`) | Use component, not raw CSS |
| Page title | `fontWeight` | — (use `<Subtitle1>`) | Use component, not raw CSS |
| Section title | `fontSize` | — (use `<Subtitle2>`) | Use component, not raw CSS |

## Breadcrumb Assertions

| Element | Property | Required Value | Notes |
|---|---|---|---|
| Breadcrumb container | `padding` | `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}` | Compact padding |
| Breadcrumb container | `borderBottom` | `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}` | Standard separator |
| Breadcrumb container | `minHeight` | `32px` | Minimum touch target |

## Command Bar Assertions

| Element | Property | Required Value | Notes |
|---|---|---|---|
| Command bar | `borderBottom` | `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}` | Standard separator |
| Command bar | `padding` | `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}` | Compact padding |
| Command bar (browse) | `borderTop` | `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}` | Top border on browse pages |

## Card Assertions

| Element | Property | Required Value | Notes |
|---|---|---|---|
| Card | `appearance` | `outline` | Use outline, not filled |
| Card content | `padding` | `tokens.spacingVerticalL` | Standard card padding |
| KPI value | `fontSize` | `tokens.fontSizeHero700` | Large numeric display |
| KPI value | `fontWeight` | `tokens.fontWeightSemibold` | Emphasis |

## Form Assertions

| Element | Property | Required Value | Notes |
|---|---|---|---|
| Form section | `marginBottom` | `tokens.spacingVerticalXXL` | Space between sections |
| Form section | `maxWidth` | `600px` | Readable form width |
| Form row | `marginBottom` | `tokens.spacingVerticalM` | Space between fields |
| Section title border | `borderBottom` | `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}` | Visual separator |
| Help text | `color` | `tokens.colorNeutralForeground3` | Subdued text |

## Divider / Separator Assertions

| Element | Property | Required Value | Notes |
|---|---|---|---|
| All border separators | `border*` | `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}` | Never use hardcoded colors or widths |

## Pagination Assertions

| Element | Property | Required Value | Notes |
|---|---|---|---|
| Pagination bar | `borderTop` | `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}` | Standard separator |
| Pagination bar | `padding` | `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}` | Standard padding |
| Pagination bar | `display` | `flex` | Horizontal layout |
| Pagination bar | `justifyContent` | `space-between` | Count left, controls right |

## Zero-Tolerance Rules

These are NEVER acceptable in any generated `styles.ts`:

| Rule | Why |
|---|---|
| Hardcoded hex/rgb/hsl color values | Always use `tokens.color*` |
| Hardcoded pixel font sizes | Always use `tokens.fontSize*` or typography components |
| Hardcoded font weights (400, 600, etc.) | Always use `tokens.fontWeight*` |
| Hardcoded font families | Always use `tokens.fontFamily*` |
| Hardcoded shadow values | Always use `tokens.shadow*` |
| Hardcoded border-radius values | Always use `tokens.borderRadius*` |
| `style={{ }}` inline styles | Always use `makeStyles` |
| CSS Modules or styled-components | Always use Griffel `makeStyles` |
