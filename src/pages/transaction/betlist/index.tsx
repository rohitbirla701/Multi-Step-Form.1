import React, { useState, ChangeEvent, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { CopyIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from './components/DataTable/DataTable';
import { BetListResponse, AddInputSelect } from '@/types';
import { useGetCasinoProvidersQuery } from '@/store/api/ProviderApi';
import AddSelect from '../transactions/components/AddSelect';
import { useClipboard } from '@/hooks';
import toast from 'react-hot-toast';
import TransactionModal from './components/TransactionModal';
import DateTimeRangePicker from '@/components/common/DateTimeRangePicker';
import InfoButton from './components/InfoButton';
import ClearInput from '@/components/common/ClearInput';
import { useLazyGetBetListQuery, useLazyGetTransactionsQuery } from '@/store/api/TransactionApi';
import MultiSelect from '@/components/common/MultiSelect';
import { Pagination } from '@/components/common/Pagination';
import dayjs from 'dayjs';

const BetListPage = () => {
  const { copy } = useClipboard();
  const [selectedTransactionId, setSelectedTransactionId] = useState<string>('');
  const [triggerbetList, { data: betData }] = useLazyGetBetListQuery();
  const { data: providersData } = useGetCasinoProvidersQuery();
  const providers = (providersData ?? []).map((p) => p.provider);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string[] | null>(null);
  const [transactionId, setTransactionId] = useState<string>('');
  const [getTransactions, { data: logData, error, isLoading, isFetching }] =
    useLazyGetTransactionsQuery();
  // Pagination state
  const [skip, setSkip] = useState<number>(0);
  const [take, setTake] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: (dayjs().subtract(7, 'day').toDate().toISOString() as string) || null,
    endDate: (dayjs().toDate().toISOString() as string) || null,
  });

  const handleDateChange = (startDate: string | null, endDate: string | null) => {
    setDateRange({
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
    });
  };

  // Search inputs
  const [searchName, setSearchName] = useState<string>('');
  const [searchId, setSearchId] = useState<string>('');
  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);

  // Filter options for AddSelect
  const [filterInputs, setFilterInputs] = useState<AddInputSelect[]>([
    { id: '1', isActive: false, name: 'Game Id', type: 'single' },
    { id: '2', isActive: false, name: 'Round Id', type: 'single' },
  ]);

  // Filter values
  const [gameIdValue, setGameIdValue] = useState('');
  const [roundIdValue, setRoundIdValue] = useState('');

  const handleCopy = async (text: string) => {
    const success = await copy(text);
    if (success) toast.success('Copied to clipboard!');
    else toast.error('Failed to copy');
  };

  const handleAction = (option: string, transactionId: string, roundId: string) => {
    getTransactions({
      transactionId,
      roundId,
    } as any);
    if (option === 'Transaction Logs') {
      setOpenTransactionModal(true);
      setSelectedTransactionId(transactionId);
    }
  };

  // Handle AddSelect change
  const handleSelectChange = (selectedIds: string[]) => {
    console.log('Selected IDs:', selectedIds);

    setFilterInputs((prev) =>
      prev.map((filter) => ({
        ...filter,
        isActive: selectedIds.includes(filter.id),
      }))
    );

    setActiveFilters(selectedIds);
  };

  // Clear individual filter functions
  const clearGameIdFilter = () => {
    setGameIdValue('');
    setFilterInputs((prev) => prev.map((f) => (f.id === '1' ? { ...f, isActive: false } : f)));
    setActiveFilters((prev) => prev.filter((id) => id !== '1'));
  };

  const clearRoundIdFilter = () => {
    setRoundIdValue('');
    setFilterInputs((prev) => prev.map((f) => (f.id === '2' ? { ...f, isActive: false } : f)));
    setActiveFilters((prev) => prev.filter((id) => id !== '2'));
  };

  useEffect(() => {
    triggerbetList({ skip, take });
  }, [skip, take, triggerbetList]);

  // Pagination handlers
  const handlePageSizeChange = (newPageSize: number) => {
    setTake(newPageSize);
    setPageIndex(0);
    setSkip(0);
  };

  const handleNextPage = () => {
    const newPageIndex = pageIndex + 1;
    setPageIndex(newPageIndex);
    setSkip(newPageIndex * take);
  };

  const handlePreviousPage = () => {
    const newPageIndex = pageIndex - 1;
    setPageIndex(newPageIndex);
    setSkip(newPageIndex * take);
  };

  // Calculate pagination values
  const betTableData = betData?.data ?? [];
  const totalItems = betData?.total ?? 0;
  const pageCount = Math.ceil(totalItems / take);
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  // Table Columns
  const columns: ColumnDef<BetListResponse>[] = [
    {
      accessorKey: 'betId',
      header: () => <div className="text-sm font-bold">Bet Id</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm whitespace-nowrap">
          <span>{row.original.betId}</span>
          <CopyIcon
            className="w-4 h-4 cursor-pointer"
            onClick={() => handleCopy(row.original.betId)}
          />
        </div>
      ),
    },
    {
      accessorKey: 'userName',
      header: () => <div className="text-sm font-bold">User Name</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.userName}</div>,
    },
    {
      accessorKey: 'providerName',
      header: () => <div className="text-sm font-bold">Provider</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.providerName}</div>,
    },
    {
      accessorKey: 'subProviderName',
      header: () => <div className="text-sm font-bold">Sub Provider</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.subProviderName}</div>,
    },
    {
      accessorKey: 'operatorId',
      header: () => <div className="text-sm font-bold">Operator Id</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.operatorId}</div>,
    },
    {
      id: 'betTime',
      header: () => <div className="text-sm font-bold">Bet Time</div>,
      cell: ({ row }) => (
        <div className="text-sm">{new Date(row.original.createdAt).toLocaleString()}</div>
      ),
    },
    {
      accessorKey: 'roundId',
      header: () => <div className="text-sm font-bold">Round Id</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm whitespace-nowrap">
          <span>{row.original.roundId}</span>
          <CopyIcon
            className="w-4 h-4 cursor-pointer"
            onClick={() => handleCopy(row.original.roundId)}
          />
        </div>
      ),
    },
    {
      accessorKey: 'gameName',
      header: () => <div className="text-sm font-bold">Game Name</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.gameName}</div>,
    },
    {
      accessorKey: 'stake',
      header: () => <div className="text-sm font-bold">Stake</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.stake}</div>,
    },
    {
      accessorKey: 'win',
      header: () => <div className="text-sm font-bold">Win</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.win}</div>,
    },
    {
      id: 'rollback',
      header: () => <div className="text-sm font-bold">Rollback</div>,
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.status.toLowerCase() === 'rollback' ? row.original.stake : 0}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: () => <div className="text-sm font-bold">Status</div>,
      cell: ({ row }) => <span className={`px-2 py-1 rounded text-sm`}>{row.original.status}</span>,
    },
    {
      id: 'action',
      header: () => <div className="text-sm font-bold">Action</div>,
      cell: ({ row }) => (
        // <div onClick={() => {}}>
        <InfoButton
          onOptionClick={(option) =>
            handleAction(option, row?.original?.betId, row?.original?.roundId)
          }
        />
        // </div>
      ),
    },
  ];

  // utils/applyFilters.ts or inside your component

  const applyFilters = () => {
    const payload: any = {
      skip,
      take,
      startDate: dateRange?.startDate || undefined,
      endDate: dateRange?.endDate || undefined,
      transactionId,
      userId: searchId ? Number(searchId) : undefined,
      username: searchName || undefined,
      provider: selectedProvider || undefined,
    };

    // only include gameId if filter is active & has value
    if (filterInputs.find((f) => f.id === '1')?.isActive && gameIdValue) {
      payload.gameId = gameIdValue;
    }

    // only include roundId if filter is active & has value
    if (filterInputs.find((f) => f.id === '2')?.isActive && roundIdValue) {
      payload.roundId = roundIdValue;
    }

    triggerbetList(payload);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Bet List</h1>

        <div className="flex flex-wrap items-end gap-4 w-full sm:w-auto">
          <DateTimeRangePicker onDateRangeChange={handleDateChange} />
          <MultiSelect
            multiple={true}
            options={providers}
            placeholder="Select Provider"
            onChange={(values) => setSelectedProvider(values)}
          />

          {/* Transaction Id Input */}
          <ClearInput
            placeholder="Transaction Id"
            value={transactionId}
            setValue={setTransactionId}
          />

          {/* User Id Input */}
          <ClearInput placeholder="Enter User Id" value={searchId} setValue={setSearchId} />

          {/* User Name Input */}
          <ClearInput placeholder="Enter User Name" value={searchName} setValue={setSearchName} />

          {/* Game ID Filter */}
          {filterInputs.find((f) => f.id === '1')?.isActive && (
            <div className="flex items-center gap-2">
              <ClearInput
                placeholder="Game ID"
                value={gameIdValue}
                setValue={setGameIdValue}
                className="w-[180px]"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-destructive/10"
                onClick={clearGameIdFilter}
                title="Remove filter"
              >
                <X className="h-5 w-5 text-gray-500 hover:text-destructive" />
              </Button>
            </div>
          )}

          {/* Round ID Filter */}
          {filterInputs.find((f) => f.id === '2')?.isActive && (
            <div className="flex items-center gap-2">
              <ClearInput
                placeholder="Round ID"
                value={roundIdValue}
                setValue={setRoundIdValue}
                className="w-[180px]"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-destructive/10"
                onClick={clearRoundIdFilter}
                title="Remove filter"
              >
                <X className="h-5 w-5 text-gray-500 hover:text-destructive" />
              </Button>
            </div>
          )}

          {/* Add Select */}
          <AddSelect
            activeFilters={activeFilters}
            options={filterInputs}
            onChange={handleSelectChange}
          />

          {/* Apply Button */}
          <Button onClick={applyFilters} className="bg-primary text-white">
            Apply
          </Button>
          {/* Export Button */}
          <Button className="bg-exportBtn text-white hover:bg-exportBtn/80">Export Excel</Button>
        </div>
      </div>

      {/* Table without built-in pagination */}
      <DataTable
        data={betTableData}
        columns={columns}
        showPagination={false} // Add this prop to DataTable to hide built-in pagination
      />

      {/* Custom Pagination Component */}
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
        data={logData?.data ?? []}
        transactionId={selectedTransactionId}
        open={openTransactionModal}
        onOpenChange={setOpenTransactionModal}
      />
    </div>
  );
};

export default BetListPage;
