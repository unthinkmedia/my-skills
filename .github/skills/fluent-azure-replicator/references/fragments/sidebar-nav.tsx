/**
 * Fragment: Sidebar Navigation
 *
 * Collapsible sidebar for resource detail pages (resource-blade, settings-page).
 * Renders a vertical list of nav items with active state highlighting.
 */
import React from 'react';
import {
  Body1,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';

// --- Styles ---
const useStyles = makeStyles({
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
  sectionLabel: {
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL} ${tokens.spacingVerticalXS}`,
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
  },
});

// --- Types ---
interface NavItem {
  label: string;
  value: string;
  /** Optional section header rendered above this item */
  section?: string;
}

interface SidebarNavProps {
  items: NavItem[];
  activeValue: string;
  onSelect: (value: string) => void;
  ariaLabel?: string;
}

// --- Component ---
export const SidebarNav: React.FC<SidebarNavProps> = ({
  items,
  activeValue,
  onSelect,
  ariaLabel = 'Section navigation',
}) => {
  const styles = useStyles();
  let lastSection: string | undefined;

  return (
    <nav className={styles.sidebar} aria-label={ariaLabel}>
      {items.map((item) => {
        const showSection = item.section && item.section !== lastSection;
        if (item.section) lastSection = item.section;
        return (
          <React.Fragment key={item.value}>
            {showSection && (
              <div className={styles.sectionLabel}>{item.section}</div>
            )}
            <div
              role="button"
              tabIndex={0}
              aria-current={activeValue === item.value ? 'page' : undefined}
              className={mergeClasses(
                styles.navItem,
                activeValue === item.value && styles.navItemActive,
              )}
              onClick={() => onSelect(item.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(item.value)}
            >
              <Body1>{item.label}</Body1>
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
};
