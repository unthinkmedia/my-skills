# Grid Template: Azure Settings Page

The standard layout for Azure resource settings pages (e.g., Configuration, Networking, Properties, Locks). Uses the resource blade layout (side nav + content) but the content area contains stacked form sections instead of data grids or dashboards.

## Structure

```
┌──────────────────────────────────────────────────┐
│ Breadcrumb                                       │
├──────────────────────────────────────────────────┤
│ Page Header (Setting Name)                       │
├────────────┬─────────────────────────────────────┤
│            │                                     │
│  Side Nav  │  ┌─ Save Bar ─────────────────────┐ │
│  (220px)   │  │ [Save] [Discard]               │ │
│            │  └────────────────────────────────┘ │
│  Overview  │                                     │
│  Activity  │  ┌─ Section 1 ─────────────────────┐│
│  Settings ▾│  │ Label: [Input            ]      ││
│  > Config  │  │ Label: [Dropdown         ]      ││
│  > Network │  │ Description text...             ││
│  > Props   │  └─────────────────────────────────┘│
│  > Locks   │                                     │
│  Monitor ▸ │  ┌─ Section 2 ─────────────────────┐│
│            │  │ ☐ Enable feature                ││
│            │  │ Label: [Input            ]      ││
│            │  │ Label: [Input            ]      ││
│            │  └─────────────────────────────────┘│
│            │                                     │
└────────────┴─────────────────────────────────────┘
```

## Template Definition

```typescript
import { tokens } from '@fluentui/react-components';

export const azureSettingsPage = {
  name: 'azure-settings-page',
  description: 'Settings/configuration page within a resource blade. Side nav + stacked form sections in the content area. Includes a save/discard bar at the top of the content.',
  type: 'flex' as const,
  responsive: false,

  // Inherits the azure-resource-blade outer structure
  // This template defines only the content-area layout
  parentTemplate: 'azure-resource-blade',

  layout: {
    // Content area layout (inside the resource blade's content slot)
    contentArea: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    },
    saveBar: {
      display: 'flex',
      gap: tokens.spacingHorizontalS,
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
      borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
      backgroundColor: tokens.colorNeutralBackground2,
    },
    scrollContent: {
      flex: 1,
      overflowY: 'auto',
      padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXXL}`,
    },
    section: {
      marginBottom: tokens.spacingVerticalXXL,
      maxWidth: '600px',
    },
    sectionTitle: {
      marginBottom: tokens.spacingVerticalM,
      paddingBottom: tokens.spacingVerticalS,
      borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    },
    formRow: {
      marginBottom: tokens.spacingVerticalM,
    },
    helpText: {
      marginTop: tokens.spacingVerticalXXS,
      color: tokens.colorNeutralForeground3,
    },
  },

  slots: {
    saveBar: { minHeight: '44px', optional: true },
    scrollContent: { flex: '1', overflow: 'auto' },
    section: { maxWidth: '600px', marginBottom: '24px' },
  },
};
```

## Usage in makeStyles

```tsx
const useStyles = makeStyles({
  // Inherits resource blade styles for outer structure
  // These are for the content area inside the blade:
  contentArea: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  saveBar: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  scrollContent: {
    flex: 1,
    overflowY: 'auto',
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXXL}`,
  },
  section: { marginBottom: tokens.spacingVerticalXXL, maxWidth: '600px' },
  sectionTitle: {
    marginBottom: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalS,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  formRow: { marginBottom: tokens.spacingVerticalM },
  helpText: { marginTop: tokens.spacingVerticalXXS, color: tokens.colorNeutralForeground3 },
});
```

## Settings Form Pattern

```tsx
import { Field, Input, Dropdown, Checkbox, Switch, Button, Divider, Subtitle2, Body1, Caption1 } from '@fluentui/react-components';

// Save bar
<div className={styles.saveBar}>
  <Button appearance="primary" size="small">Save</Button>
  <Button appearance="outline" size="small">Discard</Button>
</div>

// Form sections
<div className={styles.scrollContent}>
  <div className={styles.section}>
    <Subtitle2 className={styles.sectionTitle}>General settings</Subtitle2>
    <div className={styles.formRow}>
      <Field label="Resource name">
        <Input value="my-resource" />
      </Field>
    </div>
    <div className={styles.formRow}>
      <Field label="Platform">
        <Dropdown placeholder="Select a platform">
          <Option>Linux</Option>
          <Option>Windows</Option>
        </Dropdown>
      </Field>
    </div>
  </div>

  <div className={styles.section}>
    <Subtitle2 className={styles.sectionTitle}>Advanced</Subtitle2>
    <div className={styles.formRow}>
      <Switch label="Enable diagnostics" />
    </div>
    <Caption1 className={styles.helpText}>
      Collecting diagnostic data helps us improve the service.
    </Caption1>
  </div>
</div>
```

## When to Use

- Configuration / Settings sub-pages within a resource
- Properties page
- Networking settings
- Access control / IAM settings
- Locks, Tags, Export template pages
- Any form-heavy page within a resource blade

## When NOT to Use

- Resource overview (overview has KPI + essentials, not forms) → customize `azure-resource-blade` content
- Create flows → use `azure-create-wizard` (separate from resource context)
- Browse/list pages → use `azure-browse-page`
