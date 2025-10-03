import React, { useState, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  getExpandedRowModel,
} from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  Trash2,
  EyeOff,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/utils';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchPlaceholder?: string;
  onSelectionChange?: (selectedRows: TData[]) => void;
  onExport?: (selectedRows: TData[]) => void;
  onDelete?: (selectedRows: TData[]) => void;
  enableSearch?: boolean;
  enableFilters?: boolean;
  enableSelection?: boolean;
  enableExport?: boolean;
  enableColumnVisibility?: boolean;
  pageSize?: number;
}

export function DataTable<TData>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  onSelectionChange,
  onExport,
  onDelete,
  enableSearch = true,
  enableFilters = true,
  enableSelection = false,
  enableExport = false,
  enableColumnVisibility = true,
  pageSize = 10,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [expanded, setExpanded] = useState({}); // ✅ accordion expansion state

  // Add selection column if enabled
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

  // Expand column
  const expandColumn: ColumnDef<TData> = {
    id: 'expander',
    header: () => null,
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <button
          onClick={() => {
            setExpanded((prev) => {
              if (row.getIsExpanded()) return {}; // collapse if already open
              return { [row.id]: true }; // open only this row
            });
          }}
          className="p-1 text-muted-foreground hover:text-foreground"
        >
          {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRightIcon size={16} />}
        </button>
      ) : null,
    enableSorting: false,
    enableHiding: false,
  };

  const tableColumns = useMemo(() => {
    let cols = columns;
    if (enableSelection) {
      cols = [selectionColumn, ...cols];
    }
    return [expandColumn, ...cols]; // ✅ prepend expander
  }, [columns, enableSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      expanded,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const paginationInfo = useMemo(() => {
    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    const totalRows = table.getFilteredRowModel().rows.length;

    const start = pageIndex * pageSize + 1;
    const end = Math.min((pageIndex + 1) * pageSize, totalRows);

    return `${start} – ${end} of ${totalRows}`;
  }, [
    table.getState().pagination.pageIndex,
    table.getState().pagination.pageSize,
    table.getFilteredRowModel().rows.length,
  ]);

  // Handle selection change
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);

  const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Global Search */}
          {enableSearch && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-8 max-w-sm"
              />
            </div>
          )}

          {/* Column Filters */}
          {enableFilters && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanFilter())
                  .map((column) => (
                    <div key={column.id} className="p-2">
                      <Input
                        placeholder={`Filter ${column.id}...`}
                        value={(column.getFilterValue() as string) ?? ''}
                        onChange={(event) => column.setFilterValue(event.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Column Visibility */}
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <EyeOff className="mr-2 h-4 w-4" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export */}
          {enableExport && selectedRows.length > 0 && onExport && (
            <Button variant="outline" size="sm" onClick={() => onExport(selectedRows)}>
              <Download className="mr-2 h-4 w-4" />
              Export ({selectedRows.length})
            </Button>
          )}

          {/* Delete */}
          {enableSelection && selectedRows.length > 0 && onDelete && (
            <Button variant="destructive" size="sm" onClick={() => onDelete(selectedRows)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedRows.length})
            </Button>
          )}
        </div>
      </div>

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
                <React.Fragment key={row.id}>
                  <tr
                    className={cn(
                      'border-b transition-colors hover:bg-muted/50',
                      row.getIsSelected() && 'bg-muted'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>

                  {/* ✅ Expanded Row */}
                  {row.getIsExpanded() && (
                    <tr className="bg-muted/30">
                      <td colSpan={row.getVisibleCells().length} className="p-4">
                        <div className="text-sm text-muted-foreground">
                          Extra details for <strong>{row.id}</strong>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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
      <div className="flex items-center">
        <div className="text-sm text-muted-foreground">
          {enableSelection && (
            <span>
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </span>
          )}
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8 justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Items per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            {paginationInfo}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
