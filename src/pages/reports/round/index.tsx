import React, { useState, ChangeEvent } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from './components/DataTable/DataTable';
import { formatDate } from '@/utils';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import ClearInput from '@/components/common/ClearInput';
import { RoundReport, useLazyGetRoundReportQuery } from '@/store/api/ReportApi';
import { Pagination } from '@/components/common/Pagination';

const RoundReportPage = () => {
  const [value, setValue] = useState<string>('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);



  const [triggerGetReport, { data: roundReportData }] = useLazyGetRoundReportQuery();


  const tableData = roundReportData?.data ?? [];

const columns: ColumnDef<RoundReport>[] = [
  {
    accessorKey: 'operatorName',
    header: () => <div className="text-sm font-bold text-header-table">Operator Name</div>,
    cell: ({ row }) => {
      const operator = row.original;
      return (
        <Link
          to={`/reports/round-report/${operator.operatorName}?operator_id=${operator.operatorId}`}
          className="text-sm"
        >
          {operator.operatorName}
        </Link>
      );
    },
     footer: () => <div className="font-bold">Total</div>,
  },
  {
    accessorKey: 'turnover',
    header: () => <div className="text-sm font-bold text-header-table">Turnover</div>,
    cell: ({ row }) => <div className='text-sm'>{row.getValue<number>('turnover').toLocaleString()}</div>,
    footer: ({ table }) => {
      const total = table.getFilteredRowModel().rows.reduce(
        (sum, row) => sum + Number(row.getValue('turnover') || 0),
        0
      );
      return <div className="font-bold">{total.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'winAmount',
    header: () => <div className="text-sm font-bold text-header-table">Win Amount</div>,
    cell: ({ row }) => <div className='text-sm'>{Number(row.getValue('winAmount')).toLocaleString()}</div>,
    footer: ({ table }) => {
      const total = table.getFilteredRowModel().rows.reduce(
        (sum, row) => sum + Number(row.getValue('winAmount') || 0),
        0
      );
      return <div className="font-bold">{total.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'rollbackAmount',
    header: () => <div className="text-sm font-bold text-header-table">Rollback Amount</div>,
    cell: ({ row }) => <div className='text-sm'>{Number(row.getValue('rollbackAmount')).toLocaleString()}</div>,
    footer: ({ table }) => {
      const total = table.getFilteredRowModel().rows.reduce(
        (sum, row) => sum + Number(row.getValue('rollbackAmount') || 0),
        0
      );
      return <div className="font-bold">{total.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'ggrAmount',
    header: () => <div className="text-sm font-bold text-header-table">GGR Amount</div>,
    cell: ({ row }) => <div className='text-sm'>{Number(row.getValue('ggrAmount')).toLocaleString()}</div>,
    footer: ({ table }) => {
      const total = table.getFilteredRowModel().rows.reduce(
        (sum, row) => sum + Number(row.getValue('ggrAmount') || 0),
        0
      );
      return <div className="font-bold">{total.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'averageBet',
    header: () => <div className="text-sm font-bold text-header-table">Average Bet</div>,
    cell: ({ row }) => <div>{Number(row.getValue('averageBet')).toFixed(2)}</div>,
    footer: ({ table }) => {
      const rows = table.getFilteredRowModel().rows;
      const total = rows.reduce(
        (sum, row) => sum + Number(row.getValue('averageBet') || 0),
        0
      );
      const avg = rows.length > 0 ? total / rows.length : 0;
      return <div className="font-bold">{avg.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: 'totalWon',
    header: () => <div className="text-sm font-bold text-header-table">Total Won</div>,
    cell: ({ row }) => <div>{row.getValue('totalWon')}</div>,
    footer: ({ table }) => {
      const total = table.getFilteredRowModel().rows.reduce(
        (sum, row) => sum + Number(row.getValue('totalWon') || 0),
        0
      );
      return <div className="font-bold">{total}</div>;
    },
  },
  {
    accessorKey: 'totalLost',
    header: () => <div className="text-sm font-bold text-header-table">Total Lost</div>,
    cell: ({ row }) => <div>{row.getValue('totalLost')}</div>,
    footer: ({ table }) => {
      const total = table.getFilteredRowModel().rows.reduce(
        (sum, row) => sum + Number(row.getValue('totalLost') || 0),
        0
      );
      return <div className="font-bold">{total}</div>;
    },
  },
  {
    accessorKey: 'totalRollback',
    header: () => <div className="text-sm font-bold text-header-table">Total Rollback</div>,
    cell: ({ row }) => <div>{row.getValue('totalRollback')}</div>,
    footer: ({ table }) => {
      const total = table.getFilteredRowModel().rows.reduce(
        (sum, row) => sum + Number(row.getValue('totalRollback') || 0),
        0
      );
      return <div className="font-bold">{total}</div>;
    },
  },
  {
    accessorKey: 'marginPercent',
    header: () => <div className="text-sm font-bold text-header-table">Margin %</div>,
    cell: ({ row }) => {
      const value = Number(row.getValue('marginPercent'));
      return (
        <span className={value < 0 ? 'text-red-500' : 'text-green-600'}>{value.toFixed(2)}%</span>
      );
    },
    footer: ({ table }) => {
      const rows = table.getFilteredRowModel().rows;
      const total = rows.reduce(
        (sum, row) => sum + Number(row.getValue('marginPercent') || 0),
        0
      );
      const avg = rows.length > 0 ? total / rows.length : 0;
      const color = avg < 0 ? 'text-red-500' : 'text-green-600';
      return <span className={`font-bold ${color}`}>{avg.toFixed(2)}%</span>;
    },
  },
];


  const applyFilters = () => {
    triggerGetReport({
      skip: pageIndex * pageSize,
      take: pageSize,
      search: value,
    });
    setPageIndex(0)
  };


const totalItems = roundReportData?.pagination?.totalCount ?? 0;
  const pageCount = Math.ceil(totalItems / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Round Report</h1>
        </div>
        <div className="flex space-x-2 items-center">
          <div className="w-full max-w-sm mx-auto p-6">
            <div className="w-full max-w-sm mx-auto p-6">
              <ClearInput placeholder="Round Id" value={value} setValue={setValue} />
            </div>
          </div>
          <Button disabled={!value} onClick={applyFilters} className="bg-primary text-white">
            Apply
          </Button>
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

export default RoundReportPage;
