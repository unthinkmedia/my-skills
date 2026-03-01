export interface ResourceRow {
  name: string;
  type: string;
  resourceGroup: string;
  location: string;
  status: 'Running' | 'Stopped' | 'Deallocated' | 'Creating';
  subscription: string;
}

export interface FilterOption {
  label: string;
  count: number;
  checked: boolean;
}

export interface FilterGroup {
  title: string;
  options: FilterOption[];
}

export const breadcrumbItems = ['Home', 'Virtual machines'];

export const resources: ResourceRow[] = [
  { name: 'vm-prod-west-01', type: 'Virtual machine', resourceGroup: 'rg-production-west', location: 'West US 2', status: 'Running', subscription: 'Production' },
  { name: 'vm-prod-east-01', type: 'Virtual machine', resourceGroup: 'rg-production-east', location: 'East US', status: 'Running', subscription: 'Production' },
  { name: 'vm-dev-west-01', type: 'Virtual machine', resourceGroup: 'rg-dev', location: 'West US 2', status: 'Stopped', subscription: 'Development' },
  { name: 'vm-staging-01', type: 'Virtual machine', resourceGroup: 'rg-staging', location: 'Central US', status: 'Running', subscription: 'Staging' },
  { name: 'vm-test-east-01', type: 'Virtual machine', resourceGroup: 'rg-test', location: 'East US', status: 'Deallocated', subscription: 'Development' },
  { name: 'vm-prod-west-02', type: 'Virtual machine', resourceGroup: 'rg-production-west', location: 'West US 2', status: 'Running', subscription: 'Production' },
  { name: 'vm-batch-01', type: 'Virtual machine', resourceGroup: 'rg-batch', location: 'South Central US', status: 'Creating', subscription: 'Production' },
  { name: 'vm-dev-east-01', type: 'Virtual machine', resourceGroup: 'rg-dev', location: 'East US', status: 'Stopped', subscription: 'Development' },
];

export const filterGroups: FilterGroup[] = [
  {
    title: 'Status',
    options: [
      { label: 'Running', count: 4, checked: false },
      { label: 'Stopped', count: 2, checked: false },
      { label: 'Deallocated', count: 1, checked: false },
      { label: 'Creating', count: 1, checked: false },
    ],
  },
  {
    title: 'Location',
    options: [
      { label: 'West US 2', count: 3, checked: false },
      { label: 'East US', count: 3, checked: false },
      { label: 'Central US', count: 1, checked: false },
      { label: 'South Central US', count: 1, checked: false },
    ],
  },
  {
    title: 'Subscription',
    options: [
      { label: 'Production', count: 4, checked: false },
      { label: 'Development', count: 3, checked: false },
      { label: 'Staging', count: 1, checked: false },
    ],
  },
];

export const columns = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'resourceGroup', label: 'Resource group' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status' },
  { key: 'subscription', label: 'Subscription' },
];
