# Fluent UI React v9 Icon System

Complete icon strategy for Azure portal UI replications using `@fluentui/react-icons`. This is a **two-tier system**: use the bundled `@fluentui/react-icons` package as the primary source (thousands of icons available), and fall back to inline SVG only for truly custom Azure-branded icons that have no Fluent equivalent.

---

## Tier 1: `@fluentui/react-icons` (Primary — Always Prefer)

### Import Pattern

Icons are **individual React components** — tree-shakeable, no font file or registry needed.

```tsx
// Named imports — one per icon used
import { SettingsRegular, SettingsFilled, SearchRegular } from '@fluentui/react-icons';
```

> **NEVER** do `import * as Icons from '@fluentui/react-icons'` — this imports 10k+ icons and destroys bundle size.

### Naming Convention

Every icon follows this pattern:

```
{IconName}{Size?}{Variant}
```

- **IconName:** PascalCase concept name (e.g. `Settings`, `ChevronDown`, `ArrowSync`)
- **Size (optional):** `10`, `12`, `16`, `20` (default — omit suffix), `24`, `28`, `32`, `48`
- **Variant:** `Regular` (outline), `Filled` (solid), `Light` (thin), `Color` (multi-color)

```tsx
// 20px is the default — no size suffix needed
<SettingsRegular />         // 20px outline (default)
<Settings24Regular />       // 24px outline
<Settings16Filled />        // 16px filled

// Common sizes for Azure portal UI:
// 16px — inline with small text, table cells, compact nav items
// 20px — default, buttons, toolbar, standard nav items
// 24px — page headers, prominent actions
```

### `bundleIcon()` — Regular ↔ Filled Toggle

Use `bundleIcon()` to create a single component that switches between Regular (default) and Filled (active/selected) variants. This is the standard pattern for navigation items, toggle buttons, and favorites.

```tsx
import { bundleIcon, StarRegular, StarFilled } from '@fluentui/react-icons';

const Star = bundleIcon(StarFilled, StarRegular);

// Usage — renders StarRegular by default, StarFilled when `filled` prop is true
<Star />                    // → StarRegular (outline)
<Star filled />             // → StarFilled (solid)
```

**Use `bundleIcon()` for:**
- Navigation items that show filled when selected
- Favorite/star toggles
- Bookmark toggles
- Any icon that changes weight based on selection state

### Using Icons in Fluent v9 Components

Fluent v9 components accept icons via the `icon` prop (slot pattern):

```tsx
import { Button, MenuItem, Tab, ToolbarButton } from '@fluentui/react-components';
import { AddRegular, SettingsRegular, DeleteRegular } from '@fluentui/react-icons';

// Button with icon
<Button icon={<AddRegular />}>Create resource</Button>
<Button icon={<AddRegular />} />  {/* Icon-only button */}

// MenuItem with icon
<MenuItem icon={<SettingsRegular />}>Settings</MenuItem>

// Tab with icon
<Tab icon={<SettingsRegular />} value="settings">Settings</Tab>

// ToolbarButton with icon
<ToolbarButton icon={<DeleteRegular />}>Delete</ToolbarButton>
```

### Standalone Icon Rendering

For icons outside Fluent components (e.g., status indicators, decorative icons):

```tsx
import { tokens } from '@fluentui/react-components';
import { CheckmarkCircleRegular } from '@fluentui/react-icons';

// With color via token
<CheckmarkCircleRegular style={{ color: tokens.colorStatusSuccessForeground1 }} />

// With makeStyles class
const useStyles = makeStyles({
  statusIcon: {
    color: tokens.colorStatusSuccessForeground1,
    fontSize: '16px',  // Controls icon size when used as fontSize
  },
});

// Apply class
<CheckmarkCircleRegular className={styles.statusIcon} />
```

### Icon Sizing

Icons inherit their size from `font-size` on the element or parent. The numeric suffix in the import name controls the **design detail level** (stroke weight, visual density), not the rendered size.

```tsx
// Preferred: set size via the component's size prop
<Button size="small" icon={<AddRegular />}>Add</Button>   // 16px icon
<Button size="medium" icon={<AddRegular />}>Add</Button>  // 20px icon
<Button size="large" icon={<Add24Regular />}>Add</Button>  // 24px icon

// Standalone: control size via fontSize
<SearchRegular style={{ fontSize: '24px' }} />

// Via makeStyles
const useStyles = makeStyles({
  largeIcon: { fontSize: '24px' },
});
```

