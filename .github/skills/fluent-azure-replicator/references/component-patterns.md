# Fluent Azure Component Patterns

How to map common UI patterns to the right `@fluentui/react-components` component, with Azure portal-specific patterns included. Each section shows what to look for in the source HTML and what Fluent v9 code to produce.

---

## Table of Contents

1. [Page Shell & Provider](#page-shell)
2. [Typography & Text](#typography)
3. [Buttons & Actions](#buttons)
4. [Navigation](#navigation)
5. [Azure Portal Navigation Patterns](#azure-navigation)
6. [Forms & Inputs](#forms)
7. [Cards & Containers](#cards)
8. [Tables & Data Grids](#tables)
9. [Azure Resource Table](#azure-resource-table)
10. [Dialogs & Overlays](#dialogs)
11. [Feedback & Status](#feedback)
12. [Azure Status Patterns](#azure-status)
13. [Lists & Collections](#lists)
14. [Media & Avatars](#media)
15. [Layout Utilities](#layout)
16. [Icons](#icons)
17. [Azure Command Bar](#azure-command-bar)
18. [Azure Breadcrumb](#azure-breadcrumb)
19. [Azure Create Wizard](#azure-create-wizard)
20. [Pattern Decision Tree](#decision-tree)

---

## Page Shell

**Source indicators:** `<html>`, `<body>`, root `<div>`, theme provider wrappers

```tsx
import { FluentProvider } from '@fluentui/react-components';
import { azureLightTheme, azureDarkTheme } from './theme';

// Detect theme from source background color:
// - Light bg (#fff, #fafafa, etc.) → azureLightTheme
// - Dark bg (#1b1a19, #292929, etc.) → azureDarkTheme
<FluentProvider theme={azureLightTheme}>
  {/* All content goes here */}
</FluentProvider>
```

See `azure-brand-ramp.md` for the custom Azure theme definition.

---

## Typography

**Source indicators:** `<h1>`–`<h6>`, `<p>`, `<span>` with font styling, `<label>`, `<small>`

| Source pattern | Fluent 2 component |
|---------------|-------------------|
| `<h1>` or font-size ≥ 32px heading | `<Title1>` (32px semibold) |
| `<h2>` or font-size ~28px heading | `<Title2>` (28px semibold) |
| `<h3>` or font-size ~24px heading | `<Title3>` (24px semibold) |
| `<h4>` or font-size ~20px heading | `<Subtitle1>` (20px semibold) |
| `<h5>` or font-size ~16px semibold | `<Subtitle2>` (16px semibold) |
| Body text at 14px | `<Body1>` (14px regular) |
| Bold body text at 14px | `<Body2>` (14px semibold) |
| Small text / helper text at 12px | `<Caption1>` (12px regular) |
| Very small text at 10px | `<Caption2>` (10px regular) |
| Large display text ≥ 40px | `<LargeTitle>` (40px) or `<Display>` (68px) |

### Azure Portal Typography

| Portal element | Component | Notes |
|----------------|-----------|-------|
| Page/blade title | `<Subtitle1>` | 20px semibold |
| Section header | `<Subtitle2>` | 16px semibold |
| Body / property value | `<Body1>` | 14px regular (portal uses 13px — snap to 14) |
| Property label | `<Body2>` | 14px semibold |
| Secondary / metadata | `<Caption1>` | 12px regular |
| Breadcrumb text | `<Body1>` | 14px regular |
| Command bar button | `<Body1>` | 14px regular (portal uses 13px — snap) |

```tsx
import { Title1, Body1, Caption1, Subtitle1, Subtitle2 } from '@fluentui/react-components';

<Subtitle1>Virtual Machine Overview</Subtitle1>
<Subtitle2>Essentials</Subtitle2>
<Body1>vm-production-west</Body1>
<Caption1>Last updated 5 minutes ago</Caption1>
```

---

## Buttons

**Source indicators:** `<button>`, `<a>` styled as button, `role="button"`, clickable elements

| Source pattern | Fluent v9 component |
|---------------|-------------------|
| Primary / filled button (brand color bg) | `<Button appearance="primary">` |
| Secondary / outlined button | `<Button appearance="outline">` |
| Ghost / text button (transparent bg) | `<Button appearance="transparent">` |
| Subtle hover-reveal button | `<Button appearance="subtle">` |
| Button with icon + text | `<Button icon={<Icon />}>Text</Button>` |
| Icon-only button | `<Button icon={<Icon />} appearance="subtle" />` |
| Button with subtitle | `<CompoundButton secondaryContent="Subtitle">` |
| Button that opens a menu | `<MenuButton>` |
| Split button (action + dropdown) | `<SplitButton>` |
| Toggle / switch button | `<ToggleButton>` |

Size mapping:
| Source size | Fluent v9 prop |
|-------------|---------------|
| Small (height ~24px) | `size="small"` |
| Medium/default (height ~32px) | `size="medium"` (default) |
| Large (height ~40px) | `size="large"` |

---

## Navigation

| Source pattern | Fluent v9 component |
|---------------|-------------------|
| Tab bar / tab navigation | `<TabList>` + `<Tab>` |
| Breadcrumb trail | `<Breadcrumb>` + `<BreadcrumbItem>` + `<BreadcrumbButton>` |
| Context menu / dropdown menu | `<Menu>` + `<MenuTrigger>` + `<MenuPopover>` + `<MenuList>` + `<MenuItem>` |
| Sidebar navigation | `<NavDrawer>` + `<NavItem>` / `<NavCategory>` + `<NavSubItem>` |
| Link text | `<Link>` |

---

## Azure Portal Navigation Patterns

### Global Top Bar

The Azure portal top bar contains: hamburger menu, Azure logo, search bar, cloud shell, notifications, settings, user avatar.

```tsx
import { Toolbar, ToolbarButton, SearchBox, Avatar, Badge } from '@fluentui/react-components';
import { NavigationRegular, AlertRegular, SettingsRegular, WindowConsoleRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  topBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#0078d4',   // Azure header brand color — no token equivalent
    height: '40px',
    padding: `0 ${tokens.spacingHorizontalL}`,
  },
  search: { flex: 1, maxWidth: '500px', margin: `0 ${tokens.spacingHorizontalL}` },
});

<div className={styles.topBar}>
  <ToolbarButton icon={<NavigationRegular />} appearance="transparent" />
  {/* Azure logo */}
  <SearchBox className={styles.search} placeholder="Search resources, services, and docs" />
  <ToolbarButton icon={<WindowConsoleRegular />} appearance="transparent" />
  <ToolbarButton icon={<AlertRegular />} appearance="transparent" />
  <ToolbarButton icon={<SettingsRegular />} appearance="transparent" />
  <Avatar name="User Name" size={28} />
</div>
```

### Side Navigation (Resource Blade)

Azure resource blades have a collapsible left nav with sections:

```tsx
import { NavDrawer, NavDrawerBody, NavItem, NavCategory, NavCategoryItem, NavSubItem } from '@fluentui/react-components';

<NavDrawer open type="inline" size="small">
  <NavDrawerBody>
    <NavItem value="overview" icon={<InfoRegular />}>Overview</NavItem>
    <NavItem value="activity" icon={<ClockRegular />}>Activity log</NavItem>
    <NavCategory value="settings">
      <NavCategoryItem icon={<SettingsRegular />}>Settings</NavCategoryItem>
      <NavSubItem value="networking">Networking</NavSubItem>
      <NavSubItem value="security">Security</NavSubItem>
      <NavSubItem value="properties">Properties</NavSubItem>
    </NavCategory>
    <NavCategory value="monitoring">
      <NavCategoryItem icon={<DataTrendingRegular />}>Monitoring</NavCategoryItem>
      <NavSubItem value="metrics">Metrics</NavSubItem>
      <NavSubItem value="alerts">Alerts</NavSubItem>
      <NavSubItem value="logs">Logs</NavSubItem>
    </NavCategory>
  </NavDrawerBody>
</NavDrawer>
```

---

## Forms

| Source pattern | Fluent v9 component |
|---------------|-------------------|
| Text input | `<Input>` |
| Multi-line text | `<Textarea>` |
| Native `<select>` | `<Select>` |
| Custom dropdown / autocomplete | `<Combobox>` or `<Dropdown>` |
| Checkbox | `<Checkbox>` |
| Radio group | `<RadioGroup>` + `<Radio>` |
| Toggle / switch | `<Switch>` |
| Slider / range | `<Slider>` |
| Date picker | `<DatePicker>` (from `@fluentui/react-datepicker-compat`) |
| Labeled input with helper text | `<Field>` wrapping the input |
| Search input | `<SearchBox>` |
| Spin button / numeric stepper | `<SpinButton>` |

Always wrap inputs in `<Field>` for label + validation:
```tsx
import { Field, Input } from '@fluentui/react-components';

<Field label="Resource name" validationMessage="Required" validationState="error">
  <Input />
</Field>
```

---

## Cards

| Source look | Fluent v9 appearance |
|-------------|---------------------|
| White bg + border, no shadow | `appearance="outline"` |
| White bg + shadow, no border | `appearance="filled"` (default) |
| Subtle bg (grey-ish), no border | `appearance="subtle"` |
| Alternate fill (slightly darker) | `appearance="filled-alternative"` |

```tsx
import { Card, CardHeader, CardFooter, Body1, Caption1, Button } from '@fluentui/react-components';

<Card appearance="outline">
  <CardHeader
    header={<Body1><b>Resource Name</b></Body1>}
    description={<Caption1>Resource type</Caption1>}
  />
  <CardFooter>
    <Button appearance="primary">Open</Button>
  </CardFooter>
</Card>
```

---

## Tables & Data Grids

| Source pattern | Fluent v9 component |
|---------------|-------------------|
| Static read-only table | `<Table>` + headers + rows + cells |
| Sortable/selectable data grid | `<DataGrid>` + columns + rows |
| Table with checkboxes | `<DataGrid>` with `selectionMode="multiselect"` |

```tsx
import {
  DataGrid, DataGridHeader, DataGridRow, DataGridHeaderCell, DataGridBody, DataGridCell,
  createTableColumn,
} from '@fluentui/react-components';

const columns = [
  createTableColumn({ columnId: 'name', renderHeaderCell: () => 'Name', renderCell: (item) => item.name }),
  createTableColumn({ columnId: 'status', renderHeaderCell: () => 'Status', renderCell: (item) => item.status }),
];

<DataGrid items={data} columns={columns} selectionMode="multiselect" sortable>
  <DataGridHeader><DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow></DataGridHeader>
  <DataGridBody>{({ item, rowId }) => <DataGridRow key={rowId}>{({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}</DataGridRow>}</DataGridBody>
</DataGrid>
```

---

## Azure Resource Table

The Azure portal resource list is a DataGrid with specific patterns:
- Checkbox selection column
- Resource name as a link (brand-colored)
- Status column with colored dot + text
- Resource group, location, subscription columns
- Command bar above with Create, Delete, Refresh, Assign tags, etc.
- Column resize, sort, filter

```tsx
const columns = [
  createTableColumn({
    columnId: 'name',
    compare: (a, b) => a.name.localeCompare(b.name),
    renderHeaderCell: () => 'Name',
    renderCell: (item) => (
      <Link>{item.name}</Link>
    ),
  }),
  createTableColumn({
    columnId: 'status',
    renderHeaderCell: () => 'Status',
    renderCell: (item) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
        <PresenceBadge status={item.status === 'Running' ? 'available' : 'offline'} size="tiny" />
        <Body1>{item.status}</Body1>
      </div>
    ),
  }),
  createTableColumn({
    columnId: 'resourceGroup',
    renderHeaderCell: () => 'Resource group',
    renderCell: (item) => item.resourceGroup,
  }),
  createTableColumn({
    columnId: 'location',
    renderHeaderCell: () => 'Location',
    renderCell: (item) => item.location,
  }),
];
```

---

## Dialogs & Overlays

| Source pattern | Fluent v9 component |
|---------------|-------------------|
| Modal dialog | `<Dialog>` + `<DialogSurface>` + `<DialogTitle>` + `<DialogBody>` + `<DialogActions>` |
| Non-modal dialog | `<Dialog modalType="non-modal">` |
| Alert / confirmation | `<Dialog modalType="alert">` |
| Side panel / drawer | `<Drawer>` or `<OverlayDrawer>` / `<InlineDrawer>` |
| Popover on click | `<Popover>` + `<PopoverTrigger>` + `<PopoverSurface>` |
| Tooltip on hover | `<Tooltip>` |

---

## Feedback & Status

| Source pattern | Fluent v9 component |
|---------------|-------------------|
| Toast / snackbar | `<Toast>` via `useToastController()` |
| Inline banner | `<MessageBar>` + `<MessageBarBody>` |
| Spinner | `<Spinner>` |
| Progress bar | `<ProgressBar>` |
| Skeleton loading | `<Skeleton>` + `<SkeletonItem>` |
| Badge (dot/count) | `<Badge>` / `<CounterBadge>` |
| Presence indicator | `<PresenceBadge>` |
| Teaching callout | `<TeachingPopover>` |

---

## Azure Status Patterns

### Status Bar / Message Bar

Azure portal uses colored status bars for info, success, warning, error:

```tsx
import { MessageBar, MessageBarBody, MessageBarTitle, MessageBarActions, Button, Link } from '@fluentui/react-components';

// Info
<MessageBar intent="info">
  <MessageBarBody>
    <MessageBarTitle>Tip</MessageBarTitle>
    You can pin this resource to your dashboard.
  </MessageBarBody>
</MessageBar>

// Warning
<MessageBar intent="warning">
  <MessageBarBody>
    <MessageBarTitle>Action required</MessageBarTitle>
    Your certificate will expire in 30 days. <Link>Renew now</Link>
  </MessageBarBody>
</MessageBar>

// Error
<MessageBar intent="error">
  <MessageBarBody>
    <MessageBarTitle>Error</MessageBarTitle>
    Failed to load metrics data.
  </MessageBarBody>
  <MessageBarActions>
    <Button appearance="transparent" size="small">Retry</Button>
  </MessageBarActions>
</MessageBar>

// Success
<MessageBar intent="success">
  <MessageBarBody>Deployment completed successfully.</MessageBarBody>
</MessageBar>
```

### Resource Status Indicators

Use `PresenceBadge` for resource status (Running, Stopped, etc.) or `Badge` for categorical labels:

```tsx
<PresenceBadge status="available" size="tiny" /> // Running — green dot
<PresenceBadge status="offline" size="tiny" />   // Stopped — grey dot
<PresenceBadge status="busy" size="tiny" />       // Error — red dot
<PresenceBadge status="away" size="tiny" />       // Warning — yellow dot
```

---

## Lists & Collections

| Source pattern | Fluent v9 component |
|---------------|-------------------|
| Horizontal tags/chips | `<TagGroup>` + `<Tag>` / `<InteractionTag>` |
| Accordion / expandable | `<Accordion>` + `<AccordionItem>` + `<AccordionHeader>` + `<AccordionPanel>` |
| Tree / hierarchy | `<Tree>` + `<TreeItem>` + `<TreeItemLayout>` |
| Simple list | Custom flex layout with `makeStyles` |

---

## Media & Avatars

| Source size (approx) | `Avatar` size prop |
|----------------------|-------------------|
| ~20px | `size={20}` |
| ~24–28px | `size={24}` or `size={28}` |
| ~32px | `size={32}` |
| ~40px | `size={40}` |
| ~48px | `size={48}` |
| ~64–72px | `size={64}` or `size={72}` |
| ~96–128px | `size={96}` or `size={128}` |

---

## Layout Utilities

Fluent v9 doesn't provide layout primitives. Use `makeStyles` with flex/grid:

```tsx
const useStyles = makeStyles({
  row: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: tokens.spacingHorizontalM },
  column: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: tokens.spacingHorizontalL },
});
```

Always use spacing tokens for `gap`, `padding`, `margin`. Keep `display`, `flex-direction`, `align-items`, `justify-content`, `grid-template-*` as-is from source.

### Dividers

`<hr>` or border-bottom separators → `<Divider>`:
```tsx
<Divider />
<Divider vertical />
<Divider appearance="brand" />
<Divider>Section Title</Divider>
```

---

## Icons

Use `@fluentui/react-icons`. Each icon has `Regular` (outline) and `Filled` variants. Default size is 20px.

```tsx
import { AddRegular, SettingsRegular } from '@fluentui/react-icons';
<Button icon={<AddRegular />}>Add</Button>
```

See `icon-map.md` for Azure portal icon → Fluent icon mapping.

---

## Azure Command Bar

The Azure command bar is a `Toolbar` with specific button arrangement:

```tsx
import { Toolbar, ToolbarButton, ToolbarDivider } from '@fluentui/react-components';
import { AddRegular, DeleteRegular, ArrowSyncRegular, FilterRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  commandBar: {
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

<Toolbar className={styles.commandBar}>
  <ToolbarButton appearance="subtle" icon={<AddRegular />}>Create</ToolbarButton>
  <ToolbarButton appearance="subtle" icon={<DeleteRegular />}>Delete</ToolbarButton>
  <ToolbarDivider />
  <ToolbarButton appearance="subtle" icon={<ArrowSyncRegular />}>Refresh</ToolbarButton>
  <ToolbarButton appearance="subtle" icon={<FilterRegular />}>Filter</ToolbarButton>
</Toolbar>
```

---

## Azure Breadcrumb

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider } from '@fluentui/react-components';

<Breadcrumb>
  <BreadcrumbItem><BreadcrumbButton>Home</BreadcrumbButton></BreadcrumbItem>
  <BreadcrumbDivider />
  <BreadcrumbItem><BreadcrumbButton>Virtual machines</BreadcrumbButton></BreadcrumbItem>
  <BreadcrumbDivider />
  <BreadcrumbItem><BreadcrumbButton current>vm-prod-01</BreadcrumbButton></BreadcrumbItem>
</Breadcrumb>
```

---

## Azure Create Wizard

The Azure create flow uses a multi-step form. Fluent v9 doesn't have a built-in Stepper, so compose with `TabList` for step navigation + form panels:

```tsx
import { TabList, Tab, Card, Button } from '@fluentui/react-components';

const [step, setStep] = useState('basics');

<div className={styles.createWizard}>
  <TabList vertical selectedValue={step} onTabSelect={(_, data) => setStep(data.value as string)}>
    <Tab value="basics">Basics</Tab>
    <Tab value="networking">Networking</Tab>
    <Tab value="management">Management</Tab>
    <Tab value="tags">Tags</Tab>
    <Tab value="review">Review + create</Tab>
  </TabList>
  <div className={styles.formPanel}>
    {step === 'basics' && <BasicsForm />}
    {step === 'networking' && <NetworkingForm />}
    {/* ... */}
    <div className={styles.formActions}>
      <Button appearance="primary">Review + create</Button>
      <Button appearance="outline">Previous</Button>
      <Button appearance="outline">Next</Button>
    </div>
  </div>
</div>
```

---

## Decision Tree

```
Is it interactive (clickable)?
├─ Yes → Triggers action? → Button (pick appearance)
│        Navigates? → Link or Tab
│        Toggles state? → ToggleButton, Switch, Checkbox
│        Opens menu? → MenuButton or Menu
│        Otherwise → Card (onClick) or InteractionTag
├─ No → Container?
│  ├─ Yes → Has border/shadow/radius? → Card
│  │        Pure layout wrapper → div + makeStyles
│  └─ No → Text? → Typography component (match size)
│           Image? → Image or Avatar
│           Separator? → Divider
│           Status indicator? → Badge / PresenceBadge
│           Otherwise → ⚠️ Search Fluent v9 components
│              before using raw HTML
```
