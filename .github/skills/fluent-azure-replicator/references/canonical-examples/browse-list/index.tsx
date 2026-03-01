import React, { useState } from 'react';
import {
  FluentProvider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbDivider,
  Subtitle1,
  Body1,
  Caption1,
  Subtitle2,
  Checkbox,
  Badge,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  createTableColumn,
  type TableColumnDefinition,
} from '@fluentui/react-components';
import { azureLightTheme, azureDarkTheme } from '../resource-blade/theme';
import { useStyles } from './styles';
import {
  breadcrumbItems,
  resources,
  filterGroups,
  type ResourceRow,
} from './data';
import { CreateIcon, DeleteIcon, RefreshIcon, FilterIcon, ExportIcon, ColumnsIcon } from './icons';

const statusColorMap: Record<string, string> = {
  Running: 'success',
  Stopped: 'informative',
  Deallocated: 'warning',
  Creating: 'brand',
} as const;

const columns: TableColumnDefinition<ResourceRow>[] = [
  createTableColumn({ columnId: 'name', renderHeaderCell: () => 'Name', renderCell: (item) => item.name }),
  createTableColumn({ columnId: 'type', renderHeaderCell: () => 'Type', renderCell: (item) => item.type }),
  createTableColumn({ columnId: 'resourceGroup', renderHeaderCell: () => 'Resource group', renderCell: (item) => item.resourceGroup }),
  createTableColumn({ columnId: 'location', renderHeaderCell: () => 'Location', renderCell: (item) => item.location }),
  createTableColumn({ columnId: 'status', renderHeaderCell: () => 'Status', renderCell: (item) => item.status }),
  createTableColumn({ columnId: 'subscription', renderHeaderCell: () => 'Subscription', renderCell: (item) => item.subscription }),
];

interface BrowseListProps {
  darkMode?: boolean;
}

export const BrowseList: React.FC<BrowseListProps> = ({ darkMode = false }) => {
  const styles = useStyles();
  const [showFilters, setShowFilters] = useState(true);

  return (
    <FluentProvider theme={darkMode ? azureDarkTheme : azureLightTheme}>
      <div className={styles.root}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Breadcrumb>
            {breadcrumbItems.map((item, i) => (
              <React.Fragment key={item}>
                {i > 0 && <BreadcrumbDivider />}
                <BreadcrumbItem>{item}</BreadcrumbItem>
              </React.Fragment>
            ))}
          </Breadcrumb>
        </nav>

        {/* Header */}
        <header className={styles.header}>
          <Subtitle1>Virtual machines</Subtitle1>
        </header>

        {/* Command Bar */}
        <Toolbar aria-label="Resource actions" className={styles.commandBar}>
          <ToolbarButton appearance="primary" icon={<CreateIcon />} aria-label="Create">
            Create
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton icon={<DeleteIcon />} aria-label="Delete">
            Delete
          </ToolbarButton>
          <ToolbarButton icon={<RefreshIcon />} aria-label="Refresh">
            Refresh
          </ToolbarButton>
          <ToolbarButton icon={<ExportIcon />} aria-label="Export to CSV">
            Export to CSV
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton
            icon={<FilterIcon />}
            aria-label="Toggle filters"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter
          </ToolbarButton>
          <ToolbarButton icon={<ColumnsIcon />} aria-label="Edit columns">
            Columns
          </ToolbarButton>
        </Toolbar>

        {/* Body: optional filter sidebar + data grid */}
        <div className={styles.body}>
          {showFilters && (
            <aside className={styles.filterSidebar} aria-label="Filters">
              {filterGroups.map((group) => (
                <div key={group.title} className={styles.filterGroup}>
                  <Subtitle2 className={styles.filterGroupTitle}>{group.title}</Subtitle2>
                  {group.options.map((opt) => (
                    <div key={opt.label} className={styles.filterOption}>
                      <Checkbox label={opt.label} />
                      <Caption1>{opt.count}</Caption1>
                    </div>
                  ))}
                </div>
              ))}
            </aside>
          )}

          <div className={styles.dataGridWrapper}>
            <DataGrid
              items={resources}
              columns={columns}
              sortable
              selectionMode="multiselect"
              aria-label="Virtual machines list"
            >
              <DataGridHeader>
                <DataGridRow>
                  {({ renderHeaderCell }) => (
                    <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                  )}
                </DataGridRow>
              </DataGridHeader>
              <DataGridBody<ResourceRow>>
                {({ item, rowId }) => (
                  <DataGridRow<ResourceRow> key={rowId}>
                    {({ renderCell, columnId }) => (
                      <DataGridCell>
                        {columnId === 'name' ? (
                          <Body1 className={styles.resourceLink}>{renderCell(item)}</Body1>
                        ) : columnId === 'status' ? (
                          <Badge
                            appearance="filled"
                            color={statusColorMap[item.status] as any}
                            size="small"
                          >
                            {renderCell(item)}
                          </Badge>
                        ) : (
                          renderCell(item)
                        )}
                      </DataGridCell>
                    )}
                  </DataGridRow>
                )}
              </DataGridBody>
            </DataGrid>
          </div>
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <Caption1>Showing 1–{resources.length} of {resources.length}</Caption1>
        </div>
      </div>
    </FluentProvider>
  );
};

export default BrowseList;
