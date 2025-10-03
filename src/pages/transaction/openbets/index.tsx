import React, { useState, ChangeEvent, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from './components/DataTable/DataTable';
import { Input } from '@/components/ui/input';
import { RenderIcon } from '@/components/common/RenderIcon';
import { Copy } from '@/components/icons';
import AddSelect from '../transactions/components/AddSelect';
import { useClipboard } from '@/hooks';
import toast from 'react-hot-toast';
import TransactionModal from './TransactionModal';
import DateTimeRangePicker from '@/components/common/DateTimeRangePicker';
import InfoButton from './components/InfoButton';
import MultiSelect from '@/components/common/MultiSelect';
import ClearInput from '@/components/common/ClearInput';
import { useGetCasinoProvidersQuery } from '@/store/api/ProviderApi';
import { useLazyGetTransactionsQuery } from '@/store/api/TransactionApi';
import { Pagination } from '@/components/common/Pagination';
import dayjs from 'dayjs';

export interface Transaction {
  id: number;
  transactionId: string;
  reqId: string;
  userId: number;
  gameId: number;
  roundId: string;
  amount: number;
  type: string;
  status: string;
  balance: number;
  response: {
    status: string;
    balance: number;
  };
  request: {
    reqId: string;
    token: string;
    gameId: string;
    userId: string;
    betType: string;
    roundId: string;
    PartnerId: string;
    creditAmount: number;
    transactionId: string;
  };
  responseTime: number;
  createdAt: string;
  updatedAt: string;
  Users: {
    id: number;
    username: string;
    Platform: {
      id: string;
      name: string;
    };
  };
  Games?: {
    id: number;
    name: string;
    provider: string;
    subProvider: string;
  };
}

const OpenBetsPage = () => {
  const { copy } = useClipboard();
  const { data: providersData } = useGetCasinoProvidersQuery();
  const providerList = (providersData ?? []).map((p) => p.provider);
  const [selectedProvider, setSelectedProvider] = useState<string[]>([]);
  const [searchName, setSearchName] = useState<string>('');
  const [searchId, setSearchId] = useState<string>('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [triggerGetTransactions, { data: transactionData, isFetching }] =
    useLazyGetTransactionsQuery();

  // Table Columns
  const columns: ColumnDef<Transaction>[] = [
    {
      id: 'UserName',
      header: () => (
        <div className="text-sm font-bold text-secondary-foreground">User Name/ User Id</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm flex items-center gap-1">{row.original.Users?.username}</div>
      ),
    },
    {
      id: 'transactionId',
      header: () => <div className="text-sm font-bold text-secondary-foreground">Bet Id</div>,
      cell: ({ row }) => <div className="text-sm">{row.original?.transactionId}</div>,
    },
    {
      id: 'operatorId',
      header: () => <div className="text-sm font-bold text-secondary-foreground">Operator Id</div>,
      cell: ({ row }) => <div className="text-sm">{row.original?.Users?.Platform?.name}</div>,
    },
    {
      id: 'roundId',
      header: () => <div className="text-sm font-bold text-secondary-foreground">Round Id</div>,
      cell: ({ row }) => <div className="text-sm">{row.original?.roundId}</div>,
    },
    {
      id: 'supplierName',
      header: () => (
        <div className="text-sm font-bold text-secondary-foreground">Supplier Name</div>
      ),
      cell: ({ row }) => <div className="text-sm">{row.original.Games?.subProvider}</div>,
    },
    {
      id: 'gameName',
      header: () => <div className="text-sm font-bold text-secondary-foreground">Game Name</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.Games?.name}</div>,
    },
    {
      accessorKey: 'betTime',
      header: () => <div className="text-sm font-bold text-secondary-foreground">Bet Time</div>,
      cell: ({ row }) => (
        <div className="text-sm flex items-center gap-1">
          <span>{new Date(row.original?.createdAt).toLocaleString()}</span>
        </div>
      ),
    },
  ];

  const [range, setRange] = useState({
    startDate: (dayjs().subtract(7, 'day').toDate().toISOString() as string) || null,
    endDate: (dayjs().toDate().toISOString() as string) || null,
  });

  const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
    setRange({ startDate, endDate });
  };

  const fetchTransactions = () => {
    triggerGetTransactions({
      skip: pageIndex * pageSize,
      take: pageSize,
      userId: searchId || undefined,
      username: searchName || undefined,
      startDate: range?.startDate || undefined,
      endDate: range?.endDate || undefined,
      status: 'PENDING',
      provider: selectedProvider.length ? selectedProvider : undefined,
    });
  };
  useEffect(() => {
    fetchTransactions();
  }, [pageIndex, pageSize]);

  // 🔹 Called on Apply button
  const applyFilters = () => {
    setPageIndex(0); // reset to first page
    fetchTransactions();
  };
  const totalItems = transactionData?.total ?? 0;
  const pageCount = Math.ceil(totalItems / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between  flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-bold">Open Bets</h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-end flex-wrap">
          <DateTimeRangePicker onDateRangeChange={handleDateRangeChange} />
          <div>
            <div>Provider</div>
            <MultiSelect options={providerList} placeholder="All" onChange={setSelectedProvider} />
          </div>

          {/* User Id Input */}
          <ClearInput placeholder="Enter User Id" value={searchId} setValue={setSearchId} />

          {/* User Name Input */}
          <ClearInput placeholder="Enter User Name" value={searchName} setValue={setSearchName} />

          {/* Apply Button */}
          <Button onClick={applyFilters} className="bg-primary text-white">
            Apply
          </Button>

          {/* Export Button */}
          <Button className="bg-exportBtn text-white hover:bg-exportBtn/80">Export Excel</Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={transactionData?.data ?? []}
        columns={columns}
        searchPlaceholder="Search users..."
        enableSearch={false}
        enableFilters={false}
        enableExport={true}
        enableColumnVisibility={false}
        pageSize={10}
      />

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

export default OpenBetsPage;
