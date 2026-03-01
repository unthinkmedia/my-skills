# Grid Template: Azure Dashboard

The standard layout for Azure dashboard / home pages. Full-width grid of cards/tiles that wraps responsively. No side navigation.

## Structure

```
┌──────────────────────────────────────────────────┐
│ Page Header (Dashboard + Edit / New dashboard)   │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ KPI Card │  │ KPI Card │  │ KPI Card │       │
│  │          │  │          │  │          │       │
│  └──────────┘  └──────────┘  └──────────┘       │
│                                                  │
│  ┌──────────────────────┐  ┌──────────────────┐  │
│  │                      │  │                  │  │
│  │  Chart / Graph       │  │  Resource List   │  │
│  │                      │  │                  │  │
│  └──────────────────────┘  └──────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │  Activity Log / Recent Resources         │    │
│  │  (full width)                            │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Template Definition

```typescript
import { tokens } from '@fluentui/react-components';

export const azureDashboard = {
  name: 'azure-dashboard',
  description: 'Dashboard / home page with a responsive grid of cards and tiles. No side navigation.',
  type: 'grid' as const,
  responsive: false,

  layout: {
    outer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
      borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    },
    scrollContent: {
      flex: 1,
      overflowY: 'auto',
      padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: tokens.spacingHorizontalL,
    },
    // Card size variants for dashboard tiles
    cardSmall: {
      // 1×1 grid cell (default)
    },
    cardWide: {
      gridColumn: 'span 2',
    },
    cardFull: {
      gridColumn: '1 / -1',
    },
    cardTall: {
      gridRow: 'span 2',
    },
  },

  slots: {
    header: { minHeight: '48px' },
    grid: { flex: '1', overflow: 'auto' },
  },

  cardSizes: {
    small: { gridSpan: 1, minWidth: '280px', description: 'KPI card, single metric' },
    wide: { gridSpan: 2, minWidth: '560px', description: 'Chart, graph, or list' },
    full: { gridSpan: 'full-row', description: 'Activity log, wide table' },
    tall: { gridRowSpan: 2, description: 'Tall chart or stacked content' },
  },
};
```

## Usage in makeStyles

```tsx
const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  scrollContent: {
    flex: 1,
    overflowY: 'auto',
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: tokens.spacingHorizontalL,
  },
  cardWide: { gridColumn: 'span 2' },
  cardFull: { gridColumn: '1 / -1' },
  cardTall: { gridRow: 'span 2' },
});
```

## Dashboard Card Pattern

```tsx
import { Card, CardHeader, Body1, Body2, Caption1, tokens, makeStyles } from '@fluentui/react-components';

const useCardStyles = makeStyles({
  kpiCard: {
    padding: tokens.spacingVerticalL,
  },
  kpiValue: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase600,
  },
});

const KpiCard = ({ title, value, subtitle }) => {
  const styles = useCardStyles();
  return (
    <Card appearance="outline" className={styles.kpiCard}>
      <Caption1>{title}</Caption1>
      <div className={styles.kpiValue}>{value}</div>
      <Caption1>{subtitle}</Caption1>
    </Card>
  );
};
```

## When to Use

- Azure portal home / dashboard
- Custom dashboards with KPI cards and charts
- Overview pages that aggregate information from multiple resources
- Any page showing a grid of information tiles

## When NOT to Use

- Resource detail pages → use `azure-resource-blade`
- Browse/list pages → use `azure-browse-page`
- Create flows → use `azure-create-wizard`
