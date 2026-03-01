# Grid Template: Azure Resource Blade

The standard layout for an Azure portal resource detail page (e.g., VM overview, Storage account, App Service). Breadcrumb and page header span full width above the sidebar + content split.

## Structure

```
┌──────────────────────────────────────────────────┐
│ Breadcrumb                                       │
├──────────────────────────────────────────────────┤
│ Page Header (icon + title + actions)             │
├────────────┬─────────────────────────────────────┤
│            │                                     │
│  Side Nav  │        Content Area                 │
│  (220px)   │        (flex: 1)                    │
│            │                                     │
│  Overview  │  ┌─────────────────────────────┐    │
│  Activity  │  │ Command Bar                 │    │
│  Settings  │  ├─────────────────────────────┤    │
│  > Network │  │                             │    │
│  > Security│  │  Page Content               │    │
│  Monitoring│  │  (scrollable)               │    │
│  > Metrics │  │                             │    │
│  > Alerts  │  └─────────────────────────────┘    │
│            │                                     │
└────────────┴─────────────────────────────────────┘
```

## Template Definition

```typescript
import { tokens } from '@fluentui/react-components';

export const azureResourceBlade = {
  name: 'azure-resource-blade',
  description: 'Resource detail page with side navigation. Breadcrumb + header span full width above sidebar/content split.',
  type: 'flex' as const,
  responsive: false,

  layout: {
    // Outer container — vertical stack
    outer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    },
    // Breadcrumb row
    breadcrumb: {
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
      borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    },
    // Header row
    header: {
      padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
      borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    },
    // Body — horizontal split: sidebar + content
    body: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
    },
    // Sidebar
    sidebar: {
      width: '220px',
      minWidth: '220px',
      borderRight: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
      overflowY: 'auto',
      padding: `${tokens.spacingVerticalS} 0`,
    },
    // Content
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    // Command bar (within content)
    commandBar: {
      borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
      padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    },
    // Scrollable content area
    scrollContent: {
      flex: 1,
      overflowY: 'auto',
      padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXL}`,
    },
  },

  slots: {
    breadcrumb: { minHeight: '32px' },
    header: { minHeight: '48px' },
    sidebar: { width: '220px', minWidth: '220px', overflow: 'auto' },
    commandBar: { minHeight: '36px' },
    content: { flex: '1', overflow: 'auto', padding: '16px 20px' },
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
  header: {
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  body: { display: 'flex', flex: 1, overflow: 'hidden' },
  sidebar: {
    width: '220px',
    minWidth: '220px',
    borderRight: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    overflowY: 'auto',
    padding: `${tokens.spacingVerticalS} 0`,
  },
  contentArea: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  commandBar: {
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
  },
  scrollContent: {
    flex: 1,
    overflowY: 'auto',
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXL}`,
  },
});
```

## When to Use

- Any Azure resource detail page (VM, Storage, App Service, etc.)
- Any page where a specific deployed resource is being viewed
- Any page with section navigation (Overview, Settings, Monitoring, etc.)

## When NOT to Use

- Home pages, create wizards, marketplace browse → use other templates
- Full-width browse/list pages → use `azure-browse-page`
