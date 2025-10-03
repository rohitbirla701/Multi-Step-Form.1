// DataTable.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
  RowSelectionState,
  OnChangeFn,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  onSelectionChange?: (selectedRows: TData[]) => void;
  onExport?: (selectedRows: TData[]) => void;
  onDelete?: (selectedRows: TData[]) => void;
  enableSelection?: boolean;
  // Server-side sorting props
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  manualSorting?: boolean;
}

export function DataTable<TData extends { subRows?: TData[] }>({
  data,
  columns,
  onSelectionChange,
  onExport,
  onDelete,
  enableSelection = false,
  sorting: externalSorting = [],
  onSortingChange: externalOnSortingChange,
  manualSorting = false,
}: DataTableProps<TData>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // Use external sorting if provided, otherwise use internal
  const sorting = manualSorting ? externalSorting : internalSorting;
  const setSorting: OnChangeFn<SortingState> = manualSorting
    ? externalOnSortingChange || (() => {})
    : setInternalSorting;

  // Selection Column
  const selectionColumn: ColumnDef<TData> = {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  // Expand Column
  const expandColumn: ColumnDef<TData> = {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => (
      <button
        onClick={row.getToggleExpandedHandler()}
        className="p-1 text-muted-foreground hover:text-foreground"
        aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
      >
        {row.getIsExpanded() ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
    ),
    enableSorting: false,
    enableHiding: false,
  };

  // Update column headers to show sorting indicators
  const enhancedColumns = useMemo(() => {
    return columns.map((column) => {
      const originalHeader = column.header;

      return {
        ...column,
        header: (headerContext: any) => {
          const canSort = headerContext.column.getCanSort();
          const sortDirection = headerContext.column.getIsSorted();

          const headerContent =
            typeof originalHeader === 'function' ? originalHeader(headerContext) : originalHeader;

          if (!canSort) {
            return headerContent;
          }

          return (
            <button
              className="flex items-center gap-2 hover:bg-muted/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
              onClick={headerContext.column.getToggleSortingHandler()}
            >
              {headerContent}
              {sortDirection === 'asc' && <ArrowUp size={14} />}
              {sortDirection === 'desc' && <ArrowDown size={14} />}
              {!sortDirection && <ArrowUpDown size={14} className="opacity-50" />}
            </button>
          );
        },
      } as ColumnDef<TData>;
    });
  }, [columns]);

  const tableColumns = useMemo(() => {
    let cols = [...enhancedColumns];
    if (enableSelection) {
      cols = [selectionColumn, ...cols];
    }
    return [...cols, expandColumn];
  }, [enhancedColumns, enableSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.subRows,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    manualSorting: manualSorting,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      expanded,
    },
  });

  // Call selection callback
  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map((r) => r.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border overflow-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b transition-colors hover:bg-muted/50 ${
                    row.getIsSelected() ? 'bg-muted' : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={table.getAllColumns().length} className="h-24 text-center">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id} className="border-t bg-muted/50 font-semibold">
                {footerGroup.headers.map((header) => (
                  <td key={header.id} className="p-4 align-middle">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.footer, header.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </div>
  );
}