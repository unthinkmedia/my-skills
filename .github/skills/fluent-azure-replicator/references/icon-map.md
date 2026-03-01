# Azure Portal Icon → Fluent React Icons Map

Mapping of common Azure portal icon names to `@fluentui/react-icons` exports. Import from:

```tsx
import { SettingsRegular, SettingsFilled } from '@fluentui/react-icons';
```

Every icon has `Regular` (outline) and `Filled` variants. Use `Regular` by default, `Filled` for active/selected state. Default size is 20px — use the size suffix for others (e.g., `Settings16Regular`, `Settings24Regular`).

---

## Resource Type Icons

| Azure concept | Icon name | Import |
|---------------|-----------|--------|
| Virtual Machine | `DesktopRegular` | `@fluentui/react-icons` |
| App Service / Web App | `GlobeRegular` | |
| Storage Account | `DatabaseRegular` | |
| SQL Database | `DatabaseRegular` | |
| Cosmos DB | `DatabaseMultipleRegular` | |
| Key Vault | `KeyRegular` | |
| Function App | `FlashRegular` | |
| Container Registry | `BoxRegular` | |
| Kubernetes Service (AKS) | `BoxMultipleRegular` | |
| Virtual Network | `CloudFlowRegular` | |
| Network Security Group | `ShieldRegular` | |
| Load Balancer | `ArrowSyncRegular` | |
| Application Gateway | `GatewayRegular` | |
| DNS Zone | `GlobeRegular` | |
| Subscription | `WalletCreditCardRegular` | |
| Resource Group | `FolderRegular` | |
| Management Group | `OrganizationRegular` | |
| Policy | `ShieldCheckmarkRegular` | |
| Logic App | `FlowRegular` | |
| API Management | `PlugConnectedRegular` | |
| Service Bus | `VehicleBusRegular` | |
| Event Hub | `LiveRegular` | |
| Application Insights | `PulseRegular` | |
| Monitor / Log Analytics | `DataTrendingRegular` | |
| Advisor | `LightbulbRegular` | |
| Cost Management | `MoneyRegular` | |
| Microsoft Entra ID | `PeopleRegular` | |
| Recovery Services Vault | `CloudBackupRegular` | |
| Automation Account | `BotRegular` | |
| CDN Profile | `TopSpeedRegular` | |
| Redis Cache | `FlashRegular` | |
| Cognitive Services | `BrainCircuitRegular` | |
| Static Web App | `WindowRegular` | |
| Container App | `BoxRegular` | |

---

## Action Icons

| Action | Icon | Import |
|--------|------|--------|
| Create / Add / New | `AddRegular` | |
| Delete / Remove | `DeleteRegular` | |
| Edit / Modify | `EditRegular` | |
| Save | `SaveRegular` | |
| Refresh / Reload | `ArrowSyncRegular` | |
| Download | `ArrowDownloadRegular` | |
| Upload | `ArrowUploadRegular` | |
| Search | `SearchRegular` | |
| Filter | `FilterRegular` | |
| Sort | `ArrowSortRegular` | |
| Copy | `CopyRegular` | |
| Move | `ArrowMoveRegular` | |
| Link / Connect | `LinkRegular` | |
| Unlink / Disconnect | `LinkDismissRegular` | |
| Lock | `LockClosedRegular` | |
| Unlock | `LockOpenRegular` | |
| Start / Play | `PlayRegular` | |
| Stop | `StopRegular` | |
| Restart | `ArrowResetRegular` | |
| Settings / Configure | `SettingsRegular` | |
| Help / Support | `QuestionCircleRegular` | |
| Info | `InfoRegular` | |
| Warning | `WarningRegular` | |
| Error | `ErrorCircleRegular` | |
| Success / Checkmark | `CheckmarkCircleRegular` | |
| Close / Dismiss | `DismissRegular` | |
| Expand | `ChevronDownRegular` | |
| Collapse | `ChevronUpRegular` | |
| Navigate forward | `ChevronRightRegular` | |
| Navigate back | `ChevronLeftRegular` | |
| More actions | `MoreHorizontalRegular` | |
| Open in new window | `OpenRegular` | |
| Full screen | `FullScreenMaximizeRegular` | |
| Pin | `PinRegular` | |
| Unpin | `PinOffRegular` | |
| Favorite / Star | `StarRegular` / `StarFilled` | |
| Share | `ShareRegular` | |
| Export | `ArrowExportRegular` | |
| Import | `ArrowImportRegular` | |

---

## Status Icons

| Status | Icon | Color token |
|--------|------|-------------|
| Running / Healthy | `CheckmarkCircleRegular` | `colorStatusSuccessForeground1` |
| Stopped / Deallocated | `CircleRegular` | `colorNeutralForeground3` |
| Warning / Degraded | `WarningRegular` | `colorStatusWarningForeground1` |
| Error / Critical | `ErrorCircleRegular` | `colorStatusDangerForeground1` |
| Creating / Provisioning | `SpinnerIos20Regular` or `<Spinner size="tiny">` | `colorBrandForeground1` |
| Unknown | `QuestionCircleRegular` | `colorNeutralForeground3` |
| Information | `InfoRegular` | `colorBrandForeground1` |

---

## Navigation Icons

| Purpose | Icon |
|---------|------|
| Home | `HomeRegular` |
| Dashboard | `BoardRegular` |
| All resources | `AppsListRegular` |
| All services | `GridRegular` |
| Marketplace | `StoreMicrosoftRegular` |
| Recent | `ClockRegular` |
| Notifications | `AlertRegular` |
| Cloud Shell | `WindowConsoleRegular` |
| Directory + Subscription | `BuildingRegular` |
| Portal settings | `SettingsRegular` |
| Hamburger menu | `NavigationRegular` |
| Sidebar toggle | `PanelLeftRegular` |

---

## Icon Detection Heuristic

During CAPTURE, detect icon source:

1. **SVG icons** — Check `<svg>` with `<path>` data. Extract `aria-label` or `title` for matching.
2. **Fluent icon fonts** — Check for `ms-Icon` class + `data-icon-name` attribute → map directly.
3. **Font Awesome** — Check `fa-*` classes → extract the icon name suffix.
4. **Material Icons** — Check `material-icons` class + text content (e.g., `settings`).
5. **Image icons** — Check `<img>` with small dimensions (≤48px) → flag as icon, use alt text for matching.
6. **CSS background icons** — Check `background-image` with small container → flag as icon, try to match by context.

For unmatched icons, generate an UNRESOLVED entry with:
- Screenshot crop of the icon area
- Surrounding text context
- Suggested Fluent icon (best guess by name)
