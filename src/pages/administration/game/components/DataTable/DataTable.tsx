import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/utils';
import { Pagination } from '@/components/common/Pagination';

interface DataTableProps<TData> {
  data: {
    data: TData[];
    total: number;
  };
  columns: ColumnDef<TData>[];
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  setPageSize: (size: number) => void;
}

export function DataTable<TData>({
  data,
  columns,
  pageSize = 10,
  setPageSize,
  currentPage,
  onPageChange,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: data?.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    manualPagination: true,
    pageCount: Math.ceil(data.total / pageSize),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border overflow-x-auto overflow-y-auto max-h-[700px] ">
        <table className="w-full min-w-[800px]">
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
            {table.getRowModel().rows?.length ? (
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
      {/* Pagination */}
      {/* <Pagination
        pageSize={table.getState().pagination.pageSize}
        setPageSize={table.setPageSize}
        pageIndex={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        totalItems={table.getRowModel().rows.length}
        onNextPage={table.nextPage}
        onPreviousPage={table.previousPage}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
      /> */}
      <Pagination
        pageSize={pageSize}
        setPageSize={setPageSize}
        pageIndex={currentPage ?? 0}
        pageCount={Math.ceil(data.total / pageSize)}
        totalItems={data.total}
        onNextPage={() => onPageChange?.((currentPage ?? 0) + 1)}
        onPreviousPage={() => onPageChange?.((currentPage ?? 0) - 1)}
        canPreviousPage={(currentPage ?? 0) > 0}
        canNextPage={(currentPage ?? 0) < Math.ceil(data.total / pageSize) - 1}
      />
    </div>
  );
}
