export interface ResourceEssential {
  label: string;
  value: string;
}

export interface NavItem {
  label: string;
  value: string;
  icon?: string;
}

export interface CommandAction {
  label: string;
  icon: string;
  primary?: boolean;
}

export const breadcrumbItems = ['Home', 'Virtual machines', 'vm-prod-west-01'];

export const navItems: NavItem[] = [
  { label: 'Overview', value: 'overview' },
  { label: 'Activity log', value: 'activity' },
  { label: 'Access control (IAM)', value: 'iam' },
  { label: 'Tags', value: 'tags' },
  { label: 'Diagnose and solve problems', value: 'diagnose' },
  { label: 'Settings', value: 'settings' },
  { label: 'Networking', value: 'networking' },
  { label: 'Disks', value: 'disks' },
  { label: 'Size', value: 'size' },
  { label: 'Security', value: 'security' },
  { label: 'Monitoring', value: 'monitoring' },
  { label: 'Metrics', value: 'metrics' },
  { label: 'Alerts', value: 'alerts' },
];

export const commandActions: CommandAction[] = [
  { label: 'Connect', icon: 'PlugConnected', primary: true },
  { label: 'Start', icon: 'Play' },
  { label: 'Restart', icon: 'ArrowClockwise' },
  { label: 'Stop', icon: 'Stop' },
  { label: 'Delete', icon: 'Delete' },
];

export const essentialsLeft: ResourceEssential[] = [
  { label: 'Resource group', value: 'rg-production-west' },
  { label: 'Status', value: 'Running' },
  { label: 'Location', value: 'West US 2' },
  { label: 'Subscription', value: 'Production (xxxxxxxx-xxxx)' },
  { label: 'Subscription ID', value: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
];

export const essentialsRight: ResourceEssential[] = [
  { label: 'Computer name', value: 'vm-prod-west-01' },
  { label: 'Operating system', value: 'Linux (Ubuntu 22.04)' },
  { label: 'Size', value: 'Standard_D4s_v3' },
  { label: 'Public IP address', value: '40.78.100.10' },
  { label: 'Virtual network/subnet', value: 'vnet-prod/default' },
];
