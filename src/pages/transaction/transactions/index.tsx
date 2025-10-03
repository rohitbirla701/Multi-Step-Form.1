import React, { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from './components/DataTable/DataTable';
import { Transaction } from '@/types';
import { Input } from '@/components/ui/input';
import MultiSelect from '@/components/common/MultiSelect';
import toast from 'react-hot-toast';
import TransactionDetailsDrawer from './components/TransactionDetailsDrawer';
import { useClipboard } from '@/hooks';
import DateTimeRangePicker from '@/components/common/DateTimeRangePicker';
import { useLazyGetTransactionsQuery } from '@/store/api/TransactionApi';
import ClearInput from '@/components/common/ClearInput';
import { useGetCasinoProvidersQuery } from '@/store/api/ProviderApi';
import AddSelect from './components/AddSelect';
import dayjs from 'dayjs';

const TransactionsPage = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data: providersData } = useGetCasinoProvidersQuery();
  const providers = (providersData ?? []).map((p) => p.provider);
  const { copy } = useClipboard();

  const [searchId, setSearchId] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [triggerGetTransactions, { data: transactionData, isFetching }] =
    useLazyGetTransactionsQuery();

  // Updated state for date range, storing ISO strings directly
  const [range, setRange] = useState({
    startDate: (dayjs().subtract(7, 'day').toDate().toISOString() as string) || null,
    endDate: (dayjs().toDate().toISOString() as string) || null,
  });

  const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
    setRange({ startDate, endDate });
  };

  const [filterValues, setFilterValues] = useState({
    userId: '',
    userName: '',
    latencyMin: '',
    latencyMax: '',
    amountMin: '',
    amountMax: '',
    roundId: '',
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState({
    ...filterValues,
    provider: '',
    startDate: range?.startDate as string | null,
    endDate: range?.endDate as string | null,
    transactionId: '',
  });

  // useEffect only depends on pageIndex + pageSize + appliedFilters
  useEffect(() => {
    fetchTransactions(pageIndex * pageSize, pageSize, appliedFilters);
  }, [pageIndex, pageSize, appliedFilters]);

  // Update filters when user clicks "Apply"
  const handleApply = () => {
    setPageIndex(0);

    // Build filters dynamically from activeFilters
    const newFilters: typeof appliedFilters = {
      provider: selectedProvider,
      startDate: range.startDate,
      endDate: range.endDate,
      transactionId: searchId,
      userId: activeFilters.includes('userId') ? filterValues.userId : '',
      userName: activeFilters.includes('userName') ? filterValues.userName : '',
      latencyMin: activeFilters.includes('latency') ? filterValues.latencyMin : '',
      latencyMax: activeFilters.includes('latency') ? filterValues.latencyMax : '',
      amountMin: activeFilters.includes('amount') ? filterValues.amountMin : '',
      amountMax: activeFilters.includes('amount') ? filterValues.amountMax : '',
      roundId: activeFilters.includes('roundId') ? filterValues.roundId : '',
    };

    setAppliedFilters(newFilters);
  };

  // Modify fetchTransactions to accept appliedFilters
  const fetchTransactions = (skip: number, take: number, filters: typeof appliedFilters) => {
    const queryParams = {
      skip,
      take,
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.userName && { userName: filters.userName }),
      ...(filters.latencyMin && { latencyMin: filters.latencyMin }),
      ...(filters.latencyMax && { latencyMax: filters.latencyMax }),
      ...(filters.amountMin && { amountMin: filters.amountMin }),
      ...(filters.amountMax && { amountMax: filters.amountMax }),
      ...(filters.roundId && { roundId: filters.roundId }),
      ...(filters.provider && { provider: filters.provider }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
      ...(filters.transactionId && { transactionId: filters.transactionId }),
    };
    triggerGetTransactions(queryParams as any);
  };

  const handleCopy = async (text: string) => {
    const success = await copy(text);
    if (success) {
      toast.success('Copied to clipboard!');
    } else {
      toast.error('Failed to copy');
    }
  };

  const handleOpenDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDrawerOpen(true);
  };

  const handleFilterValueChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveFilter = (id: string) => {
    setActiveFilters((prev) => prev.filter((filterId) => filterId !== id));
  };

  const filterOptions = [
    { id: 'userId', name: 'User ID' },
    { id: 'userName', name: 'User Name' },
    { id: 'latency', name: 'Latency' },
    { id: 'amount', name: 'Amount' },
    { id: 'roundId', name: 'Round ID' },
  ];

  const columns: ColumnDef<Transaction>[] = [
    {
      id: 'transactionId&requestId',
      header: () => (
        <div className="text-sm font-bold text-foreground whitespace-nowrap">
          Transaction Id and Request Id
        </div>
      ),
      cell: ({ row }) => (
        <div>
          <div className="flex gap-2 items-center mb-1 whitespace-nowrap">
            <Eye
              className="w-6 h-6 cursor-pointer hover:text-primary transition-colors"
              onClick={() => handleOpenDetails(row.original)}
            />
            <span className="text-sm">{row.original.transactionId}</span>
            <Copy
              className="w-6 h-6 md:w-4 md:h-4 cursor-pointer hover:text-primary transition-colors"
              onClick={() => handleCopy(row.original.transactionId)}
            />
          </div>
          <div className="text-muted-foreground text-sm">{row.original.reqId}</div>
        </div>
      ),
    },
    {
      accessorKey: 'userId',
      header: () => (
        <div className="text-sm font-bold text-foreground whitespace-nowrap">User Info</div>
      ),
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          <div className="text-sm whitespace-nowrap flex gap-2">
            {`${row.original.Users.username}/ ${row.original.Users.id}`}{' '}
            <Copy
              className="w-6 h-6 md:w-4 md:h-4 cursor-pointer hover:text-primary transition-colors"
              onClick={() => handleCopy(row.original.transactionId)}
            />
          </div>
          {row.original.Users.Platform.name ? (
            <div className="text-sm text-muted-foreground">
              {row.original.Users.username ?? '-'}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: () => (
        <div className="text-sm font-bold text-foreground whitespace-nowrap">Process Time</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-gray-500 whitespace-nowrap">
          {row.original.updatedAt
            ? // ? new Date(row.original.updatedAt).toString().split(' (')[0]
              new Date(row.original.updatedAt).toLocaleString()
            : '-'}
        </div>
      ),
    },
    {
      accessorKey: 'gameName',
      header: () => <div className="text-sm font-bold text-foreground whitespace-nowrap">Game</div>,
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          <div className="text-sm">{row.original.gameId}</div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: () => (
        <div className="text-sm font-bold text-foreground whitespace-nowrap">Status</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-medium px-2 py-1 rounded-full text-center whitespace-nowrap">
          {row.original.status}
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: () => (
        <div className="text-sm font-bold text-right text-foreground whitespace-nowrap">Amount</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-medium whitespace-nowrap">
          {row.original.amount.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'request',
      header: () => (
        <div className="text-sm font-bold text-foreground whitespace-nowrap">Request</div>
      ),
      cell: ({ row }) => <div className="text-sm whitespace-nowrap">{row.original.type}</div>,
    },
    {
      id: 'latency',
      header: () => (
        <div className="text-sm font-bold text-foreground whitespace-nowrap">Latency</div>
      ),
      cell: ({ row }) => {
        const ms = row.original.responseTime ?? 0;
        return (
          <div className="text-sm text-foreground whitespace-nowrap">
            {ms >= 1000 ? `${Math.floor(ms / 1000)}s ${ms % 1000}ms` : `${ms}ms`}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transactions</h1>
        <div className="flex flex-wrap items-end gap-4 w-full sm:w-auto">
          <DateTimeRangePicker onDateRangeChange={handleDateRangeChange} />
          <MultiSelect
            options={providers}
            placeholder="Select Provider"
            onChange={(values) => setSelectedProvider(values[0] || '')}
          />
          <ClearInput placeholder="Transaction ID" value={searchId} setValue={setSearchId} />

          {activeFilters.includes('userId') && (
            <div className="relative flex items-center gap-2">
              <ClearInput
                placeholder="User ID"
                value={filterValues.userId}
                setValue={(value) => handleFilterValueChange('userId', value)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleRemoveFilter('userId')}
              >
                <X className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          )}

          {activeFilters.includes('userName') && (
            <div className="relative flex items-center gap-2">
              <ClearInput
                placeholder="User Name"
                value={filterValues.userName}
                setValue={(value) => handleFilterValueChange('userName', value)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleRemoveFilter('userName')}
              >
                <X className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          )}

          {activeFilters.includes('latency') && (
            <div className="flex items-center gap-2">
              <div className="flex gap-2 items-center">
                <Input
                  className="w-[90px]"
                  placeholder="Min Latency"
                  value={filterValues.latencyMin}
                  onChange={(e) => handleFilterValueChange('latencyMin', e.target.value)}
                />
                <Input
                  className="w-[90px]"
                  placeholder="Max Latency"
                  value={filterValues.latencyMax}
                  onChange={(e) => handleFilterValueChange('latencyMax', e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleRemoveFilter('latency')}
              >
                <X className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          )}

          {activeFilters.includes('amount') && (
            <div className="flex items-center gap-2">
              <div className="flex gap-2 items-center">
                <Input
                  className="w-[90px]"
                  placeholder="Min Amount"
                  value={filterValues.amountMin}
                  onChange={(e) => handleFilterValueChange('amountMin', e.target.value)}
                />
                <Input
                  className="w-[90px]"
                  placeholder="Max Amount"
                  value={filterValues.amountMax}
                  onChange={(e) => handleFilterValueChange('amountMax', e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleRemoveFilter('amount')}
              >
                <X className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          )}

          {activeFilters.includes('roundId') && (
            <div className="relative flex items-center gap-2">
              <ClearInput
                placeholder="Round ID"
                value={filterValues.roundId}
                setValue={(value) => handleFilterValueChange('roundId', value)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleRemoveFilter('roundId')}
              >
                <X className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          )}

          <AddSelect
            options={filterOptions}
            activeFilters={activeFilters}
            onChange={setActiveFilters}
          />
          <Button onClick={handleApply} className="bg-primary text-white">
            Apply
          </Button>
        </div>
      </div>
      <DataTable
        data={transactionData?.data ?? []}
        columns={columns}
        totalItems={transactionData?.total ?? 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        isFetching={isFetching}
      />
      <TransactionDetailsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default TransactionsPage;