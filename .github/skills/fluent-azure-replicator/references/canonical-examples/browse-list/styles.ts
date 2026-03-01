import { makeStyles, tokens } from '@fluentui/react-components';

export const useStyles = makeStyles({
  root: {
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
    borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
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
  filterGroup: {
    marginBottom: tokens.spacingVerticalL,
  },
  filterGroupTitle: {
    marginBottom: tokens.spacingVerticalS,
  },
  filterOption: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalXS,
  },
  dataGridWrapper: {
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
  statusRunning: { color: tokens.colorStatusSuccessForeground1 },
  statusStopped: { color: tokens.colorNeutralForeground3 },
  statusDeallocated: { color: tokens.colorStatusWarningForeground1 },
  statusCreating: { color: tokens.colorBrandForeground1 },
  resourceLink: {
    color: tokens.colorBrandForegroundLink,
    cursor: 'pointer',
    ':hover': {
      color: tokens.colorBrandForegroundLinkHover,
      textDecorationLine: 'underline',
    },
  },
});
