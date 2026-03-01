# Grid Template: Azure Create Wizard

The standard layout for Azure resource creation flows (e.g., Create VM, Create Storage Account, Create Web App). Full-width vertical stepper on the left with form content on the right, action buttons at the bottom.

## Structure

```
┌──────────────────────────────────────────────────┐
│ Breadcrumb                                       │
├──────────────────────────────────────────────────┤
│ Page Header (Create [Resource Type])             │
├──────────────┬───────────────────────────────────┤
│              │                                   │
│  Step Nav    │   Form Content                    │
│  (vertical   │                                   │
│   TabList)   │   ┌─ Project details ──────────┐  │
│              │   │ Subscription: [dropdown  ]  │  │
│  ● Basics    │   │ Resource group: [dropdown]  │  │
│  ○ Network   │   └────────────────────────────┘  │
│  ○ Mgmt      │                                   │
│  ○ Tags      │   ┌─ Instance details ─────────┐  │
│  ○ Review    │   │ Name: [input             ]  │  │
│              │   │ Region: [dropdown        ]  │  │
│              │   │ Size: [dropdown           ]  │  │
│              │   └────────────────────────────┘  │
│              │                                   │
├──────────────┴───────────────────────────────────┤
│           [Previous]  [Next]  [Review + create]  │
└──────────────────────────────────────────────────┘
```

## Template Definition

```typescript
import { tokens } from '@fluentui/react-components';

export const azureCreateWizard = {
  name: 'azure-create-wizard',
  description: 'Resource creation flow with vertical step navigation and form panels. No side drawer nav — step tabs are the primary navigation.',
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
      borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    },
    body: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
    },
    stepNav: {
      width: '200px',
      minWidth: '200px',
      borderRight: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
      padding: `${tokens.spacingVerticalM} 0`,
    },
    formContent: {
      flex: 1,
      overflowY: 'auto',
      padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXXL}`,
    },
    formSection: {
      marginBottom: tokens.spacingVerticalXL,
    },
    formSectionTitle: {
      marginBottom: tokens.spacingVerticalM,
      paddingBottom: tokens.spacingVerticalS,
      borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    },
    formRow: {
      marginBottom: tokens.spacingVerticalM,
      maxWidth: '480px',
    },
    footer: {
      display: 'flex',
      gap: tokens.spacingHorizontalS,
      borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
      padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    },
  },

  slots: {
    breadcrumb: { minHeight: '32px' },
    header: { minHeight: '48px' },
    stepNav: { width: '200px', minWidth: '200px' },
    formContent: { flex: '1', overflow: 'auto', padding: '16px 24px' },
    footer: { minHeight: '52px' },
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
  stepNav: {
    width: '200px',
    minWidth: '200px',
    borderRight: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalM} 0`,
  },
  formContent: {
    flex: 1,
    overflowY: 'auto',
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXXL}`,
  },
  formSection: { marginBottom: tokens.spacingVerticalXL },
  formSectionTitle: {
    marginBottom: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalS,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  formRow: { marginBottom: tokens.spacingVerticalM, maxWidth: '480px' },
  footer: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
  },
});
```

## Step Navigation Pattern

Use `TabList` with `vertical` prop for the step nav:

```tsx
<TabList vertical selectedValue={currentStep} onTabSelect={(_, d) => setStep(d.value)}>
  <Tab value="basics">Basics</Tab>
  <Tab value="networking">Networking</Tab>
  <Tab value="management">Management</Tab>
  <Tab value="tags">Tags</Tab>
  <Tab value="review">Review + create</Tab>
</TabList>
```

## When to Use

- Any Azure resource creation flow
- Multi-step forms with horizontal step progression
- Configuration wizards

## When NOT to Use

- Resource detail/overview → use `azure-resource-blade`
- Browse/list pages → use `azure-browse-page`
- Single-page settings → use `azure-settings-page`
