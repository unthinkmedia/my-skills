export interface KpiMetric {
  title: string;
  value: string;
  subtitle: string;
  trend?: 'up' | 'down' | 'flat';
}

export interface RecentResource {
  name: string;
  type: string;
  lastAccessed: string;
}

export const kpiMetrics: KpiMetric[] = [
  { title: 'Total resources', value: '142', subtitle: 'Across 3 subscriptions', trend: 'up' },
  { title: 'Running VMs', value: '23', subtitle: '4 stopped', trend: 'flat' },
  { title: 'Active alerts', value: '7', subtitle: '2 critical', trend: 'down' },
  { title: 'Cost this month', value: '$12,450', subtitle: '↑ 8% from last month', trend: 'up' },
];

export const recentResources: RecentResource[] = [
  { name: 'vm-prod-west-01', type: 'Virtual machine', lastAccessed: '5 min ago' },
  { name: 'storage-prod-01', type: 'Storage account', lastAccessed: '12 min ago' },
  { name: 'app-api-prod', type: 'App Service', lastAccessed: '1 hour ago' },
  { name: 'sql-prod-west', type: 'SQL database', lastAccessed: '2 hours ago' },
  { name: 'kv-prod-west', type: 'Key vault', lastAccessed: '3 hours ago' },
];

export const quickActions = [
  { label: 'Create a resource', icon: 'Add' },
  { label: 'Manage Azure Active Directory', icon: 'People' },
  { label: 'View costs', icon: 'Money' },
  { label: 'Go to Advisor', icon: 'Lightbulb' },
];
