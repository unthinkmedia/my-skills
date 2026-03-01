# Grid Template: Azure Browse Page

The standard layout for Azure resource list/browse pages (e.g., All Resources, Virtual Machines list, Storage Accounts list). Full-width layout with command bar, optional filter sidebar, and a scrollable DataGrid.

## Structure

```
┌──────────────────────────────────────────────────┐
│ Breadcrumb                                       │
├──────────────────────────────────────────────────┤
│ Page Header (title + description)                │
├──────────────────────────────────────────────────┤
│ Command Bar (Create | Delete | Refresh | Filter) │
├──────────────┬───────────────────────────────────┤
│              │                                   │
│  Filter      │   DataGrid / Resource Table       │
│  Sidebar     │   (sortable, selectable)          │
│  (optional)  │                                   │
│              │   ┌────┬────────┬───────┬───────┐ │
│  ☐ Type      │   │ ☐  │ Name   │Status │ RG    │ │
│  ☐ Location  │   ├────┼────────┼───────┼───────┤ │
│  ☐ Status    │   │ ☐  │ vm-01  │Running│ rg-1  │ │
│              │   │ ☐  │ vm-02  │Stopped│ rg-2  │ │
│              │   └────┴────────┴───────┴───────┘ │
│              │                                   │
│              │   Showing 1-50 of 234             │
└──────────────┴───────────────────────────────────┘
```

## Template Definition

```typescript
import { tokens } from '@fluentui/react-components';

export const azureBrowsePage = {
  name: 'azure-browse-page',
  description: 'Resource list/browse page. Full-width with command bar, optional filter sidebar, and DataGrid.',
  type: 'flex' as const,
  responsive: false,

  layout: {
    outer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    },
    breadcrumb: {
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
      borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    },
    header: {
      padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    },
    commandBar: {
      borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
      borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
      padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    },
    body: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
    },
    filterSidebar: {
      width: '240px',
      minWidth: '240px',
      borderRight: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
      overflowY: 'auto',
      padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    },
    dataGrid: {
      flex: 1,
      overflow: 'auto',
    },
    pagination: {
      borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },

  slots: {
    breadcrumb: { minHeight: '32px' },
    header: { minHeight: '48px' },
    commandBar: { minHeight: '36px' },
    filterSidebar: { width: '240px', minWidth: '240px', overflow: 'auto', optional: true },
    dataGrid: { flex: '1', overflow: 'auto' },
    pagination: { minHeight: '36px', optional: true },
  },
};
```

## Usage in makeStyles

```tsx
const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  breadcrumb: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  header: { padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}` },
  commandBar: {
    borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
  },
  body: { display: 'flex', flex: 1, overflow: 'hidden' },
  filterSidebar: {
    width: '240px',
    minWidth: '240px',
    borderRight: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    overflowY: 'auto',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
  },
  dataGrid: { flex: 1, overflow: 'auto' },
  pagination: {
    borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
```

## When to Use

- All Resources page
- Any resource type list page (VMs, Storage, App Services, etc.)
- Marketplace search results
- Browse pages with category filters

## When NOT to Use

- Resource detail pages → use `azure-resource-blade`
- Create flows → use `azure-create-wizard`
- Dashboard / home → use `azure-dashboard`
