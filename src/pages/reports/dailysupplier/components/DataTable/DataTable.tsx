// DataTable.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
  RowSelectionState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Pagination } from '@/components/common/Pagination';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  onSelectionChange?: (selectedRows: TData[]) => void;
  onExport?: (selectedRows: TData[]) => void;
  onDelete?: (selectedRows: TData[]) => void;
  enableSelection?: boolean;
  pageSize?: number;
}

export function DataTable<TData extends { subRows?: TData[] }>({
  data,
  columns,
  onSelectionChange,
  onExport,
  onDelete,
  enableSelection = false,
  pageSize = 10,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [searchName, setSearchName] = useState<string>('');
  const [searchId, setSearchId] = useState<string>('');

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
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <button
          onClick={row.getToggleExpandedHandler()}
          className="p-1 text-muted-foreground hover:text-foreground"
          aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
        >
          {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      ) : null,
    enableSorting: false,
    enableHiding: false,
  };

  const tableColumns = useMemo(() => {
    let cols = [...columns];
    if (enableSelection) {
      cols = [selectionColumn, ...cols];
    }
    return [...cols, expandColumn];
  }, [columns, enableSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.subRows,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    state: { sorting, columnVisibility, rowSelection, expanded },
    initialState: { pagination: { pageSize } },
  });

  // Call selection callback
  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map((r) => r.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);

  const totalItems = table.getRowModel().rows.length;

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