**Size guide for Azure portal UI:**

| Context | Icon size | Import suffix |
|---------|-----------|---------------|
| Table cell, compact list, Badge | 16px | `16Regular` |
| Buttons, toolbar, standard nav, menu items | 20px | `Regular` (default) |
| Page headers, card titles, command bar primary | 24px | `24Regular` |
| Hero sections, empty states | 32–48px | `32Regular` / `48Regular` |

---

## Tier 2: Auto-Extract from Source (Fallback — When No Fluent Match Exists)

When an icon cannot be matched to `@fluentui/react-icons`, **automatically extract the original asset from the source page** and save it locally. Do not leave UNRESOLVED placeholders — always produce a working icon.

This is rare (the package has 4,000+ icons) but happens with:
- Azure-specific resource type icons with unique branding (e.g., specific service logos)
- Product logos embedded in the portal
- Custom multi-color status indicators unique to a specific Azure service
- Third-party service icons shown in marketplace or integrations

### Auto-Extract Pipeline

During CAPTURE, when an icon element cannot be mapped to `@fluentui/react-icons`:

1. **Determine the asset type:**
   - `<svg>` element → extract full `outerHTML` (the complete SVG markup)
   - `<img>` element → get the `src` URL for download
   - CSS `background-image` → get the URL from the computed style
   - Icon font glyph (no matching Fluent name) → take a screenshot crop of the icon region

2. **Extract or download the asset:**
   ```javascript
   // For SVG icons — extract via mcp_microsoft_pla_browser_evaluate:
   (() => {
     const el = document.querySelector('<selector-of-unmatched-icon>');
     if (el?.tagName === 'svg' || el?.querySelector('svg')) {
       const svg = el.tagName === 'svg' ? el : el.querySelector('svg');
       return JSON.stringify({
         type: 'svg',
         markup: svg.outerHTML,
         viewBox: svg.getAttribute('viewBox'),
         width: svg.getAttribute('width'),
         height: svg.getAttribute('height'),
       });
     }
     if (el?.tagName === 'IMG') {
       return JSON.stringify({ type: 'img', src: el.src, alt: el.alt });
     }
     const bg = getComputedStyle(el).backgroundImage;
     if (bg && bg !== 'none') {
       const url = bg.match(/url\(["']?([^"')]+)/)?.[1];
       return JSON.stringify({ type: 'bg-image', url });
     }
     return JSON.stringify({ type: 'unknown' });
   })()
   ```

3. **Save the asset locally in the output directory:**

   ```
   <output-dir>/
   ├── assets/
   │   ├── icon-diagnostics.svg      # Extracted SVGs
   │   ├── icon-custom-service.svg
   │   └── icon-marketplace-logo.png  # Downloaded images
   ├── icons.ts                       # Wrapper components
   └── ...
   ```

4. **Create a React wrapper component** in `icons.ts`:

   **For extracted SVGs** (preferred — scales, inherits color):
   ```tsx
   // Auto-extracted from source page — no @fluentui/react-icons match found
   // Source: <selector> near "Diagnostics" label
   export const DiagnosticsIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (props) => (
     <svg
       xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24"
       width="1em"
       height="1em"
       fill="currentColor"
       aria-hidden="true"
       {...props}
     >
       {/* Paste extracted <path> elements here */}
       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10..." />
     </svg>
   );
   ```

   **For downloaded images** (raster icons, logos):
   ```tsx
   // Auto-downloaded from source page — raster icon
   // Source: <img src="..."> near "Custom Service" label
   import customServiceIconSrc from './assets/icon-custom-service.png';

   export const CustomServiceIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (props) => (
     <img
       src={customServiceIconSrc}
       alt=""
       width={20}
       height={20}
       aria-hidden="true"
       {...props}
     />
   );
   ```

### SVG Cleanup Rules

When extracting SVGs from the source page, clean them up:

1. **Remove inline `style` attributes** — move any needed styles to the wrapper or `makeStyles`
2. **Replace hardcoded `fill` colors with `currentColor`** — so the icon respects Fluent token colors. Exception: multi-color brand icons (logos) should keep their original colors.
3. **Normalize `viewBox`** — ensure a proper `viewBox` attribute exists. If missing, derive from `width`/`height`.
4. **Remove `id` attributes** — avoid DOM ID collisions when the icon is used multiple times
5. **Remove unnecessary wrapper `<g>` or `<defs>`** if they don't contribute to the rendering
6. **Set `width="1em"` and `height="1em"`** on the root `<svg>` — this makes the icon size-responsive to the parent's `font-size`, matching the behavior of `@fluentui/react-icons`
7. **Add `aria-hidden="true"`** for decorative icons, or `role="img"` + `aria-label="..."` for meaningful icons

