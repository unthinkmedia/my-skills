/**
 * Fragment: Data Table
 *
 * Azure-style DataGrid with sortable columns, multiselect, and custom cell rendering.
 * Define your columns and items, then use this pattern.
 */
import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components';

// --- Styles ---
const useStyles = makeStyles({
  dataGrid: {
    flex: 1,
    overflow: 'auto',
  },
});

// --- Pattern ---
// 1. Define your row type:
//    interface MyRow { name: string; status: string; ... }

// 2. Define columns using createTableColumn:
//    const columns: TableColumnDefinition<MyRow>[] = [
//      createTableColumn({
//        columnId: 'name',
//        renderHeaderCell: () => 'Name',
//        renderCell: (item) => item.name,
//      }),
//      createTableColumn({
//        columnId: 'status',
//        renderHeaderCell: () => 'Status',
//        renderCell: (item) => item.status,
//        compare: (a, b) => a.status.localeCompare(b.status),
//      }),
//    ];

// 3. Render:
//    <DataGrid
//      items={data}
//      columns={columns}
//      sortable
//      selectionMode="multiselect"
//      aria-label="Resource list"
//    >
//      <DataGridHeader>
//        <DataGridRow>
//          {({ renderHeaderCell }) => (
//            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
//          )}
//        </DataGridRow>
//      </DataGridHeader>
//      <DataGridBody<MyRow>>
//        {({ item, rowId }) => (
//          <DataGridRow<MyRow> key={rowId}>
//            {({ renderCell, columnId }) => (
//              <DataGridCell>
//                {columnId === 'status'
//                  ? <StatusBadge status={item.status} />
//                  : renderCell(item)}
//              </DataGridCell>
//            )}
//          </DataGridRow>
//        )}
//      </DataGridBody>
//    </DataGrid>
