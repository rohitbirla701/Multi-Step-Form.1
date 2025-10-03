// GameReportPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ColumnDef, SortingState, OnChangeFn } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from './components/DataTable/DataTable'; // Path to your DataTable
import MultiSelect from '@/components/common/MultiSelect';
import DateTimeRangePicker from '@/components/common/DateTimeRangePicker';
import { GameReport, useLazyGetGameReportQuery } from '@/store/api/ReportApi';
import { Pagination } from '@/components/common/Pagination';
import { useGetSubProviderQuery } from '@/store/api/ProviderApi';
import { useGetCasinoGamesQuery } from '@/store/api/gameApi';
import dayjs from 'dayjs';
import { formatNumber } from '@/utils';

const GameReportPage = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string[]>([]);
  const [selectedSubProvider, setSelectedSubProvider] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState<string[]>([]);
  // Pagination state controlled from this component
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  // Add sorting state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [range, setRange] = useState<{ startDate: string | null; endDate: string | null }>({
    startDate: dayjs().subtract(7, 'day').toDate().toISOString(),
    endDate: dayjs().toDate().toISOString(),
  });

  const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
    setRange({ startDate: startDate, endDate: endDate });
  };

  const [triggerGetReport, { data: gameReportData }] = useLazyGetGameReportQuery();

  const { data: casinoGamedata } = useGetCasinoGamesQuery({ subProviders: selectedSubProvider });
  const { data: subProvideData } = useGetSubProviderQuery({});
  const subProviderList = subProvideData?.map((item) => item.subProvider) ?? [];

  const gameList = casinoGamedata?.data.map((item) => item?.name);

  const pageCount = gameReportData?.total ? Math.ceil(gameReportData.total / pageSize) : 0;

  const tableData: GameReport[] = useMemo(() => {
    if (!gameReportData?.data) return [];
    return gameReportData.data.map((row) => ({
      ...row,
      subRows: [
        {
          ...row,
          supplier: 'PTS',
        },
      ],
    }));
  }, [gameReportData]);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPageIndex(0);
  };

  // Handle sorting change
  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    const newSorting =
      typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;

    console.log('handleSortingChange - new sorting:', newSorting); // Debug log

    setSorting(newSorting);
    setPageIndex(0); // Reset to first page when sorting changes
  };

  // Convert sorting state to API parameters
  const getSortingParams = (currentSorting: SortingState = sorting) => {
    console.log('getSortingParams called with sorting:', currentSorting); // Debug log

    if (!currentSorting || currentSorting.length === 0) {
      console.log('No sort items found'); // Debug log
      return {};
    }

    const sortItem = currentSorting[0];
    if (!sortItem) {
      console.log('No sort item found'); // Debug log
      return {};
    }

    const params = {
      orderBy: sortItem.id,
      orderFormat: sortItem.desc ? 'desc' : 'asc',
    };

    console.log('Returning sort params:', params); // Debug log
    return params;
  };

  const handleApply = () => {
    const sortParams = getSortingParams();
    console.log('Apply - Sorting params:', sortParams); // Debug log

    // Reset pagination when applying filters
    setPageIndex(0);

    triggerGetReport({
      skip: 0, // Always start from first page when applying filters
      take: pageSize,
      currency: selectedCurrency,
      supplier: selectedSubProvider,
      game: selectedGame,
      startDate: range?.startDate || undefined,
      endDate: range?.endDate || undefined,
      ...sortParams,
    });
  };

  useEffect(() => {
    const sortParams = getSortingParams();
    console.log('useEffect - Sorting params:', sortParams); // Debug log
    console.log('useEffect - Current sorting state:', sorting); // Debug log
    console.log('useEffect - Page index:', pageIndex, 'Page size:', pageSize); // Debug log

    triggerGetReport({
      skip: pageIndex * pageSize,
      take: pageSize,
      currency: selectedCurrency,
      supplier: selectedSubProvider,
      game: selectedGame,
      startDate: range?.startDate || undefined,
      endDate: range?.endDate || undefined,
      ...sortParams,
    });
  }, [
    pageIndex,
    pageSize,
    sorting,
    selectedCurrency,
    selectedSubProvider,
    selectedGame,
    range,
    triggerGetReport,
  ]);

  // Initial data load
  useEffect(() => {
    console.log('Initial data load');
    const sortParams = getSortingParams();

    triggerGetReport({
      skip: 0,
      take: pageSize,
      currency: selectedCurrency,
      supplier: selectedSubProvider,
      game: selectedGame,
      startDate: range?.startDate || undefined,
      endDate: range?.endDate || undefined,
      ...sortParams,
    });
  }, []); // Empty dependency array for initial load only

  // Data transform for subRows
  // Columns
  const columns: ColumnDef<GameReport>[] = useMemo(
    () => [
      {
        accessorKey: 'supplier',
        header: () => <div className="text-sm font-bold text-header-table">Supplier</div>,
        cell: ({ row }) => {
          const isSubRow = row.depth > 0;
          return (
            <div className={`${isSubRow ? 'pl-4 italic' : ''}`}>{row.getValue('supplier')}</div>
          );
        },
        footer: () => <div className="font-bold">Total</div>,
        enableSorting: true,
      },
      {
        accessorKey: 'turnover_points',
        header: () => <div className="text-sm font-bold text-header-table">Turnover Points</div>,
        cell: ({ row }) => {
          const value = row.getValue('turnover_points');
          return <div>{formatNumber(value)}</div>;
        },
        footer: ({ table }) => {
          const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
            const rawValue = row.getValue('turnover_points');
            const numValue = Number(rawValue);
            return sum + (isNaN(numValue) ? 0 : numValue);
          }, 0);
          return <div className="font-bold">{formatNumber(total)}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'ggr_points',
        header: () => <div className="text-sm font-bold text-header-table">GGR Points</div>,
        cell: ({ row }) => {
          const value = row.getValue('ggr_points');
          return <div>{formatNumber(value)}</div>;
        },
        footer: ({ table }) => {
          const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
            const rawValue = row.getValue('ggr_points');
            const numValue = Number(rawValue);
            return sum + (isNaN(numValue) ? 0 : numValue);
          }, 0);
          return <div className="font-bold">{formatNumber(total)}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'average_bet',
        header: () => <div className="text-sm font-bold text-header-table">Average Bet</div>,
        cell: ({ row }) => {
          const value = row.getValue('average_bet');
          return <div>{formatNumber(value)}</div>;
        },
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const average =
            rows.length > 0
              ? rows.reduce((sum, row) => {
                  const rawValue = row.getValue('average_bet');
                  const numValue = Number(rawValue);
                  return sum + (isNaN(numValue) ? 0 : numValue);
                }, 0) / rows.length
              : 0;
          return <div className="font-bold">{formatNumber(average)}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'bet_count',
        header: () => <div className="text-sm font-bold text-header-table">Bet Count</div>,
        cell: ({ row }) => {
          const value = row.getValue('bet_count');
          return <div>{formatNumber(value)}</div>;
        },
        footer: ({ table }) => {
          const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
            const rawValue = row.getValue('bet_count');
            const numValue = Number(rawValue);
            return sum + (isNaN(numValue) ? 0 : numValue);
          }, 0);
          return <div className="font-bold">{formatNumber(total)}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'active_users',
        header: () => <div className="text-sm font-bold text-header-table">Active Users</div>,
        cell: ({ row }) => {
          const value = Number(row.getValue('active_users')) || 0;
          return <div>{value.toFixed(2)}</div>;
        },
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => sum + (Number(row.getValue('active_users')) || 0), 0);
          return <div className="font-bold">{total.toFixed(2)}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'margin_percent',
        header: () => <div className="text-sm font-bold text-header-table">Margin in %</div>,
        cell: ({ row }) => {
          const value = Number(row.getValue('margin_percent')) || 0;
          return (
            <span className={value < 0 ? 'text-red-500' : 'text-green-600'}>
              {value.toFixed(2)}%
            </span>
          );
        },
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const averageMargin =
            rows.length > 0
              ? rows.reduce((sum, row) => sum + (Number(row.getValue('margin_percent')) || 0), 0) /
                rows.length
              : 0;
          return (
            <span className={`font-bold ${averageMargin < 0 ? 'text-red-500' : 'text-green-600'}`}>
              {averageMargin.toFixed(2)}%
            </span>
          );
        },
        enableSorting: true,
      },
    ],
    []
  );

  const currencies = ['INR', 'USD', 'PTS'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Game Report</h1>
        </div>
        <div className="flex gap-4 flex-wrap items-end">
          <DateTimeRangePicker onDateRangeChange={handleDateRangeChange} />
          <div>
            <div>Game</div>
            <MultiSelect
              options={gameList ?? []}
              placeholder="Select Game"
              onChange={(values) => setSelectedGame(values)}
            />
          </div>
          <div>
            <div>Supplier</div>
            <MultiSelect
              multiple={true}
              options={subProviderList}
              placeholder="Select Supplier"
              onChange={(values) => setSelectedSubProvider(values)}
            />
          </div>
          <div>
            <div>Currency</div>
            <MultiSelect
              options={currencies}
              placeholder="Select Currency"
              onChange={(values) => setSelectedCurrency(values)}
            />
          </div>
          <Button className="bg-primary text-white" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>

      {/* Data Table with Controlled Pagination and Sorting */}
      <DataTable
        data={tableData}
        columns={columns}
        enableSelection={false}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        manualSorting={true}
      />
      <Pagination
        pageSize={pageSize}
        setPageSize={handlePageSizeChange}
        pageIndex={pageIndex}
        pageCount={pageCount}
        totalItems={gameReportData?.total ?? 0}
        onNextPage={() => setPageIndex((prev) => prev + 1)}
        onPreviousPage={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
        canPreviousPage={pageIndex > 0}
        canNextPage={pageIndex < pageCount - 1}
      />
    </div>
  );
};

export default GameReportPage;
