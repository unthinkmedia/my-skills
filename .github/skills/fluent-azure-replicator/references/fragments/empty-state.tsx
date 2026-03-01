/**
 * Fragment: Empty State
 *
 * Full-area empty state with icon, title, description, and optional CTA.
 * Use when a page/section has no data to display.
 */
import React from 'react';
import {
  Body1,
  Subtitle2,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { ReactElement } from 'react';

// --- Styles ---
const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXXL,
    textAlign: 'center',
    gap: tokens.spacingVerticalM,
    minHeight: '300px',
  },
  icon: {
    fontSize: '48px',
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalS,
  },
  description: {
    color: tokens.colorNeutralForeground3,
    maxWidth: '400px',
  },
});

// --- Component ---
interface EmptyStateProps {
  icon: ReactElement;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <Subtitle2>{title}</Subtitle2>
      <Body1 className={styles.description}>{description}</Body1>
      {actionLabel && (
        <Button appearance="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
