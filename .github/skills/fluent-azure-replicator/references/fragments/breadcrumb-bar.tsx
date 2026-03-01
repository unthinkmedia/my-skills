/**
 * Fragment: Breadcrumb Bar
 *
 * Azure-style breadcrumb navigation. Pass an array of string labels.
 * The last item is rendered as the current page (non-clickable).
 */
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbDivider,
  BreadcrumbButton,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

// --- Styles ---
const useStyles = makeStyles({
  breadcrumb: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
});

// --- Component ---
interface BreadcrumbBarProps {
  items: string[];
  onNavigate?: (index: number) => void;
}

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({ items, onNavigate }) => {
  const styles = useStyles();
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <Breadcrumb>
        {items.map((item, i) => (
          <React.Fragment key={item}>
            {i > 0 && <BreadcrumbDivider />}
            <BreadcrumbItem>
              {i < items.length - 1 ? (
                <BreadcrumbButton onClick={() => onNavigate?.(i)}>
                  {item}
                </BreadcrumbButton>
              ) : (
                item
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </Breadcrumb>
    </nav>
  );
};
