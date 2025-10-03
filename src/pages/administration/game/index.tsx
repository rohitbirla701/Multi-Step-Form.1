import React, { ChangeEvent, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Clock, MoreHorizontal, Edit, Trash2, Search, X, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from './components/DataTable/DataTable';
import { CasinoGame } from '@/types';
import { Switch } from '@/components/ui/switch';
import { SwitchThumb } from '@radix-ui/react-switch';
import { Input } from '@/components/ui/input';
import { Link, useParams } from 'react-router-dom';
import { RenderIcon } from '@/components/common/RenderIcon';
import { Back } from '@/components/icons';
import { BetLimitModal } from './components/BetLimitModal';
import MultiSelect from '@/components/common/MultiSelect';
import { useGetCasinoGamesQuery, useUpdateCasinoGameStatusMutation } from '@/store/api/gameApi';
import { useGetCasinoProvidersQuery, useGetSubProvidersByNameQuery } from '@/store/api/ProviderApi';
import toast from 'react-hot-toast';

const GameManagementPage = () => {
  // const [providers, setProviders] = useState<GameManagementData[]>(mockGameManagementData);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<CasinoGame | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedSubProviders, setSelectedSubProviders] = useState<string[]>([]);

  const {
    data: gamesData,
    isLoading: gamesIsLoading,
    isError: gamesIsError,
    refetch,
  } = useGetCasinoGamesQuery({
    skip: page * pageSize,
    take: pageSize,
    search: searchTerm,
    providers: selectedProvider ? [selectedProvider] : undefined,
    subProviders: selectedSubProviders.length > 0 ? selectedSubProviders : undefined,
  });

  const {
    data: providersData,
    isLoading: isProviderLoading,
    isError,
  } = useGetCasinoProvidersQuery();

  const { data: subProviders = [], isLoading: isSubProviderLoading } =
    useGetSubProvidersByNameQuery(selectedProvider ?? '', {
      skip: !selectedProvider,
    });

  const providerOptions = providersData?.map((item) => item.provider) || [];
  const subProviderOptions = useMemo(() => {
    if (!selectedProvider) return [];
    return subProviders.map((item) => item.subProvider);
  }, [selectedProvider, subProviders]);

  const [updateCasinoGameStatus] = useUpdateCasinoGameStatusMutation();

  const games = gamesData?.data || [];

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    setPage(0);
    setPageSize(10);
  };

  const handleStatusChange = async (game: CasinoGame) => {
    const newStatus = game.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await updateCasinoGameStatus({ id: game.id, status: newStatus }).unwrap();
      console.log('test', res);
      toast.success(`Game ${game.name} status updated to ${newStatus}`);
      console.log(`Game ${game.name} status updated to ${newStatus}`);
      refetch();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // 🔹 Open modal when edit icon is clicked
  const handleEdit = (game: CasinoGame): void => {
    setSelectedGame(game);
    setOpen(true);
  };

  const columns: ColumnDef<CasinoGame>[] = [
    {
      accessorKey: 'gameId',
      header: () => <div className="text-sm font-bold text-foreground">Game ID</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.id}</div>,
    },
    {
      accessorKey: 'gameName',
      header: () => <div className="text-sm font-bold text-foreground">Game Name</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.name}</div>,
    },
    {
      accessorKey: 'category',
      header: () => <div className="text-sm font-bold text-foreground">Category</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.category}</div>,
    },
    {
      accessorKey: 'status',
      header: () => <div className="text-sm font-bold text-foreground">Active</div>,
      cell: ({ row }) => {
        const game = row.original;
        return (
          <Switch
            checked={game.status === 'ACTIVE'}
            onCheckedChange={() => handleStatusChange(game)}
          >
            <SwitchThumb />
          </Switch>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-sm font-bold text-foreground">Actions</div>,
      cell: ({ row }) => {
        const game = row.original;
        return (
          <Button variant="ghost" size="icon" onClick={() => handleEdit(game)}>
            <Pencil className="h-4 w-4 text-foreground" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center sm:justify-between flex-wrap gap-2 justify-center">
        <h1 className="text-3xl font-bold tracking-tight flex gap-6 items-center">
          Game Management
        </h1>
        <div className=" grid sm:flex gap-4 flex-wrap">
          <MultiSelect
            placeholder="Select Provider"
            options={providerOptions}
            multiple={false}
            onChange={(selected) => {
              setSelectedProvider(selected[0] ?? null);
              setPage(0);
            }}
          />
          <MultiSelect
            placeholder="Select Sub Provider"
            options={subProviderOptions}
            onChange={(selected) => {
              setSelectedSubProviders(selected);
              setPage(0);
            }}
          />
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={'Enter Game Name'}
              value={searchTerm}
              onChange={handleChange}
              className="pl-8 max-w-sm"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={{
          data: gamesData?.data ?? [],
          total: gamesData?.total ?? 0,
        }}
        columns={columns}
        pageSize={pageSize}
        currentPage={page}
        onPageChange={(newPage: number) => setPage(newPage)}
        setPageSize={setPageSize}
      />

      {/* Bet Limit Modal */}
      <BetLimitModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(values) => {
          console.log('Submitted values:', values, 'for game:', selectedGame);
          setOpen(false);
        }}
      />
    </div>
  );
};

export default GameManagementPage;
