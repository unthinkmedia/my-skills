import { makeStyles, tokens } from '@fluentui/react-components';

export const useStyles = makeStyles({
  // Root — full-height vertical stack
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },

  // Breadcrumb bar
  breadcrumb: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },

  // Page header row
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  headerIcon: {
    fontSize: '24px',
    color: tokens.colorBrandForeground1,
  },

  // Body — horizontal split
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },

  // Side navigation
  sidebar: {
    width: '220px',
    minWidth: '220px',
    borderRight: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    overflowY: 'auto',
    padding: `${tokens.spacingVerticalS} 0`,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    cursor: 'pointer',
    color: tokens.colorNeutralForeground1,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  navItemActive: {
    backgroundColor: tokens.colorNeutralBackground1Hover,
    borderLeft: `2px solid ${tokens.colorBrandStroke1}`,
    fontWeight: tokens.fontWeightSemibold,
  },

  // Content area
  contentArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  // Command bar
  commandBar: {
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
  },

  // Scrollable content
  scrollContent: {
    flex: 1,
    overflowY: 'auto',
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXL}`,
  },

  // Essentials grid — two columns
  essentialsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalXL,
    marginBottom: tokens.spacingVerticalXL,
  },
  essentialRow: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: tokens.spacingVerticalM,
  },
  essentialLabel: {
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalXXS,
  },
  essentialValue: {
    color: tokens.colorNeutralForeground1,
  },

  // Status badge
  statusRunning: {
    color: tokens.colorStatusSuccessForeground1,
  },
});
