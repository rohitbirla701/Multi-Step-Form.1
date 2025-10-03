import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { GameListData, UserRole } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { DataTable } from './components/DataTable/DataTable';
import GameCardGrid from './components/Card/GameCardGrid';
import MultiSelect from '@/components/common/MultiSelect';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

export const mockGameListData: GameListData[] = [
  {
    gameId: '1',
    gameName: 'Mega Fortune',
    gameCode: 'MF001',
    provider: 'NetEnt',
    subProvider: 'Jackpot Series',
    category: 'Slots',
  },
  {
    gameId: '2',
    gameName: 'Starburst',
    gameCode: 'SB002',
    provider: 'NetEnt',
    subProvider: 'Classic Slots',
    category: 'Slots',
  },
  {
    gameId: '3',
    gameName: 'Blackjack Classic',
    gameCode: 'BJ003',
    provider: 'Evolution',
    subProvider: 'Table Games',
    category: 'Card',
  },
  {
    gameId: '4',
    gameName: 'Roulette Royale',
    gameCode: 'RR004',
    provider: 'Evolution',
    subProvider: 'Table Games',
    category: 'Roulette',
  },
  {
    gameId: '5',
    gameName: 'Lightning Baccarat',
    gameCode: 'LB005',
    provider: 'Pragmatic Play',
    subProvider: 'Live Casino',
    category: 'Baccarat',
  },
  {
    gameId: '6',
    gameName: 'Gonzo’s Quest',
    gameCode: 'GQ006',
    provider: 'NetEnt',
    subProvider: 'Adventure Slots',
    category: 'Slots',
  },
  {
    gameId: '7',
    gameName: 'Dream Catcher',
    gameCode: 'DC007',
    provider: 'Evolution',
    subProvider: 'Wheel Games',
    category: 'Wheel',
  },
];

const GameListPage = () => {
  const [users] = useState<GameListData[]>(mockGameListData);

  const columns: ColumnDef<GameListData>[] = [
    {
      accessorKey: 'gameId',
      header: () => <div className="text-sm font-bold text-foreground">GameId</div>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-3">
            <div>{row.original.gameId}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'gameName',
      header: () => <div className="text-sm font-bold text-foreground">Gamename</div>,
      cell: ({ row }) => <div>{row.original.category}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'gameCode',
      header: () => <div className="text-sm font-bold text-foreground">GameCode</div>,
      cell: ({ row }) => <div>{row.original.category}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'provider',
      header: () => <div className="text-sm font-bold text-foreground">Provider</div>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <span>{row.original.provider}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'subProvider',
      header: () => <div className="text-sm font-bold text-foreground">Subprovider</div>,
      cell: ({ row }) => <div>{row.original.subProvider}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'category',
      header: () => <div className="text-sm font-bold text-foreground">Category</div>,
      cell: ({ row }) => <div>{row.original.category}</div>,
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const tabs = [
    { value: 'all', label: 'All Games', contentType: 'table' },
    { value: 'latest', label: 'Latest Games', contentType: 'table' },
    { value: 'disabled', label: 'Disabled Games', contentType: 'table' },
    { value: 'trending', label: 'Trending Games', contentType: 'text' },
    { value: 'top', label: 'Top Providers', contentType: 'text' },
  ];
  const currencies = ['INR', 'USD', 'PTS'];
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight w-full sm:w-auto mb-4 sm:mb-0">
          Game List
        </h1>

        {/* Form and Buttons */}
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          {/* MultiSelect Filters */}
          <MultiSelect options={currencies} placeholder="Select Provider" />
          <MultiSelect options={currencies} placeholder="Select Supplier" />
          <MultiSelect options={currencies} placeholder="Select Category" />

          {/* Apply and Export Buttons */}
          <div className="w-full sm:w-auto flex gap-4">
            <Button className="bg-primary text-white w-full sm:w-auto">
              Apply
            </Button>
            <Button className="bg-exportBtn text-white hover:bg-exportBtn/90 w-full sm:w-auto">
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <div className='overflow-x-auto'>
          <TabsList className="flex justify-start">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="p-4">
            {tab.contentType === 'table' ? (
              <DataTable data={users} columns={columns} pageSize={10} />
            ) : (
              <GameCardGrid />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default GameListPage;
