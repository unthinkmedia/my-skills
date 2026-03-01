import { makeStyles, tokens } from '@fluentui/react-components';

export const useStyles = makeStyles({
  root: {
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
  sectionTitle: {
    marginBottom: tokens.spacingVerticalM,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: tokens.spacingHorizontalL,
    marginBottom: tokens.spacingVerticalXL,
  },
  kpiCard: {
    padding: tokens.spacingVerticalL,
  },
  kpiValue: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightHero700,
    color: tokens.colorNeutralForeground1,
  },
  cardWide: {
    gridColumn: 'span 2',
  },
  cardFull: {
    gridColumn: '1 / -1',
  },
  recentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${tokens.spacingVerticalS} 0`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  resourceLink: {
    color: tokens.colorBrandForegroundLink,
    cursor: 'pointer',
    ':hover': {
      color: tokens.colorBrandForegroundLinkHover,
      textDecorationLine: 'underline',
    },
  },
});
