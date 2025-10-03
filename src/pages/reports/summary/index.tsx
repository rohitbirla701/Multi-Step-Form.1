import React, { useState, useMemo, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import MultiSelect from '@/components/common/MultiSelect';
import DateTimeRangePicker from '@/components/common/DateTimeRangePicker';
import { DataTable } from './components/DataTable/DataTable';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SummaryReport, useLazyGetSummaryReportQuery } from '@/store/api/ReportApi';
import { Pagination } from '@/components/common/Pagination';
import dayjs from "dayjs";

const SummaryReportPage = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [range, setRange] = useState({
    startDate: (dayjs().subtract(7, 'day').toDate().toISOString() as string) || null,
    endDate: (dayjs().toDate().toISOString() as string) || null,
  });

  const currencies = ['All', 'INR', 'USD', 'PTS'];
  const [triggerGetReport, { data: summaryReportData }] = useLazyGetSummaryReportQuery();

  const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
    setRange({ startDate, endDate });
  };

  // ---------------- Normalize subRows for expandable rows ----------------
  const tableData: SummaryReport[] = useMemo(() => {
    if (!summaryReportData?.data) return [];
    return summaryReportData.data.map((row) => ({
      ...row,
      subRows: [
        {
          ...row,
          platformId: 'PTS',
        },
      ],
    }));
  }, [summaryReportData]);

  // ---------------- Columns ----------------
  const columns: ColumnDef<SummaryReport>[] = useMemo(
    () => [
      {
        id: 'platformName',
        header: () => <div className="text-sm font-bold text-foreground">Operator & Site</div>,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <span className={row.depth > 0 ? 'pl-8 text-sm' : 'text-sm'}>
                {row?.original?.platformName}
              </span>
              {row.getCanExpand() && (
                <button
                  onClick={row.getToggleExpandedHandler()}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  {row.getIsExpanded() ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              )}
            </div>
          );
        },
        footer: () => <div className="font-bold">Total</div>,
      },
      {
        accessorKey: 'turnoverPoints',
        header: () => <div className="text-sm font-bold text-foreground">Turnover Points</div>,
        cell: ({ row }) => {
          const raw = row.getValue<number | string>('turnoverPoints');
          const value = typeof raw === 'string' ? parseFloat(raw) : (raw ?? 0);
          return <div className="text-sm">{value.toLocaleString()}</div>;
        },
        footer: ({ table }) => {
          const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
            const raw = row.getValue<number | string>('turnoverPoints');
            return sum + (typeof raw === 'string' ? parseFloat(raw) : (raw ?? 0));
          }, 0);
          return <div className="font-bold">{total.toLocaleString()}</div>;
        },
      },
      {
        accessorKey: 'ggrPoints',
        header: () => <div className="text-sm font-bold text-foreground">GGR Points</div>,
        cell: ({ row }) => {
          const raw = row.getValue<number | string>('ggrPoints');
          const value = typeof raw === 'string' ? parseFloat(raw) : (raw ?? 0);
          return <div className="text-sm">{value.toFixed(2)}</div>;
        },
        footer: ({ table }) => {
          const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
            const raw = row.getValue<number | string>('ggrPoints');
            return sum + (typeof raw === 'string' ? parseFloat(raw) : (raw ?? 0));
          }, 0);
          return <div className="font-bold">{total.toFixed(2)}</div>;
        },
      },
      {
        accessorKey: 'averageBet',
        header: () => <div className="text-sm font-bold text-foreground">Average Bet</div>,
        cell: ({ row }) => {
          const raw = row.getValue<string>('averageBet');
          const value = parseFloat(raw ?? '0');
          return <div className="text-sm">{value.toFixed(2)}</div>;
        },
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const avg =
            rows.length > 0
              ? rows.reduce(
                  (sum, row) => sum + parseFloat(row.getValue<string>('averageBet') ?? '0'),
                  0
                ) / rows.length
              : 0;
          return <div className="font-bold">{avg.toFixed(2)}</div>;
        },
      },
      {
        accessorKey: 'betCount',
        header: () => <div className="text-sm font-bold text-foreground">Bet Count</div>,
        cell: ({ row }) => {
          const raw = row.getValue<string>('betCount');
          const value = parseInt(raw ?? '0', 10);
          return <div className="text-sm">{value}</div>;
        },
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce(
              (sum, row) => sum + parseInt(row.getValue<string>('betCount') ?? '0', 10),
              0
            );
          return <div className="font-bold">{total}</div>;
        },
      },
      {
        accessorKey: 'activeUsers',
        header: () => <div className="text-sm font-bold text-foreground">Active Users</div>,
        cell: ({ row }) => {
          const raw = row.getValue<string>('activeUsers');
          const value = parseInt(raw ?? '0', 10);
          return <div className="text-sm">{value}</div>;
        },
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce(
              (sum, row) => sum + parseInt(row.getValue<string>('activeUsers') ?? '0', 10),
              0
            );
          return <div className="font-bold">{total}</div>;
        },
      },
      {
        accessorKey: 'marginPercent',
        header: () => <div className="text-sm font-bold text-foreground">Margin in %</div>,
        cell: ({ row }) => {
          const raw = row.getValue<string>('marginPercent');
          const value = parseFloat(raw ?? '0');
          const color = value >= 0 ? 'text-green-600' : 'text-red-600';
          return <div className={`${color} text-sm`}>{value.toFixed(2)}</div>;
        },
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const avg =
            rows.length > 0
              ? rows.reduce(
                  (sum, row) => sum + parseFloat(row.getValue<string>('marginPercent') ?? '0'),
                  0
                ) / rows.length
              : 0;
          const color = avg >= 0 ? 'text-green-600' : 'text-red-600';
          return <div className={`font-bold ${color}`}>{avg.toFixed(2)}</div>;
        },
      },
    ],
    []
  );

  useEffect(() => {
    triggerGetReport({
      skip: pageIndex * pageSize,
      take: pageSize,
      currency: selectedCurrency,
      startDate: range?.startDate || undefined,
      endDate: range?.endDate || undefined,
    });
  }, [pageIndex, pageSize]);

  const applyFilters = () => {
    triggerGetReport({
      skip: pageIndex * pageSize,
      take: pageSize,
      currency: selectedCurrency,
      startDate: range?.startDate || undefined,
      endDate: range?.endDate || undefined,
    });
    setPageIndex(0);
  };

  const totalItems = summaryReportData?.pagination?.totalCount ?? 0;
  const pageCount = Math.ceil(totalItems / pageSize);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Summary Report</h1>
        <div className="flex gap-4 flex-wrap items-end">
          <DateTimeRangePicker onDateRangeChange={handleDateRangeChange} />
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

export default SummaryReportPage;
  