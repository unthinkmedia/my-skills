/**
 * Fragment: Command Bar
 *
 * Azure-style Toolbar with primary action, secondary actions, and dividers.
 * Copy into your index.tsx and customize the actions array.
 */
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { ReactElement } from 'react';

// --- Styles ---
const useStyles = makeStyles({
  commandBar: {
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
  },
});

// --- Types ---
interface CommandAction {
  label: string;
  icon: ReactElement;
  primary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  /** Insert a divider BEFORE this action */
  dividerBefore?: boolean;
}

// --- Component ---
interface CommandBarProps {
  actions: CommandAction[];
  ariaLabel?: string;
}

export const CommandBar: React.FC<CommandBarProps> = ({
  actions,
  ariaLabel = 'Actions',
}) => {
  const styles = useStyles();
  return (
    <Toolbar aria-label={ariaLabel} className={styles.commandBar}>
      {actions.map((action) => (
        <>
          {action.dividerBefore && <ToolbarDivider />}
          <ToolbarButton
            key={action.label}
            appearance={action.primary ? 'primary' : undefined}
            icon={action.icon}
            disabled={action.disabled}
            onClick={action.onClick}
            aria-label={action.label}
          >
            {action.label}
          </ToolbarButton>
        </>
      ))}
    </Toolbar>
  );
};
