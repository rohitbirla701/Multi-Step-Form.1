import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/utils';
import { Pagination } from '@/components/common/Pagination';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  setPageIndex: (updater: (prev: number) => number) => void;
  setPageSize: (updater: (prev: number) => number) => void;
  isFetching: boolean;
}

export function DataTable<TData>({
  data,
  columns,
  totalItems = 0,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  isFetching,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalItems / pageSize), // Calculate page count from totalItems
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true, // Tell react-table to not manage pagination
    manualSorting: true, // Also set sorting to manual as it will be server-side
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const onNextPage = () => {
    if (pageIndex < table.getPageCount() - 1) {
      setPageIndex((prev) => prev + 1);
    }
  };

  const onPreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
    }
  };

  const handleSetPageSize = (newSize: number) => {
    setPageSize(() => newSize);
    setPageIndex(() => 0); // Reset to first page on size change
  };

  return (
    <div className="space-y-4">
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
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          'flex items-center space-x-2',
                          header.column.getCanSort() && 'cursor-pointer select-none'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getCanSort() && (
                          <div className="ml-2 h-4 w-4">
                            {header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <div className="h-4 w-4" />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="h-24 text-center">
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? (
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
        </table>
      </div>

      <Pagination
        pageSize={pageSize}
        pageIndex={pageIndex}
        pageCount={table.getPageCount()}
        totalItems={totalItems}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        canPreviousPage={pageIndex > 0}
        canNextPage={pageIndex < table.getPageCount() - 1}
        setPageSize={handleSetPageSize}
      />
    </div>
  );
}