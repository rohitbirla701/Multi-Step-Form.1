import React, { useState, ChangeEvent } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from './components/DataTable/DataTable';
import { FailedBetsData, AddInputSelect } from '@/types';
import { Input } from '@/components/ui/input';
import { RenderIcon } from '@/components/common/RenderIcon';
import { Copy, View } from '@/components/icons';
import AddSelect from '../transactions/components/AddSelect';
import { useClipboard } from '@/hooks';
import toast from 'react-hot-toast';
import TransactionModal from './TransactionModal';
import DateTimeRangePicker from '@/components/common/DateTimeRangePicker';
import InfoButton from './components/InfoButton';
import MultiSelect from '@/components/common/MultiSelect';

// Dummy Bets
export const dummyBets: FailedBetsData[] = [
  {
    betId: '191374667797',
    userId: 9744,
    userName: 'Rahaan1',
    operatorId: 'shiv247',
    operatorName: 'shiv247',
    subProviderName: 'SPRIBE',
    betTime: '27-Aug-2025 7:53:42 PM',
    gameName: 'Aviator',
    requestType: 'ROLLBACK',
  },
  {
    betId: '191374667798',
    userId: 9780,
    userName: 'Aryan23',
    operatorId: 'shiv248',
    operatorName: 'shiv248',
    subProviderName: 'EVOPLAY',
    betTime: '28-Aug-2025 10:15:12 AM',
    gameName: 'CrashX',
    requestType: 'CANCEL',
  },
  {
    betId: '191374667799',
    userId: 9822,
    userName: 'Neha99',
    operatorId: 'shiv249',
    operatorName: 'shiv249',
    subProviderName: 'PRAGMATIC',
    betTime: '29-Aug-2025 3:27:54 PM',
    gameName: 'Sweet Bonanza',
    requestType: 'ROLLBACK',
  },
  {
    betId: '191374667800',
    userId: 9865,
    userName: 'KaranX',
    operatorId: 'shiv250',
    operatorName: 'shiv250',
    subProviderName: 'HACKSAW',
    betTime: '30-Aug-2025 11:05:21 AM',
    gameName: 'Mines',
    requestType: 'CANCEL',
  },
];
const FailedBetsPage = () => {
  const { copy } = useClipboard();
  const [betList] = useState<FailedBetsData[]>(dummyBets);

  const [searchName, setSearchName] = useState<string>('');
  const [searchId, setSearchId] = useState<string>('');
  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);

  const [filterInputs, setFilterInputs] = useState<AddInputSelect[]>([
    { id: '1', isActive: false, name: 'Game Id', type: 'single' },
    { id: '2', isActive: false, name: 'Round Id', type: 'single' },
  ]);

  // Handlers
  const handleClearName = () => setSearchName('');
  const handleClearId = () => setSearchId('');

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value);
  const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => setSearchId(e.target.value);

  const handleSelectionChange = () => {
    console.log('selected');
  };

  const handleExport = () => {
    console.log('Exporting...');
  };

  const handleDelete = () => {
    console.log('Deleting...');
  };

  const handleSelectChange = (selectedIds: string[]) => {
    setFilterInputs((prev) => prev.map((f) => ({ ...f, isActive: selectedIds.includes(f.id) })));
  };

  const handleRemoveFilter = (id: string) => {
    setFilterInputs((prev) => prev.map((f) => (f.id === id ? { ...f, isActive: false } : f)));
  };

  const columns: ColumnDef<FailedBetsData>[] = [
    {
      accessorKey: 'betId',
      header: () => <div className="text-sm font-bold text-secondary-foreground">Bet Id</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.betId}</div>,
    },
    {
      accessorKey: 'userId',
      header: () => <div className="text-sm font-bold text-secondary-foreground">User Id</div>,
      cell: ({ row }) => (
        <div className="text-sm text-secondary-foreground">{row.original.userId}</div>
      ),
    },
    {
      accessorKey: 'userName',
      header: () => <div className="text-sm font-bold text-secondary-foreground">User Name</div>,
      cell: ({ row }) => (
        <div className="text-sm flex items-center gap-1">{row.original.userName} </div>
      ),
    },
    {
      accessorKey: 'operatorId',
      header: () => <div className="text-sm font-bold text-secondary-foreground">Operator Id</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.operatorId}</div>,
    },
    {
      accessorKey: 'operatorName',
      header: () => (
        <div className="text-sm font-bold text-secondary-foreground">Operator Name</div>
      ),
      cell: ({ row }) => <div className="text-sm">{row.original.operatorName}</div>,
    },
    {
      accessorKey: 'subProviderName',
      header: () => (
        <div className="text-sm font-bold text-secondary-foreground">Sub Provider Name</div>
      ),
      cell: ({ row }) => <div className="text-sm">{row.original.subProviderName}</div>,
    },
    {
      accessorKey: 'betTime',
      header: () => <div className="text-sm font-bold text-secondary-foreground">Bet Time</div>,
      cell: ({ row }) => (
        <div className="text-sm flex items-center gap-1">
          {new Date(row.original.betTime).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'gameName',
      header: () => <div className="text-sm font-bold text-secondary-foreground">Game Name</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.gameName}</div>,
    },
    {
      accessorKey: 'requestType',
      header: () => <div className="text-sm font-bold text-secondary-foreground">Request Type</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.requestType}</div>,
    },
    {
      id: 'action',
      header: () => <div className="text-sm font-bold text-secondary-foreground">Action</div>,
      cell: () => (
        <span>
          <RenderIcon src={View} />
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-bold">Failed Bets</h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-end">
          <DateTimeRangePicker />

          <MultiSelect placeholder="Request Type" options={['Result', 'Rollback']} />

          {/* Apply Button */}
          <Button className="bg-primary text-white w-full sm:w-auto">Apply</Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={betList}
        columns={columns}
        searchPlaceholder="Search users..."
        onSelectionChange={handleSelectionChange}
        onExport={handleExport}
        onDelete={handleDelete}
        enableSearch={false}
        enableFilters={false}
        enableExport={true}
        enableColumnVisibility={false}
        pageSize={10}
      />
    </div>
  );
};

export default FailedBetsPage;
