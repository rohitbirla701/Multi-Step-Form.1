import React, { useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './components/DataTable/DataTable';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SupplierReport, useLazyGetSupplierReportQuery } from '@/store/api/ReportApi';
import { Pagination } from '@/components/common/Pagination';


// ---------------- Page Component ----------------
const DailySupplierReportPage = () => {

  const params = useParams();
  const date = params.date || 'N/A';
  const [triggerGetReport, { data: supplierReportData }] = useLazyGetSupplierReportQuery();
  const [supplierName, setSupplierName] = useState<string>("")
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    triggerGetReport({
      startDate: date,
      endDate: new Date().toISOString(),
      supplier: supplierName
    })
  }, [supplierName])

  const columns: ColumnDef<SupplierReport>[] = useMemo(
    () => [
      {
        accessorKey: 'supplier',
        header: () => <div className="text-sm font-bold text-foreground">Supplier Name</div>,
        cell: ({ row }) => (
          <div className="text-sm pl-2" style={{ paddingLeft: row.depth * 16 }}>
            {row.getValue<string>('supplier') ?? '-'}
          </div>
        ),
        footer: () => <div className="font-bold">Total</div>,
      },
      {
        accessorKey: 'turnover_points',
        header: () => <div className="text-sm font-bold text-foreground">Turnover Points</div>,
        cell: ({ row }) => {
          const rawValue = row.getValue<any>('turnover_points');
          const value = Number(rawValue);
          return <div className="text-sm">{isNaN(value) ? '-' : value.toFixed(2)}</div>;
        },
        footer: ({ table }) => {
          const total = table
            .getPreFilteredRowModel()
            .rows.reduce((sum, row) => sum + Number(row.original.turnover_points ?? 0), 0);
          return <div className="font-bold">{total.toFixed(2)}</div>;
        },
      },
      {
        accessorKey: 'ggr_points',
        header: () => <div className="text-sm font-bold text-foreground">GGR Points</div>,
        cell: ({ row }) => {
          const value = Number(row.getValue<any>('ggr_points'));
          return <div className="text-sm">{isNaN(value) ? '-' : value.toFixed(2)}</div>;
        },
        footer: ({ table }) => {
          const total = table
            .getPreFilteredRowModel()
            .rows.reduce((sum, row) => sum + Number(row.original.ggr_points ?? 0), 0);
          return <div className="font-bold">{total.toFixed(2)}</div>;
        },
      },
      {
        accessorKey: 'average_bet',
        header: () => <div className="text-sm font-bold text-foreground">Average Bet</div>,
        cell: ({ row }) => {
          const value = Number(row.getValue<any>('average_bet'));
          return <div className="text-sm">{isNaN(value) ? '-' : value.toFixed(2)}</div>;
        },
        footer: ({ table }) => {
          const rows = table.getPreFilteredRowModel().rows;
          const sum = rows.reduce((total, row) => total + Number(row.original.average_bet ?? 0), 0);
          const avg = rows.length > 0 ? sum / rows.length : 0;
          return <div className="font-bold">{avg.toFixed(2)}</div>;
        },
      },
      {
        accessorKey: 'bet_count',
        header: () => <div className="text-sm font-bold text-foreground">Bet Count</div>,
        cell: ({ row }) => {
          const value = Number(row.getValue<any>('bet_count'));
          return <div className="text-sm">{isNaN(value) ? '-' : value}</div>;
        },
        footer: ({ table }) => {
          const total = table
            .getPreFilteredRowModel()
            .rows.reduce((sum, row) => sum + Number(row.original.bet_count ?? 0), 0);
          return <div className="font-bold">{total}</div>;
        },
      },
      {
        accessorKey: 'margin_percent',
        header: () => <div className="text-sm font-bold text-foreground">Margin in %</div>,
        cell: ({ row }) => {
          const value = Number(row.getValue<any>('margin_percent'));
          const color = value >= 0 ? 'text-green-600' : 'text-red-600';
          return <div className={`${color} text-sm`}>{isNaN(value) ? '-' : value.toFixed(2)}</div>;
        },
        footer: ({ table }) => {
          const rows = table.getPreFilteredRowModel().rows;
          const sum = rows.reduce((total, row) => total + Number(row.original.margin_percent ?? 0), 0);
          const avg = rows.length > 0 ? sum / rows.length : 0;
          const color = avg >= 0 ? 'text-green-600' : 'text-red-600';
          return <div className={`font-bold ${color}`}>{avg.toFixed(2)}</div>;
        },
      },
    ],
    []
  );

  const totalItems = supplierReportData?.total ?? 0;
  const pageCount = Math.ceil(totalItems / pageSize);


  const isoDate = date.split('T')[0];

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Daily Report / Suppliers{' '}
          <span className="ml-4 text-2xl text-foreground">Date: {isoDate}</span>
        </h1>
        <div className="relative flex-1 sm:flex-initial">
          <Input
            type="text"
            placeholder="Search Supplier"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            className="pr-10 border-gray-300 w-full"
          />
          {supplierName && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
              onClick={() => setSupplierName('')}
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <DataTable data={supplierReportData?.data ?? []} columns={columns} />

      {/* Pagination */}
      <Pagination
        pageSize={pageSize}
        pageIndex={pageIndex}
        pageCount={pageCount}
        totalItems={totalItems}
        onNextPage={() => setPageIndex((prev) => Math.min(prev + 1, pageCount - 1))}
        onPreviousPage={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
        canPreviousPage={pageIndex > 0}
        canNextPage={pageIndex < pageCount - 1}
        setPageSize={(size: number) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </div>
  );
};

export default DailySupplierReportPage;
