import React, { useState, useMemo, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import MultiSelect from '@/components/common/MultiSelect';
import DateTimeRangePicker from '@/components/common/DateTimeRangePicker';
import { DataTable } from './components/DataTable/DataTable';
import ClearInput from '@/components/common/ClearInput';
import { useGetCasinoProvidersQuery, useGetSubProvidersByNameQuery } from '@/store/api/ProviderApi';
import { PlayerReport, useLazyGetPlayerReportQuery } from '@/store/api/ReportApi';
import { Pagination } from '@/components/common/Pagination';
import dayjs from 'dayjs';

const PlayerReportPage = () => {
  // 🔹 Filter states
  const [selectedProvider, setSelectedProvider] = useState<string[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [userId, setUserId] = useState('');
  // const [userName, setUserName] = useState('');
  const [range, setRange] = useState({
    startDate: (dayjs().subtract(7, 'day').toDate().toISOString() as string) || null,
    endDate: (dayjs().toDate().toISOString() as string) || null,
  });

  const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
    setRange({ startDate, endDate });
  };

  const [triggerGetReport, { data: playerReportData }] = useLazyGetPlayerReportQuery();

  const tableData: PlayerReport[] = useMemo(() => {
    if (!playerReportData?.data) return [];
    return playerReportData.data.map((row) => ({
      ...row,
      subRows: [
        {
          ...row,
          supplier: 'PTS',
        },
      ],
    }));
  }, [playerReportData]);

  useEffect(() => {
    triggerGetReport({
      skip: pageIndex * pageSize,
      take: pageSize,
      search: userId,
      // username: userName,
      // currency: selectedCurrency,
      // provider: selectedProvider,
      // supplier: selectedSupplier,
      startDate: range.startDate || undefined,
      endDate: range.endDate || undefined,
    });
  }, [pageIndex, pageSize]);

  const handleApply = () => {
    triggerGetReport({
      skip: pageIndex * pageSize,
      take: pageSize,
      search: userId,
      // username: userName,
      // currency: selectedCurrency,
      // provider: selectedProvider,
      // supplier: selectedSupplier,
      startDate: range.startDate || undefined,
      endDate: range.endDate || undefined,
    });
    setPageIndex(0);
  };

  const formatNumber = (value: number | string) => {
    const num = Number(value);

    if (isNaN(num)) {
      return '–'; // Fallback for invalid number
    }

    // Check if the number is a whole number (integer)
    if (Number.isInteger(num)) {
      return num.toString();
    }

    // If it's a float, format to two decimal places
    return num.toFixed(2);
  };

  // 🔹 Columns
  const columns: ColumnDef<PlayerReport>[] = useMemo(
    () => [
      {
        accessorKey: 'username',
        header: () => <div className="text-sm font-bold text-header-table">User Name</div>,
        cell: ({ row }) => {
          const isSubRow = row.depth > 0;
          return <div className={`${isSubRow ? 'pl-8' : ''}`}>{row.getValue('username')}</div>;
        },
        footer: () => <div className="font-bold">Total</div>,
      },
      {
        accessorKey: 'userId',
        header: () => <div className="text-sm font-bold text-header-table">User Id</div>,
        cell: ({ row }) => <div>{row.getValue('userId')}</div>,
        footer: ({ table }) => {
          const total = table.getCoreRowModel().rows.reduce((sum, row) => {
            const value = Number(row.getValue('userId'));
            return sum + (isNaN(value) ? 0 : value);
          }, 0);
          return <div className="font-bold">{formatNumber(total)}</div>;
        },
      },
      {
        accessorKey: 'turnoverPoints',
        header: () => <div className="text-sm font-bold text-header-table">Turnover Points</div>,
        cell: ({ row }) => <div>{formatNumber(row.getValue('turnoverPoints'))}</div>,
        footer: ({ table }) => {
          const total = table.getCoreRowModel().rows.reduce((sum, row) => {
            const value = Number(row.getValue('turnoverPoints'));
            return sum + (isNaN(value) ? 0 : value);
          }, 0);
          return <div className="font-bold">{formatNumber(total)}</div>;
        },
      },
      {
        accessorKey: 'ggrPoints',
        header: () => <div className="text-sm font-bold text-header-table">GGR Points</div>,
        cell: ({ row }) => <div>{formatNumber(row.getValue('ggrPoints'))}</div>,
        footer: ({ table }) => {
          const total = table.getCoreRowModel().rows.reduce((sum, row) => {
            const value = Number(row.getValue('ggrPoints'));
            return sum + (isNaN(value) ? 0 : value);
          }, 0);
          return <div className="font-bold">{formatNumber(total)}</div>;
        },
      },
      {
        accessorKey: 'averageBet',
        header: () => <div className="text-sm font-bold text-header-table">Average Bet</div>,
        cell: ({ row }) => <div>{formatNumber(row.getValue('averageBet'))}</div>,
        footer: ({ table }) => {
          const rows = table.getCoreRowModel().rows;
          const total = rows.reduce((sum, row) => {
            const value = Number(row.getValue('averageBet'));
            return sum + (isNaN(value) ? 0 : value);
          }, 0);
          const average = rows.length > 0 ? total / rows.length : 0;
          return <div className="font-bold">{formatNumber(average)}</div>;
        },
      },
      {
        accessorKey: 'betCount',
        header: () => <div className="text-sm font-bold text-header-table">Bet Count</div>,
        cell: ({ row }) => <div>{formatNumber(row.getValue('betCount'))}</div>,
        footer: ({ table }) => {
          const total = table.getCoreRowModel().rows.reduce((sum, row) => {
            const value = Number(row.getValue('betCount'));
            return sum + (isNaN(value) ? 0 : value);
          }, 0);
          return <div className="font-bold">{formatNumber(total)}</div>;
        },
      },
      {
        accessorKey: 'activeUsers',
        header: () => <div className="text-sm font-bold text-header-table">Active Users</div>,
        cell: ({ row }) => <div>{formatNumber(row.getValue('activeUsers'))}</div>,
        footer: ({ table }) => {
          const total = table.getCoreRowModel().rows.reduce((sum, row) => {
            const value = Number(row.getValue('activeUsers'));
            return sum + (isNaN(value) ? 0 : value);
          }, 0);
          return <div className="font-bold">{formatNumber(total)}</div>;
        },
      },
      {
        accessorKey: 'marginPercent',
        header: () => <div className="text-sm font-bold text-header-table">Margin in %</div>,
        cell: ({ row }) => {
          const value = Number(row.getValue('marginPercent'));
          const displayValue = isNaN(value) ? '–' : value.toFixed(2);
          return (
            <span className={value < 0 ? 'text-red-500' : 'text-green-600'}>{displayValue}%</span>
          );
        },
        footer: ({ table }) => {
          const rows = table.getCoreRowModel().rows;
          const total = rows.reduce((sum, row) => {
            const value = Number(row.getValue('marginPercent'));
            return sum + (isNaN(value) ? 0 : value);
          }, 0);
          const averageMargin = rows.length > 0 ? total / rows.length : 0;
          return (
            <span className={`font-bold ${averageMargin < 0 ? 'text-red-500' : 'text-green-600'}`}>
              {formatNumber(averageMargin)}%
            </span>
          );
        },
      },
    ],
    []
  );

  const currencies = ['INR', 'USD', 'PTS'];
  const { data: providersData } = useGetCasinoProvidersQuery();
  const providerList = (providersData ?? []).map((p) => p.provider);
  const { data: subProviderData } = useGetSubProvidersByNameQuery(selectedProvider[0] ?? '');
  const subProviderList = subProviderData?.map((item) => item.subProvider) ?? [];
  const totalItems = Number(playerReportData?.pagination?.totalCount || 0) ?? 0;
  const pageCount = Math.ceil(totalItems / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Player Report</h1>
        <div className="flex gap-4 flex-wrap items-end">
          <DateTimeRangePicker onDateRangeChange={handleDateRangeChange} />

          <div>
            <div>Provider</div>
            <MultiSelect options={providerList} placeholder="All" onChange={setSelectedProvider} />
          </div>
          <div>
            <div>Supplier</div>
            <MultiSelect
              options={subProviderList}
              placeholder="Supplier"
              onChange={setSelectedSupplier}
            />
          </div>
          <div>
            <div>Currency</div>
            <MultiSelect options={currencies} placeholder="All" onChange={setSelectedCurrency} />
          </div>

          {/* User Id Input */}
          <ClearInput
            placeholder="Search"
            value={userId}
            setValue={setUserId}
            className="pr-10 border-gray-300 w-full"
          />
          {/* User Name Input */}
          {/* <ClearInput placeholder="Search UserName" value={userName} setValue={setUserName} /> */}

          <Button className="bg-primary text-white" onClick={handleApply}>
            Apply
          </Button>
          <Button className="bg-exportBtn text-white">Export</Button>
        </div>
      </div>

      <DataTable data={tableData ?? []} columns={columns} />

      {/* Pagination */}
      <Pagination
        pageSize={pageSize}
        pageIndex={pageIndex}
        pageCount={pageCount}
        totalItems={totalItems}
        onNextPage={() => setPageIndex((prev) => Math.min(prev + 1, pageCount - 1))}
        onPreviousPage={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
        canPreviousPage={true}
        canNextPage={pageIndex < pageCount - 1}
        setPageSize={(size: number) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </div>
  );
};

export default PlayerReportPage;