### Searching for Icons

Before falling back to auto-extract, try hard to find a Fluent match:

1. **Search by concept** — The package uses intuitive names. For "database" try: `Database`, `Storage`, `Server`, `Table`
2. **Check variants** — Many icons have related variants: `Settings` / `SettingsCog`, `Person` / `PersonAccounts` / `People`
3. **Browse the catalog** — https://react.fluentui.dev/?path=/docs/icons-catalog--docs
4. **Check compound names** — Multi-word concepts use PascalCase: `ArrowSync`, `ChevronDown`, `ErrorCircle`, `LockClosed`
5. **Try semantic synonyms** — If "stethoscope" doesn't exist, try `Pulse`, `HeartPulse`, `Activity`

---

## Azure Portal Icon Mapping Tables

### Resource Type Icons

| Azure concept | Regular | Filled |
|---------------|---------|--------|
| Virtual Machine | `DesktopRegular` | `DesktopFilled` |
| App Service / Web App | `GlobeRegular` | `GlobeFilled` |
| Storage Account | `DatabaseRegular` | `DatabaseFilled` |
| SQL Database | `DatabaseRegular` | `DatabaseFilled` |
| Cosmos DB | `DatabaseMultipleRegular` | `DatabaseMultipleFilled` |
| Key Vault | `KeyRegular` | `KeyFilled` |
| Function App | `FlashRegular` | `FlashFilled` |
| Container Registry | `BoxRegular` | `BoxFilled` |
| Kubernetes Service (AKS) | `BoxMultipleRegular` | `BoxMultipleFilled` |
| Virtual Network | `CloudFlowRegular` | `CloudFlowFilled` |
| Network Security Group | `ShieldRegular` | `ShieldFilled` |
| Load Balancer | `ArrowSyncRegular` | `ArrowSyncFilled` |
| Application Gateway | `GatewayRegular` | `GatewayFilled` |
| DNS Zone | `GlobeRegular` | `GlobeFilled` |
| Subscription | `WalletCreditCardRegular` | `WalletCreditCardFilled` |
| Resource Group | `FolderRegular` | `FolderFilled` |
| Management Group | `OrganizationRegular` | `OrganizationFilled` |
| Policy | `ShieldCheckmarkRegular` | `ShieldCheckmarkFilled` |
| Logic App | `FlowRegular` | `FlowFilled` |
| API Management | `PlugConnectedRegular` | `PlugConnectedFilled` |
| Service Bus | `VehicleBusRegular` | `VehicleBusFilled` |
| Event Hub | `LiveRegular` | `LiveFilled` |
| Application Insights | `PulseRegular` | `PulseFilled` |
| Monitor / Log Analytics | `DataTrendingRegular` | `DataTrendingFilled` |
| Advisor | `LightbulbRegular` | `LightbulbFilled` |
| Cost Management | `MoneyRegular` | `MoneyFilled` |
| Microsoft Entra ID | `PeopleRegular` | `PeopleFilled` |
| Recovery Services Vault | `CloudBackupRegular` | `CloudBackupFilled` |
| Automation Account | `BotRegular` | `BotFilled` |
| CDN Profile | `TopSpeedRegular` | `TopSpeedFilled` |
| Redis Cache | `FlashRegular` | `FlashFilled` |
| Cognitive Services | `BrainCircuitRegular` | `BrainCircuitFilled` |
| Static Web App | `WindowRegular` | `WindowFilled` |
| Container App | `BoxRegular` | `BoxFilled` |

### Action Icons

