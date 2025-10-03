import React, { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from './components/DataTable/DataTable';
import { BetListResponse } from '@/types';
import { Input } from '@/components/ui/input';
import AddSelect from '../transactions/components/AddSelect';
import { useClipboard } from '@/hooks';
import toast from 'react-hot-toast';
import TransactionModal from './TransactionModal';
import DateTimeRangePicker from '@/components/common/DateTimeRangePicker';
import MultiSelect from '@/components/common/MultiSelect';
import { useLazyGetBetListQuery } from '@/store/api/TransactionApi';
import { Pagination } from '@/components/common/Pagination';
import { useGetCasinoProvidersQuery } from '@/store/api/ProviderApi';

const BetStatusPage = () => {
  const { copy } = useClipboard();
  const [triggerBetList, { data: betData }] = useLazyGetBetListQuery();
  const { data: providerData } = useGetCasinoProvidersQuery();

  const providerList = providerData?.map((item) => item?.provider);
  // Pagination state
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  // Filters
  const [betIds, setBetIds] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<string[] | null>(null);
  const [dateRange, setDateRange] = useState<{ startDate: string | null; endDate: string | null }>({
    startDate: null,
    endDate: null,
  });

  // Active filters for AddSelect
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Modal
  const [openTransactionModal, setOpenTransactionModal] = useState(false);

  // Remove filter
  const handleRemoveFilter = (id: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== id));
  };

  // Pagination handlers
  const handlePageSizeChange = (newSize: number) => {
    setTake(newSize);
    setPageIndex(0);
    setSkip(0);
  };

  const handleNextPage = () => {
    const newIndex = pageIndex + 1;
    setPageIndex(newIndex);
    setSkip(newIndex * take);
  };

  const handlePreviousPage = () => {
    const newIndex = pageIndex - 1;
    setPageIndex(newIndex);
    setSkip(newIndex * take);
  };

  // Initial fetch
  useEffect(() => {
    triggerBetList({ skip, take });
  }, [skip, take, triggerBetList]);

  // Table data
  const betTableData = betData?.data ?? [];
  const totalItems = betData?.total ?? 0;
  const pageCount = Math.ceil(totalItems / take);
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  // Columns
  const columns: ColumnDef<BetListResponse>[] = [
    {
      accessorKey: 'userName',
      header: () => <div className="text-sm font-bold">User</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.userName}</div>,
    },
    {
      accessorKey: 'betId',
      header: () => <div className="text-sm font-bold">Bet Id</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm">
          {row.original.betId}
          <span
            className="cursor-pointer text-gray-500"
            onClick={async () => {
              const success = await copy(row.original.betId);
              success ? toast.success('Copied!') : toast.error('Copy failed');
            }}
          >
            <Copy className="h-6 w-6" />
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'providerName',
      header: () => <div className="text-sm font-bold">Provider</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.providerName}</div>,
    },
    {
      accessorKey: 'subProviderName',
      header: () => <div className="text-sm font-bold">Supplier</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.subProviderName}</div>,
    },
    {
      accessorKey: 'createdAt',
      header: () => <div className="text-sm font-bold">Bet Time</div>,
      cell: ({ row }) => (
        <div className="text-sm">{new Date(row.original.createdAt).toLocaleString()}</div>
      ),
    },
    {
      accessorKey: 'roundId',
      header: () => <div className="text-sm font-bold">Round Id</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.roundId}</div>,
    },
    {
      accessorKey: 'status',
      header: () => <div className="text-sm font-bold">Status</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.status}</div>,
    },
  ];

const applyFilters = () => {
  const params: Record<string, any> = {
    skip,
    take,
  };

  // Bet IDs
  if (betIds.trim()) {
    params.transactionId = betIds.trim();
  }

  // Provider filter
  if (activeFilters.includes('provider') && selectedProviders?.length) {
    params.provider = selectedProviders;
  }

  // Date filter
  if (activeFilters.includes('dateFilter')) {
    if (dateRange.startDate) params.startDate = dateRange.startDate;
    if (dateRange.endDate) params.endDate = dateRange.endDate;
  }

  triggerBetList(params);
};

return (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl sm:text-3xl font-bold">Bet Status</h1>

      <div className="flex flex-wrap items-end gap-4 w-full sm:w-auto">
        {/* Bet Ids */}
        <Input
          className="xl:w-[430px] flex-grow"
          placeholder="Bet Ids (comma separated)"
          value={betIds}
          onChange={(e) => setBetIds(e.target.value)}
        />

        {/* Provider filter */}
        {activeFilters.includes('provider') && (
          <div className="flex flex-col justify-end">
            <div>Provider</div>
            <div className="flex items-end gap-2">
              <MultiSelect
                multiple
                options={providerList ?? []}
                placeholder="Select Provider"
                onChange={(values) => setSelectedProviders(values)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-destructive/10"
                onClick={() => handleRemoveFilter('provider')}
              >
                <X className="h-5 w-5 text-gray-500 hover:text-destructive" />
              </Button>
            </div>
          </div>
        )}

        {/* Date filter */}
        {activeFilters.includes('dateFilter') && (
          <div className="flex items-end gap-2">
            <DateTimeRangePicker
              onDateRangeChange={(start, end) =>
                setDateRange({
                  startDate: start ? new Date(start).toISOString() : null,
                  endDate: end ? new Date(end).toISOString() : null,
                })
              }
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive/10"
              onClick={() => handleRemoveFilter('dateFilter')}
            >
              <X className="h-5 w-5 text-gray-500 hover:text-destructive" />
            </Button>
          </div>
        )}

        {/* AddSelect for dynamic filters */}
        <AddSelect
          options={[
            { id: 'provider', name: 'Provider' },
            { id: 'dateFilter', name: 'Date Filter' },
          ]}
          activeFilters={activeFilters}
          onChange={setActiveFilters}
        />

        {/* Apply button */}
        <Button className="bg-primary text-white" onClick={applyFilters}>
          Apply
        </Button>
      </div>
    </div>

    {/* Table */}
    <DataTable data={betTableData} columns={columns} showPagination={false} />

    {/* Pagination */}
    <Pagination
      pageSize={take}
      pageIndex={pageIndex}
      pageCount={pageCount}
      totalItems={totalItems}
      onNextPage={handleNextPage}
      onPreviousPage={handlePreviousPage}
      canPreviousPage={canPreviousPage}
      canNextPage={canNextPage}
      setPageSize={handlePageSizeChange}
    />

    {/* Transaction Modal */}
    <TransactionModal
      transactionId="123456"
      open={openTransactionModal}
      onOpenChange={setOpenTransactionModal}
    />
  </div>
);
};

export default BetStatusPage;
