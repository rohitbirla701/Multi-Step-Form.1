'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import MultiSelect from '@/components/common/MultiSelect';
import DateTimeRangePicker from '@/components/common/DateTimeRangePicker';
import { DataTable } from './components/DataTable/DataTable';
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DailyReport, useLazyGetDailyReportQuery } from '@/store/api/ReportApi';
import { useGetCasinoProvidersQuery, useGetSubProvidersByNameQuery } from '@/store/api/ProviderApi';
import { Pagination } from '@/components/common/Pagination';
import dayjs from 'dayjs';

// ---------------- Page Component ----------------
const DailyReportPage = () => {
  const [selectedProvider, setSelectedProvider] = useState<string[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCurrency] = useState<string[]>([]);
  const { data: providerData } = useGetCasinoProvidersQuery();
  const providerList = providerData?.map((item) => item.provider) ?? [];

  const { data: subProviderData } = useGetSubProvidersByNameQuery(selectedProvider[0] ?? '');
  const subProviderList = subProviderData?.map((item) => item.subProvider) ?? [];

  const [range, setRange] = useState({
    startDate: (dayjs().subtract(7, 'day').toDate().toISOString() as string) || null,
    endDate: (dayjs().toDate().toISOString() as string) || null,
  });

  const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
    setRange({ startDate, endDate });
  };
  const [triggerGetReport, { data: dailyReportData }] = useLazyGetDailyReportQuery();

  const tableData: DailyReport[] = useMemo(() => {
    if (!dailyReportData?.data) return [];
    return dailyReportData.data.map((row) => ({
      ...row,
      subRows: [
        {
          ...row,
          reportDate: 'PTS',
        },
      ],
    }));
  }, [dailyReportData]);

  const totalItems = dailyReportData?.pagination?.totalCount ?? 0;
  const pageCount = Math.ceil(totalItems / pageSize);

  const applyFilters = () => {
    triggerGetReport({
      skip: pageIndex * pageSize,
      take: pageSize,
      startDate: range?.startDate || undefined,
      endDate: range?.endDate || undefined,
      provider: selectedProvider,
      supplier: selectedSupplier,
    });
    setPageIndex(0);
  };

  useEffect(() => {
    triggerGetReport({
      skip: pageIndex * pageSize,
      take: pageSize,
      startDate: range?.startDate || undefined,
      endDate: range?.endDate || undefined,
      provider: selectedProvider,
      supplier: selectedSupplier,
    });
  }, [pageIndex, pageSize, triggerGetReport]);

  // ---------------- Columns ----------------
  const columns: ColumnDef<DailyReport>[] = useMemo(
    () => [
      {
        accessorKey: 'reportDate',
        header: () => <div className="text-sm font-bold text-foreground">Date</div>,
        cell: ({ row }) => {
          const dateValue = row.getValue<string>('reportDate');
          const date = new Date(dateValue);
          const displayValue = isNaN(date.getTime()) ? dateValue : date.toLocaleDateString();
          return <span className={row.depth > 0 ? 'pl-4 text-sm' : 'text-sm'}>{displayValue}</span>;
        },
        footer: () => <div className="font-bold">Total</div>,
      },
      {
        accessorKey: 'supplier',
        header: () => <div className="text-sm font-bold text-foreground">Supplier</div>,
        cell: ({ row }) => (
          <div className={row.depth > 0 ? 'pl-4 text-sm' : 'text-sm'}>
            {row.getValue('supplier')}
          </div>
        ),
      },
      {
        accessorKey: 'turnoverPoints',
        header: () => <div className="text-sm font-bold text-foreground">Turnover Points</div>,
        cell: ({ row }) => {
          const value = Number(row.getValue('turnoverPoints')) || 0;
          return <div className="text-sm">{value.toLocaleString()}</div>;
        },
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => sum + (Number(row.getValue('turnoverPoints')) || 0), 0);
          return <div className="font-bold">{total.toLocaleString()}</div>;
        },
      },
      {
        accessorKey: 'ggrPoints',
        header: () => <div className="text-sm font-bold text-foreground">GGR Points</div>,
        cell: ({ row }) => {
          const value = Number(row.getValue('ggrPoints')) || 0;
          return <div className="text-sm">{value.toFixed(2)}</div>;
        },
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => sum + (Number(row.getValue('ggrPoints')) || 0), 0);
          return <div className="font-bold">{total.toFixed(2)}</div>;
        },
      },
      {
        accessorKey: 'averageBet',
        header: () => <div className="text-sm font-bold text-foreground">Average Bet</div>,
        cell: ({ row }) => {
          const value = parseFloat(row.getValue('averageBet') ?? '0') || 0;
          return <div className="text-sm">{value.toFixed(2)}</div>;
        },
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const total = rows.reduce(
            (sum, row) => sum + (parseFloat(row.getValue('averageBet') ?? '0') || 0),
            0
          );
          const avg = rows.length > 0 ? total / rows.length : 0;
          return <div className="font-bold">{avg.toFixed(2)}</div>;
        },
      },
      {
        accessorKey: 'betCount',
        header: () => <div className="text-sm font-bold text-foreground">Bet Count</div>,
        cell: ({ row }) => {
          const value = parseInt(row.getValue('betCount') ?? '0', 10) || 0;
          return <div className="text-sm">{value}</div>;
        },
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce(
              (sum, row) => sum + (parseInt(row.getValue('betCount') ?? '0', 10) || 0),
              0
            );
          return <div className="font-bold">{total}</div>;
        },
      },
      {
        accessorKey: 'marginPercent',
        header: () => <div className="text-sm font-bold text-foreground">Margin %</div>,
        cell: ({ row }) => {
          const value = parseFloat(row.getValue('marginPercent') ?? '0') || 0;
          const color = value >= 0 ? 'text-green-600' : 'text-red-600';
          return <div className={`${color} text-sm`}>{value.toFixed(2)}</div>;
        },
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const total = rows.reduce(
            (sum, row) => sum + (parseFloat(row.getValue('marginPercent') ?? '0') || 0),
            0
          );
          const avg = rows.length > 0 ? total / rows.length : 0;
          const color = avg >= 0 ? 'text-green-600' : 'text-red-600';
          return <div className={`font-bold ${color}`}>{avg.toFixed(2)}</div>;
        },
      },
      {
        id: 'expander',
        header: () => null,
        cell: ({ row }) =>
          row.getCanExpand() ? (
            <button
              onClick={row.getToggleExpandedHandler()}
              className="p-1 text-muted-foreground hover:text-foreground"
              aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
            >
              {row.getIsExpanded() ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          ) : null,
      },
      {
        id: 'action',
        header: () => <div className="text-sm font-bold text-foreground">Action</div>,
        cell: ({ row }) => {
          if (row.depth !== 0) return null;
          const dateStr = row.getValue<string>('reportDate');
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return null;
          const isoDate = date.toISOString().split('T')[0];
          return (
            <Link to={`/reports/daily-supplier-report/${dateStr}`}>
              <Button className="bg-primary text-white text-sm px-3 py-1">Suppliers</Button>
            </Link>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Daily Report</h1>
        <div className="flex gap-4 flex-wrap items-end">
          <DateTimeRangePicker onDateRangeChange={handleDateRangeChange} />
          <div>
            <div className="text-sm mb-1">Provider</div>
            <MultiSelect
              options={providerList}
              placeholder="Select Provider"
              onChange={(values) => {
                setSelectedProvider(values);
                setSelectedSupplier([]);
              }}
            />
          </div>
          <div>
            <div className="text-sm mb-1">Supplier</div>
            <MultiSelect
              options={subProviderList}
              placeholder="Select Supplier"
              onChange={(values) => setSelectedSupplier(values)}
            />
          </div>
          <Button onClick={applyFilters} className="bg-primary text-white">
            Apply
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable data={tableData} columns={columns} />

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

export default DailyReportPage;
