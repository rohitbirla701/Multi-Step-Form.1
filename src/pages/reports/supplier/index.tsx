'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import MultiSelect from '@/components/common/MultiSelect';
import DateTimeRangePicker from '@/components/common/DateTimeRangePicker';
import { DataTable } from './components/DataTable/DataTable';
import { useGetSubProviderQuery } from '@/store/api/ProviderApi';
import { SupplierReport, useLazyGetSupplierReportQuery } from '@/store/api/ReportApi';
import { Pagination } from '@/components/common/Pagination';
import dayjs from 'dayjs';

// ---------- Utility: Format numbers ----------
const formatNumber = (value: number, decimals: number = 2) => {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

const SupplierReportPage = () => {
  const [selectedProvider, setSelectedProvider] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const currencies = ['INR', 'USD', 'PTS'];

  const { data: subProviderData } = useGetSubProviderQuery({});
  const subProviderList = subProviderData?.map((item) => item.subProvider) ?? [];

  const [triggerGetReport, { data: supplierReportData }] = useLazyGetSupplierReportQuery();

  // Fetch data whenever pageIndex or pageSize changes
  useEffect(() => {
    triggerGetReport({ skip: pageIndex * pageSize, take: pageSize, supplier: selectedProvider });
  }, [triggerGetReport, pageIndex, pageSize]);

  const tableData: SupplierReport[] = useMemo(() => {
    if (!supplierReportData?.data) return [];
    return supplierReportData.data.map((row) => ({
      ...row,
      subRows: [
        {
          ...row,
          supplier: 'PTS',
        },
      ],
    }));
  }, [supplierReportData]);

  const totalItems = supplierReportData?.total ?? 0;
  const pageCount = Math.ceil(totalItems / pageSize);

  // ---------- Table Columns ----------
  const columns: ColumnDef<SupplierReport>[] = useMemo(
    () => [
      {
        accessorKey: 'supplier',
        header: () => <div className="text-sm font-bold text-foreground">Supplier</div>,
        cell: ({ row }) => {
          const supplier = row.getValue<string>('supplier');
          return <div className={row.depth > 0 ? 'pl-8 text-sm' : 'text-sm'}>{supplier}</div>;
        },
        footer: () => <div className="font-bold">Total</div>,
      },
      {
        accessorKey: 'turnover_points',
        header: () => <div className="text-sm font-bold text-foreground">Turnover Points</div>,
        cell: ({ row }) => (
          <div className="text-sm">{formatNumber(Number(row.getValue('turnover_points')), 0)}</div>
        ),
        footer: () => {
          const total =
            supplierReportData?.data?.reduce(
              (sum, row) => sum + Number(row.turnover_points ?? 0),
              0
            ) ?? 0;
          return <div className="font-bold">{formatNumber(total, 0)}</div>;
        },
      },
      {
        accessorKey: 'ggr_points',
        header: () => <div className="text-sm font-bold text-foreground">GGR Points</div>,
        cell: ({ row }) => (
          <div className="text-sm">{formatNumber(Number(row.getValue('ggr_points')), 2)}</div>
        ),
        footer: () => {
          const total =
            supplierReportData?.data?.reduce((sum, row) => sum + Number(row.ggr_points ?? 0), 0) ??
            0;
          return <div className="font-bold">{formatNumber(total, 2)}</div>;
        },
      },
      {
        accessorKey: 'average_bet',
        header: () => <div className="text-sm font-bold text-foreground">Average Bet</div>,
        cell: ({ row }) => (
          <div className="text-sm">{formatNumber(Number(row.getValue('average_bet')), 2)}</div>
        ),
        footer: () => {
          const avg =
            (supplierReportData?.data?.reduce(
              (sum, row) => sum + Number(row.average_bet ?? 0),
              0
            ) ?? 0) / (supplierReportData?.data?.length ?? 1);
          return <div className="font-bold">{formatNumber(avg, 2)}</div>;
        },
      },
      {
        accessorKey: 'bet_count',
        header: () => <div className="text-sm font-bold text-foreground">Bet Count</div>,
        cell: ({ row }) => (
          <div className="text-sm">{formatNumber(Number(row.getValue('bet_count')), 0)}</div>
        ),
        footer: () => {
          const total =
            supplierReportData?.data?.reduce((sum, row) => sum + Number(row.bet_count ?? 0), 0) ??
            0;
          return <div className="font-bold">{formatNumber(total, 0)}</div>;
        },
      },
      {
        accessorKey: 'active_users',
        header: () => <div className="text-sm font-bold text-foreground">Active Users</div>,
        cell: ({ row }) => (
          <div className="text-sm">{formatNumber(Number(row.getValue('active_users')), 0)}</div>
        ),
        footer: () => {
          const total =
            supplierReportData?.data?.reduce(
              (sum, row) => sum + Number(row.active_users ?? 0),
              0
            ) ?? 0;
          return <div className="font-bold">{formatNumber(total, 0)}</div>;
        },
      },
      {
        accessorKey: 'margin_percent',
        header: () => <div className="text-sm font-bold text-foreground">Margin %</div>,
        cell: ({ row }) => {
          const value = Number(row.getValue('margin_percent'));
          const color = value >= 0 ? 'text-green-600' : 'text-red-600';
          return <div className={`${color} text-sm`}>{formatNumber(value, 2)}</div>;
        },
        footer: () => {
          const avg =
            (supplierReportData?.data?.reduce(
              (sum, row) => sum + Number(row.margin_percent ?? 0),
              0
            ) ?? 0) / (supplierReportData?.data?.length ?? 1);
          const color = avg >= 0 ? 'text-green-600' : 'text-red-600';
          return <div className={`font-bold ${color}`}>{formatNumber(avg, 2)}</div>;
        },
      },
    ],
    [supplierReportData]
  );

  const [range, setRange] = useState({
    startDate: (dayjs().subtract(7, 'day').toDate().toISOString() as string) || null,
    endDate: (dayjs().toDate().toISOString() as string) || null,
  });
  const applyFilters = () => {
    triggerGetReport({
      skip: pageIndex * pageSize,
      take: pageSize,
      supplier: selectedProvider,
      currency: selectedCurrency,
      startDate: range?.startDate || undefined,
      endDate: range?.endDate || undefined,
    });
    setPageIndex(0);
  };

  // Updated state for date range, storing ISO strings directly

  const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
    setRange({ startDate, endDate });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Report</h1>
        <div className="flex gap-4 flex-wrap items-end">
          <DateTimeRangePicker onDateRangeChange={handleDateRangeChange} />
          <div>
            <div>Supplier</div>
            <MultiSelect
              options={subProviderList}
              placeholder="Supplier"
              onChange={(values) => setSelectedProvider(values)}
            />
          </div>
          <div>
            <div>Currency</div>
            <MultiSelect
              options={currencies}
              placeholder="All"
              onChange={(values) => setSelectedCurrency(values)}
            />
          </div>
          <Button onClick={applyFilters} className="bg-primary text-white">
            Apply
          </Button>
          <Button className="bg-exportBtn text-white">Export</Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable data={tableData ?? []} columns={columns} />

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

export default SupplierReportPage;
