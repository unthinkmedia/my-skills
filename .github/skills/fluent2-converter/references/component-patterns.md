# Fluent 2 Component Patterns

How to map common UI patterns from any web page to the right `@fluentui/react-components` component. Each section shows what to look for in the source HTML and what Fluent 2 code to produce.

---

## Table of Contents

1. [Page Shell & Provider](#page-shell)
2. [Typography & Text](#typography)
3. [Buttons & Actions](#buttons)
4. [Navigation](#navigation)
5. [Forms & Inputs](#forms)
6. [Cards & Containers](#cards)
7. [Tables & Data Grids](#tables)
8. [Dialogs & Overlays](#dialogs)
9. [Feedback & Status](#feedback)
10. [Lists & Collections](#lists)
11. [Media & Avatars](#media)
12. [Layout Utilities](#layout)
13. [Icons](#icons)
14. [Pattern Decision Tree](#decision-tree)

---

## Page Shell

**Source indicators:** `<html>`, `<body>`, root `<div>`, theme provider wrappers

```tsx
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';

// Detect theme from source background color:
// - Light bg (#fff, #fafafa, etc.) → webLightTheme
// - Dark bg (#1b1a19, #292929, etc.) → webDarkTheme
<FluentProvider theme={webLightTheme}>
  {/* All content goes here */}
</FluentProvider>
```

Custom brand ramp: if the source uses non-default brand colors, create a custom theme:
```tsx
import { createLightTheme, createDarkTheme, BrandVariants } from '@fluentui/react-components';

const brand: BrandVariants = {
  10: '#020305', 20: '#111723', /* ... full 16-shade ramp */ 160: '#f0f5ff'
};
const lightTheme = createLightTheme(brand);
```

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

```tsx
import { Title1, Body1, Caption1 } from '@fluentui/react-components';

<Title1>Page Heading</Title1>
<Body1>Regular paragraph text</Body1>
<Caption1>Helper or metadata text</Caption1>
```

For inline text styling, use the `<Text>` component with props:
```tsx
import { Text } from '@fluentui/react-components';
<Text weight="semibold" size={400}>Custom styled text</Text>
```

---

## Buttons

**Source indicators:** `<button>`, `<a>` styled as button, `role="button"`, clickable elements with hover states

| Source pattern | Fluent 2 component |
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
| Source size | Fluent 2 prop |
|-------------|---------------|
| Small (height ~24px, padding tight) | `size="small"` |
| Medium/default (height ~32px) | `size="medium"` (default) |
| Large (height ~40px) | `size="large"` |

```tsx
import { Button } from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';

<Button appearance="primary" size="medium" icon={<AddRegular />}>
  Create new
</Button>
```

---

## Navigation

**Source indicators:** `<nav>`, `<ul>` with links, tab bars, breadcrumbs, sidebar menus

| Source pattern | Fluent 2 component |
|---------------|-------------------|
| Tab bar / tab navigation | `<TabList>` + `<Tab>` |
| Breadcrumb trail | `<Breadcrumb>` + `<BreadcrumbItem>` + `<BreadcrumbButton>` |
| Context menu / dropdown menu | `<Menu>` + `<MenuTrigger>` + `<MenuPopover>` + `<MenuList>` + `<MenuItem>` |
| Sidebar navigation links | `<NavDrawer>` + `<NavItem>` (if using nav drawer) or custom with `<Tree>` |
| Link text | `<Link>` |

```tsx
import { TabList, Tab } from '@fluentui/react-components';

<TabList selectedValue="tab1">
  <Tab value="tab1">Overview</Tab>
  <Tab value="tab2">Settings</Tab>
</TabList>
```

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbButton } from '@fluentui/react-components';

<Breadcrumb>
  <BreadcrumbItem><BreadcrumbButton>Home</BreadcrumbButton></BreadcrumbItem>
  <BreadcrumbItem><BreadcrumbButton>Category</BreadcrumbButton></BreadcrumbItem>
  <BreadcrumbItem><BreadcrumbButton current>Current</BreadcrumbButton></BreadcrumbItem>
</Breadcrumb>
```

---

## Forms

**Source indicators:** `<input>`, `<select>`, `<textarea>`, `<form>`, `<label>`, form groups

| Source pattern | Fluent 2 component |
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
| Labeled input with helper text | `<Field>` wrapping the input component |
| Search input | `<SearchBox>` |
| Spin button / numeric stepper | `<SpinButton>` |

Always wrap inputs in `<Field>` for label + validation:
```tsx
import { Field, Input } from '@fluentui/react-components';

<Field label="Email" validationMessage="Required" validationState="error">
  <Input type="email" />
</Field>
```

---

## Cards

**Source indicators:** Containers with border/shadow, rounded corners, padding, containing mixed content

| Source pattern | Fluent 2 component |
|---------------|-------------------|
| Content card (image + text + actions) | `<Card>` + `<CardHeader>` + `<CardPreview>` + `<CardFooter>` |
| Clickable card (entire card is interactive) | `<Card>` with `onClick` or as `<a>` |
| Simple content container with border/shadow | `<Card appearance="outline">` or `<Card appearance="subtle">` |
| Card with header avatar + title + description | `<CardHeader image={<Avatar />} header={...} description={...}>` |

```tsx
import { Card, CardHeader, CardPreview, CardFooter, Button } from '@fluentui/react-components';

<Card>
  <CardPreview><img src="preview.png" alt="" /></CardPreview>
  <CardHeader
    header={<Body1><b>Title</b></Body1>}
    description={<Caption1>Description</Caption1>}
  />
  <CardFooter>
    <Button appearance="primary">Action</Button>
  </CardFooter>
</Card>
```

Appearance mapping:
| Source look | Fluent 2 appearance |
|-------------|---------------------|
| White bg + border, no shadow | `appearance="outline"` |
| White bg + shadow, no border | `appearance="filled"` (default) |
| Subtle bg (grey-ish), no border | `appearance="subtle"` |
| Alternate fill (slightly darker) | `appearance="filled-alternative"` |

---

## Tables

**Source indicators:** `<table>`, data grid, rows/columns of structured data

| Source pattern | Fluent 2 component |
|---------------|-------------------|
| Static read-only table | `<Table>` + `<TableHeader>` + `<TableRow>` + `<TableCell>` |
| Sortable/selectable data grid | `<DataGrid>` + `<DataGridHeader>` + `<DataGridRow>` + `<DataGridCell>` |
| Table with selection (checkboxes) | `<DataGrid>` with `selectionMode="multiselect"` |

```tsx
import {
  Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell
} from '@fluentui/react-components';

<Table>
  <TableHeader>
    <TableRow>
      <TableHeaderCell>Name</TableHeaderCell>
      <TableHeaderCell>Status</TableHeaderCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item 1</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Dialogs

**Source indicators:** Modal overlays, popup containers, confirmation boxes, slide-out panels

| Source pattern | Fluent 2 component |
|---------------|-------------------|
| Modal dialog (centered, with overlay) | `<Dialog>` + `<DialogSurface>` + `<DialogTitle>` + `<DialogBody>` + `<DialogActions>` |
| Non-modal dialog | `<Dialog modalType="non-modal">` |
| Alert / confirmation | `<Dialog modalType="alert">` |
| Side panel / drawer | `<Drawer>` or `<OverlayDrawer>` / `<InlineDrawer>` |
| Popover on click | `<Popover>` + `<PopoverTrigger>` + `<PopoverSurface>` |

```tsx
import { Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogBody, DialogActions, Button } from '@fluentui/react-components';

<Dialog>
  <DialogTrigger><Button>Open</Button></DialogTrigger>
  <DialogSurface>
    <DialogTitle>Confirm action</DialogTitle>
    <DialogBody>Are you sure?</DialogBody>
    <DialogActions>
      <DialogTrigger><Button appearance="secondary">Cancel</Button></DialogTrigger>
      <Button appearance="primary">Confirm</Button>
    </DialogActions>
  </DialogSurface>
</Dialog>
```

---

## Feedback & Status

**Source indicators:** Toast notifications, banners, progress bars, spinners, badges

| Source pattern | Fluent 2 component |
|---------------|-------------------|
| Toast / snackbar notification | `<Toast>` + `useToastController()` |
| Inline message bar / banner | `<MessageBar>` + `<MessageBarBody>` |
| Loading spinner | `<Spinner>` |
| Progress bar | `<ProgressBar>` |
| Skeleton / placeholder loading | `<Skeleton>` + `<SkeletonItem>` |
| Status badge (dot or count) | `<Badge>` or `<CounterBadge>` |
| Presence indicator | `<PresenceBadge>` |
| Info callout / teaching bubble | `<TeachingPopover>` |

```tsx
import { Spinner, ProgressBar, Badge } from '@fluentui/react-components';

<Spinner size="medium" label="Loading..." />
<ProgressBar value={0.6} />
<Badge appearance="filled" color="success">Active</Badge>
```

---

## Lists

**Source indicators:** `<ul>`, `<ol>`, repeated item containers, `.list-item` patterns

| Source pattern | Fluent 2 component |
|---------------|-------------------|
| Simple item list | Custom flex/stack layout (no dedicated List component in v9 — use `makeStyles`) |
| Horizontal list of tags/chips | `<TagGroup>` + `<Tag>` or `<InteractionTag>` |
| Accordion / expandable sections | `<Accordion>` + `<AccordionItem>` + `<AccordionHeader>` + `<AccordionPanel>` |
| Tree / hierarchical list | `<Tree>` + `<TreeItem>` + `<TreeItemLayout>` |

---

## Media & Avatars

**Source indicators:** User images, profile pictures, avatar circles, images

| Source pattern | Fluent 2 component |
|---------------|-------------------|
| Circular profile image | `<Avatar image={{ src: "..." }}>` |
| Initials avatar (no image) | `<Avatar name="John Doe">` |
| Group of avatars | `<AvatarGroup>` + `<AvatarGroupItem>` |
| Content image | `<Image>` |

Avatar size mapping:
| Source size | Fluent 2 size prop |
|-------------|-------------------|
| ~20px | `size={20}` |
| ~24px | `size={24}` |
| ~28px | `size={28}` |
| ~32px | `size={32}` |
| ~36px | `size={36}` |
| ~40px | `size={40}` |
| ~48px | `size={48}` |
| ~56px | `size={56}` |
| ~64px | `size={64}` |
| ~72px | `size={72}` |
| ~96px | `size={96}` |
| ~120px | `size={120}` |
| ~128px | `size={128}` |

---

## Layout Utilities

Fluent 2 doesn't provide layout primitives like "Stack" in v9. Use `makeStyles` with flex/grid:

```tsx
const useStyles = makeStyles({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacingHorizontalL,
  },
});
```

Key layout translation rules:
- Always use spacing tokens for `gap`, `padding`, `margin`
- Keep `display`, `flex-direction`, `align-items`, `justify-content`, `grid-template-*` as-is from the source
- Translate hardcoded pixel values for spacing to nearest token

### Dividers

Source `<hr>` or border-bottom separators → `<Divider>`:
```tsx
import { Divider } from '@fluentui/react-components';
<Divider />                           // horizontal
<Divider vertical />                 // vertical
<Divider appearance="brand" />       // brand-colored
<Divider>Section Title</Divider>     // with label
```

---

## Icons

Fluent 2 uses `@fluentui/react-icons`. Each icon has variants:

| Variant | When to use |
|---------|-------------|
| `*Regular` | Default / unfilled state |
| `*Filled` | Selected / active state |

Standard sizes: 16, 20, 24, 28, 32, 48 (suffix matches: `Add16Regular`, `Add20Regular`, etc.)

```tsx
import { AddRegular, DeleteRegular, SettingsRegular } from '@fluentui/react-icons';

<Button icon={<AddRegular />}>Add item</Button>
```

When the source uses an icon library (Font Awesome, Material Icons, Heroicons, etc.), find the equivalent Fluent icon by semantic meaning, not by visual match.

---

## Decision Tree

When you encounter an element and aren't sure what Fluent 2 component to use:

```
Is it interactive (clickable/tapable)?
├─ Yes → Does it submit or trigger an action?
│  ├─ Yes → Button (pick appearance from visual style)
│  └─ No → Does it navigate?
│     ├─ Yes → Link or Tab
│     └─ No → Does it toggle state?
│        ├─ Yes → ToggleButton, Switch, or Checkbox
│        └─ No → Does it open a menu?
│           ├─ Yes → MenuButton or Menu
│           └─ No → Card (with onClick) or InteractionTag
├─ No → Is it a container?
│  ├─ Yes → Does it have border/shadow/rounded corners?
│  │  ├─ Yes → Card
│  │  └─ No → Layout div with makeStyles (tokens only, no semantic meaning)
│  └─ No → Is it text?
│     ├─ Yes → Use Typography component (see size → component table)
│     └─ No → Is it an image?
│        ├─ Yes → Image or Avatar (if circular profile pic)
│        └─ No → Is it a separator?
│           ├─ Yes → Divider
│           └─ No → Is it a status indicator?
│              ├─ Yes → Badge or PresenceBadge
│              └─ No → ⚠️ STOP: Search the Fluent 2 component list before
│                 using a raw HTML element. Only use <div>/<span> for
│                 pure layout wrappers with no semantic UI meaning.
```