| Action | Regular | Filled |
|--------|---------|--------|
| Create / Add / New | `AddRegular` | `AddFilled` |
| Delete / Remove | `DeleteRegular` | `DeleteFilled` |
| Edit / Modify | `EditRegular` | `EditFilled` |
| Save | `SaveRegular` | `SaveFilled` |
| Refresh / Reload | `ArrowSyncRegular` | `ArrowSyncFilled` |
| Download | `ArrowDownloadRegular` | `ArrowDownloadFilled` |
| Upload | `ArrowUploadRegular` | `ArrowUploadFilled` |
| Search | `SearchRegular` | `SearchFilled` |
| Filter | `FilterRegular` | `FilterFilled` |
| Sort | `ArrowSortRegular` | `ArrowSortFilled` |
| Copy | `CopyRegular` | `CopyFilled` |
| Move | `ArrowMoveRegular` | `ArrowMoveFilled` |
| Link / Connect | `LinkRegular` | `LinkFilled` |
| Unlink / Disconnect | `LinkDismissRegular` | `LinkDismissFilled` |
| Lock | `LockClosedRegular` | `LockClosedFilled` |
| Unlock | `LockOpenRegular` | `LockOpenFilled` |
| Start / Play | `PlayRegular` | `PlayFilled` |
| Stop | `StopRegular` | `StopFilled` |
| Restart | `ArrowResetRegular` | `ArrowResetFilled` |
| Settings / Configure | `SettingsRegular` | `SettingsFilled` |
| Help / Support | `QuestionCircleRegular` | `QuestionCircleFilled` |
| Info | `InfoRegular` | `InfoFilled` |
| Warning | `WarningRegular` | `WarningFilled` |
| Error | `ErrorCircleRegular` | `ErrorCircleFilled` |
| Success / Checkmark | `CheckmarkCircleRegular` | `CheckmarkCircleFilled` |
| Close / Dismiss | `DismissRegular` | `DismissFilled` |
| Expand | `ChevronDownRegular` | `ChevronDownFilled` |
| Collapse | `ChevronUpRegular` | `ChevronUpFilled` |
| Navigate forward | `ChevronRightRegular` | `ChevronRightFilled` |
| Navigate back | `ChevronLeftRegular` | `ChevronLeftFilled` |
| More actions | `MoreHorizontalRegular` | `MoreHorizontalFilled` |
| Open in new window | `OpenRegular` | `OpenFilled` |
| Full screen | `FullScreenMaximizeRegular` | `FullScreenMaximizeFilled` |
| Pin | `PinRegular` | `PinFilled` |
| Unpin | `PinOffRegular` | `PinOffFilled` |
| Favorite / Star | `StarRegular` | `StarFilled` |
| Share | `ShareRegular` | `ShareFilled` |
| Export | `ArrowExportRegular` | `ArrowExportFilled` |
| Import | `ArrowImportRegular` | `ArrowImportFilled` |

### Status Icons

| Status | Icon | Variant | Color token |
|--------|------|---------|-------------|
| Running / Healthy | `CheckmarkCircle` | `Regular` | `colorStatusSuccessForeground1` |
| Stopped / Deallocated | `Circle` | `Regular` | `colorNeutralForeground3` |
| Warning / Degraded | `Warning` | `Regular` | `colorStatusWarningForeground1` |
| Error / Critical | `ErrorCircle` | `Regular` | `colorStatusDangerForeground1` |
| Creating / Provisioning | Use `<Spinner size="tiny" />` | — | `colorBrandForeground1` |
| Unknown | `QuestionCircle` | `Regular` | `colorNeutralForeground3` |
| Information | `Info` | `Regular` | `colorBrandForeground1` |

### Navigation Icons

| Purpose | Regular | Filled |
|---------|---------|--------|
| Home | `HomeRegular` | `HomeFilled` |
| Dashboard | `BoardRegular` | `BoardFilled` |
| All resources | `AppsListRegular` | `AppsListFilled` |
| All services | `GridRegular` | `GridFilled` |
| Marketplace | `StoreMicrosoftRegular` | `StoreMicrosoftFilled` |
| Recent | `ClockRegular` | `ClockFilled` |
| Notifications | `AlertRegular` | `AlertFilled` |
| Cloud Shell | `WindowConsoleRegular` | `WindowConsoleFilled` |
| Directory + Subscription | `BuildingRegular` | `BuildingFilled` |
| Portal settings | `SettingsRegular` | `SettingsFilled` |
| Hamburger menu | `NavigationRegular` | `NavigationFilled` |
| Sidebar toggle | `PanelLeftRegular` | `PanelLeftFilled` |
| Activity log | `HistoryRegular` | `HistoryFilled` |
| Access control (IAM) | `PersonRegular` | `PersonFilled` |
| Tags | `TagRegular` | `TagFilled` |
| Diagnostics | `StethoscopeRegular` | `StethoscopeFilled` |
| Events | `FlashRegular` | `FlashFilled` |
| Properties | `InfoRegular` | `InfoFilled` |
| Locks | `LockClosedRegular` | `LockClosedFilled` |
| Automation | `BotRegular` | `BotFilled` |
| Monitoring | `PulseRegular` | `PulseFilled` |
| Alerts | `AlertRegular` | `AlertFilled` |

