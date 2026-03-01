# Azure Brand Ramp for Fluent v9

Azure portal brand colors mapped to Fluent UI React v9's `BrandVariants` format.

## Usage

```tsx
import {
  createLightTheme,
  createDarkTheme,
  BrandVariants,
  Theme,
} from '@fluentui/react-components';

const azureBrand: BrandVariants = {
  10: '#001b3d',
  20: '#00285e',
  30: '#003780',
  40: '#00479f',
  50: '#0058be',
  60: '#0068d6',
  70: '#0078d4',   // Azure primary — #0078D4
  80: '#1a88d9',
  90: '#3498de',
  100: '#4da8e3',
  110: '#67b8e8',
  120: '#80c8ed',
  130: '#99d5f1',
  140: '#b3e2f6',
  150: '#ccedfa',
  160: '#e6f6fd',
};

export const azureLightTheme: Theme = {
  ...createLightTheme(azureBrand),
};

export const azureDarkTheme: Theme = {
  ...createDarkTheme(azureBrand),
  // Dark mode overrides for Azure portal parity
  colorNeutralBackground1: '#1e1e1e',      // portal dark bg
  colorNeutralBackground2: '#252525',
  colorNeutralBackground3: '#2d2d2d',
  colorNeutralForeground1: '#cccccc',       // portal dark text
  colorNeutralForeground2: '#d4d4d4',
};
```

---

## Azure Portal Semantic Color Extensions

The portal uses colors beyond the standard Fluent token set. When replicating portal-specific UI, apply these overrides to the theme object:

### Status Colors (Portal-Specific)

| Purpose | Light value | Dark value | v9 token to override |
|---------|-------------|------------|----------------------|
| Status bar — information bg | `#f0f6ff` | `#002b4e` | `colorStatusWarningBackground1` repurposed or custom |
| Status bar — success bg | `#dff6dd` | `#052e06` | `colorStatusSuccessBackground1` |
| Status bar — error bg | `#fde7e9` | `#3b0509` | `colorStatusDangerBackground1` |
| Status bar — warning bg | `#fff4ce` | `#4a3700` | `colorStatusWarningBackground1` |
| Status bar — upsell bg | `#f3e8fd` | `#2d0a4e` | custom property |

### Data Visualization Palette

Azure portal uses a specific 10-color data palette for charts and graphs. These don't map to standard tokens — store as constants:

```tsx
export const azureDataColors = {
  dataColor1: '#0078d4',   // Azure blue
  dataColor2: '#2aa0a4',   // Teal
  dataColor3: '#4f6bed',   // Indigo
  dataColor4: '#e3008c',   // Magenta/pink
  dataColor5: '#986f0b',   // Gold
  dataColor6: '#ca5010',   // Orange
  dataColor7: '#b4009e',   // Purple
  dataColor8: '#57a300',   // Green
  dataColor9: '#ad6700',   // Amber
  dataColor10: '#8764b8',  // Violet
  noData1: '#a19f9d',       // Grey placeholder
  noData2: '#d2d0ce',       // Light grey placeholder
};
```

### Command Bar Colors

| Purpose | Light value | v9 mapping |
|---------|-------------|------------|
| Command bar background | `#ffffff` | `colorNeutralBackground1` |
| Command bar border | `#edebe9` | `colorNeutralStroke2` |
| Button hover bg | `#f3f2f1` | `colorNeutralBackground1Hover` |
| Button selected bg | `#edebe9` | `colorNeutralBackground1Pressed` |
| Button icon color | `#323130` | `colorNeutralForeground1` |
| Button icon hover color | `#201f1e` | `colorNeutralForeground1` |

---

## v8 Compatibility Mode

When the source page is detected as Fluent v8 (DOM contains `ms-Fabric`, `ms-Button` class prefixes), switch to the v8 theme:

```tsx
import {
  AzureThemeLight,
  AzureThemeDark,
  AzureThemeHighContrastLight,
  AzureThemeHighContrastDark,
} from '@fluentui/azure-themes';
import { ThemeProvider } from '@fluentui/react';

// v8 mode — only used when source is a v8 page
<ThemeProvider theme={AzureThemeDark}>
  {children}
</ThemeProvider>
```

### Detection heuristic

During CAPTURE, check for v8 DOM signatures:
```javascript
const isV8 = document.querySelector(
  '.ms-Fabric, .ms-Button, .ms-DetailsList, .ms-TextField, .ms-CommandBar'
) !== null;
```

If `isV8 === true` AND the `--compat v8` flag is not explicitly off, use v8 theme. Otherwise, always use v9.

---

## Theme Toggle Component

Include in every output to support light/dark switching:

```tsx
import React, { useState } from 'react';
import { FluentProvider, Switch } from '@fluentui/react-components';
import { azureLightTheme, azureDarkTheme } from './theme';

export const ThemeToggle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  return (
    <FluentProvider theme={isDark ? azureDarkTheme : azureLightTheme}>
      <Switch
        label={isDark ? 'Dark mode' : 'Light mode'}
        checked={isDark}
        onChange={(_, data) => setIsDark(data.checked)}
      />
      {children}
    </FluentProvider>
  );
};
```
