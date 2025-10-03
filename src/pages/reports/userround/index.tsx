'use client';

import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from './components/DataTable/DataTable';
import { RoundReportData } from '@/types';
import { Input } from '@/components/ui/input';

export const mockReportData: RoundReportData[] = [
  {
    userId: 9654,
    userName: 'NikhilTest',
    turnover: 200,
    winAmount: 260,
    rollbackAmount: 0,
    ggrAmount: -60,
    averageBet: 200,
    totalWon: 1,
    totalLost: 0,
    totalRollback: 0,
    marginPercent: -30.0,
    roundId: 9654,
  },
];

const UserRoundReportPage = () => {
  const [users] = useState<RoundReportData[]>(mockReportData);

  const columns: ColumnDef<RoundReportData>[] = [
    {
      accessorKey: 'roundId',
      header: () => <div className="text-sm font-bold text-header-table">Round ID/UserName</div>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-3 font-sm">
            <div>
              {user.roundId} {user.userName}
            </div>
          </div>
        );
      },
      footer: () => <div className="font-bold">Total</div>,
    },
    {
      accessorKey: 'turnover',
      header: () => <div className="text-sm font-bold text-header-table">Turnover</div>,
      cell: ({ row }) => <div>{row.getValue('turnover')}</div>,
      footer: () => <div className="font-bold">200.00</div>,
    },
    {
      accessorKey: 'winAmount',
      header: () => <div className="text-sm font-bold text-header-table">WinAmount</div>,
      cell: ({ row }) => <div>{row.getValue('winAmount')}</div>,
      footer: () => <div className="font-bold">260.00</div>,
    },
    {
      accessorKey: 'rollbackAmount',
      header: () => <div className="text-sm font-bold text-header-table">RollbackAmount</div>,
      cell: ({ row }) => <div>{row.getValue('rollbackAmount')}</div>,
      footer: () => <div className="font-bold">0.00</div>,
    },
    {
      accessorKey: 'ggrAmount',
      header: () => <div className="text-sm font-bold text-header-table">GGRAmount</div>,
      cell: ({ row }) => <div>{row.getValue('ggrAmount')}</div>,
      footer: () => <div className="font-bold">-60</div>,
    },
    {
      accessorKey: 'averageBet',
      header: () => <div className="text-sm font-bold text-header-table">Average Bet</div>,
      cell: ({ row }) => <div>{row.getValue('averageBet')}</div>,
      footer: () => <div className="font-bold">200.00</div>,
    },
    {
      accessorKey: 'totalWon',
      header: () => <div className="text-sm font-bold text-header-table">Total Won</div>,
      cell: ({ row }) => <div>{row.getValue('totalWon')}</div>,
      footer: () => <div className="font-bold">1</div>,
    },
    {
      accessorKey: 'totalLost',
      header: () => <div className="text-sm font-bold text-header-table">Total Lost</div>,
      cell: ({ row }) => <div>{row.getValue('totalLost')}</div>,
      footer: () => <div className="font-bold">0</div>,
    },
    {
      accessorKey: 'totalRollback',
      header: () => <div className="text-sm font-bold text-header-table">Total Rollback</div>,
      cell: ({ row }) => <div>{row.getValue('totalRollback')}</div>,
      footer: () => <div className="font-bold">0</div>,
    },
    {
      accessorKey: 'marginPercent',
      header: () => <div className="text-sm font-bold text-header-table">Margin in %</div>,
      cell: ({ row }) => {
        const value = row.getValue<number>('marginPercent');
        return <span className={value < 0 ? 'text-red-500' : 'text-green-600'}>{value}%</span>;
      },
      footer: () => <div className="font-bold text-red-500">-30.00</div>,
    },
  ];

  const handleExport = () => {
    alert(`Exporting report...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Round Report / User Round Report</h1>
        </div>
        <div className="flex space-x-2 items-center">
          <Button className="bg-primary text-white" onClick={handleExport}>
            Export
          </Button>
          <div className="text-sm text-gray-500">Operator Id: shiv247</div>
        </div>
      </div>
      <DataTable data={users} columns={columns} pageSize={10} />
    </div>
  );
};

export default UserRoundReportPage;
