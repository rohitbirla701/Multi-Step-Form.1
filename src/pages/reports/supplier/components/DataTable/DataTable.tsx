// DataTable.tsx
import React, { useState, useMemo } from 'react';
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
}

export function DataTable<TData extends { subRows?: TData[] }>({
  data,
  columns,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

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
          {row.getIsExpanded() ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      ) : null,
    enableSorting: false,
    enableHiding: false,
  };

  const tableColumns = useMemo(() => [...columns, expandColumn], [columns]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.subRows,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    state: { sorting, expanded },
  });

  return (
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
              <tr key={row.id} className="border-b transition-colors hover:bg-muted/50">
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
  );
}