---

## icons.ts File Pattern

The generated `icons.ts` file should consolidate all icon imports and export `bundleIcon` composites where needed:

```tsx
// icons.ts — All icon imports for this component
import {
  bundleIcon,
  AddRegular,
  DeleteRegular,
  DeleteFilled,
  SettingsRegular,
  SettingsFilled,
  SearchRegular,
  StarRegular,
  StarFilled,
  CheckmarkCircleRegular,
  WarningRegular,
  ErrorCircleRegular,
} from '@fluentui/react-icons';

// Bundled icons for toggle states (nav selection, favorites, etc.)
export const SettingsIcon = bundleIcon(SettingsFilled, SettingsRegular);
export const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);
export const StarIcon = bundleIcon(StarFilled, StarRegular);

// Direct exports for non-toggle usage
export {
  AddRegular as AddIcon,
  SearchRegular as SearchIcon,
  CheckmarkCircleRegular as SuccessIcon,
  WarningRegular as WarningIcon,
  ErrorCircleRegular as ErrorIcon,
};
```

---

## Icon Detection Heuristic (CAPTURE Phase)

During Mode A (URL replication), detect icon source from the live page:

1. **Fluent v9 SVG icons** — Check `<svg>` inside `[class*="fui-"]` container with `aria-hidden="true"`. The parent component often has a `data-icon-name` or the SVG path data can be matched.
2. **Fluent v8 icon fonts** — Check for `ms-Icon` class + `data-icon-name` attribute → map the `data-icon-name` value (e.g., `Settings`, `Delete`) to the equivalent `@fluentui/react-icons` component using the tables above.
3. **Font Awesome** — Check `fa-*` classes → extract the icon name suffix → map to closest Fluent equivalent.
4. **Material Icons** — Check `material-icons` class + text content (e.g., `settings`) → map to Fluent equivalent.
5. **Image icons** — Check `<img>` with small dimensions (≤48px) → flag as icon, use `alt` text for matching.
6. **CSS background icons** — Check `background-image` with small container → flag as icon, try to match by context.

For unmatched icons, **auto-extract the asset** using the Tier 2 pipeline above:

1. Extract the SVG markup or download the image from the source page
2. Save to `<output-dir>/assets/` with a descriptive filename
3. Create a cleaned-up React wrapper in `icons.ts` (see Tier 2 section)
4. Add a comment noting the source selector and nearby label text for traceability

The goal is **zero broken icons** — every icon in the final output must render, whether from `@fluentui/react-icons` or auto-extracted.

---

## Hard Rules

1. **Always import from `@fluentui/react-icons`** — never use icon fonts, `ms-Icon`, or external icon CDNs.
2. **Named imports only** — never `import *`. Each icon is ~1KB; wildcard imports the entire 10k+ set.
3. **Use `Regular` variant by default** — only use `Filled` for active/selected states or via `bundleIcon()`.
4. **Use `bundleIcon()` for any icon that toggles** between selected/unselected states.
5. **Use the `icon` prop slot** when placing icons in Fluent v9 components (`Button`, `MenuItem`, `Tab`, `ToolbarButton`, etc.) — never render the icon as a text child.
6. **Apply color via `tokens.*`** — never hardcode icon colors. Use `style={{ color: tokens.colorStatusSuccessForeground1 }}` or a `makeStyles` class.
7. **Match icon size to context** — use the size guide table above. Import the matching size suffix for visual density.
8. **Consolidate all icon imports in `icons.ts`** — the main `index.tsx` imports from `./icons`, not directly from `@fluentui/react-icons`.
9. **For unmatched icons, auto-extract the original asset** from the source page (SVG markup or downloaded image). Clean up extracted SVGs (replace hardcoded fills with `currentColor`, normalize `viewBox`, set `width/height="1em"`). Save to `assets/` directory and wrap in a React component with the same API surface (`className`, `style` props).
10. **Never leave broken or placeholder icons** — every icon in the output must render. If it's not in `@fluentui/react-icons`, extract it from the source. If there's no source (Mode B), use the best Fluent match available.
11. **Never use Iconify, icon CDN URLs, or external icon services at runtime** — all icons must be locally bundled. Downloaded assets are saved to the output directory, not referenced by URL. This is the Fluent UI React approach (not the Coherence web component approach which uses Iconify as fallback).
