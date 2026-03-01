/**
 * Fragment: Status Badge
 *
 * Maps Azure resource status strings to Fluent Badge colors.
 * Use this whenever rendering resource status anywhere (tables, cards, headers).
 */
import { Badge, type BadgeProps } from '@fluentui/react-components';

// --- Status → Color mapping (deterministic, always use this) ---
const statusColorMap: Record<string, BadgeProps['color']> = {
  // Success / active states
  Running: 'success',
  Succeeded: 'success',
  Healthy: 'success',
  Active: 'success',
  Connected: 'success',
  Ready: 'success',
  Completed: 'success',

  // Warning states
  Degraded: 'warning',
  Warning: 'warning',
  Deallocated: 'warning',
  Updating: 'warning',
  Provisioning: 'warning',

  // Error / danger states
  Failed: 'danger',
  Error: 'danger',
  Unhealthy: 'danger',
  Disconnected: 'danger',

  // Informative / neutral states
  Stopped: 'informative',
  Creating: 'brand',
  Deleting: 'informative',
  Unknown: 'informative',
  Pending: 'informative',
};

// --- Component ---
interface StatusBadgeProps {
  status: string;
  size?: BadgeProps['size'];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'small',
}) => {
  const color = statusColorMap[status] ?? 'informative';
  return (
    <Badge appearance="filled" color={color} size={size}>
      {status}
    </Badge>
  );
};
