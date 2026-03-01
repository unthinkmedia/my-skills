/**
 * Fragment: Save Bar
 *
 * Sticky save/discard action bar for settings and configuration pages.
 * Sits at the top of the content area in a resource blade settings page.
 */
import React from 'react';
import {
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

// --- Styles ---
const useStyles = makeStyles({
  saveBar: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

// --- Component ---
interface SaveBarProps {
  onSave?: () => void;
  onDiscard?: () => void;
  saveDisabled?: boolean;
  saveLabel?: string;
  discardLabel?: string;
}

export const SaveBar: React.FC<SaveBarProps> = ({
  onSave,
  onDiscard,
  saveDisabled = false,
  saveLabel = 'Save',
  discardLabel = 'Discard',
}) => {
  const styles = useStyles();
  return (
    <div className={styles.saveBar}>
      <Button
        appearance="primary"
        size="small"
        disabled={saveDisabled}
        onClick={onSave}
        aria-label={saveLabel}
      >
        {saveLabel}
      </Button>
      <Button
        appearance="outline"
        size="small"
        onClick={onDiscard}
        aria-label={discardLabel}
      >
        {discardLabel}
      </Button>
    </div>
  );
};
