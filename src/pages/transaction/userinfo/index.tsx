import React, { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from './components/DataTable/DataTable';
import { UserInfoData, UserManagementData } from '@/types';
import ClearInput from '@/components/common/ClearInput';
import { useLazyGetUsersQuery, useLazyGetUserByIdAndNameQuery } from '@/store/api/userApi';
import { Pagination } from '@/components/common/Pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const dummyLogs = [
  {
    id: 41,
    remark: 'Login successfully',
    ipAddress: '49.43.0.128',
    loginAt: '2025-09-24T06:51:09.235Z',
    userId: 1056,
    device: 'desktop',
    user: {
      id: 1056,
      username: 'shivtest',
    },
  },
  {
    id: 40,
    remark: 'Login successfully',
    ipAddress: '49.43.0.9',
    loginAt: '2025-09-23T11:22:53.057Z',
    userId: 1056,
    device: 'desktop',
    user: {
      id: 1056,
      username: 'shivtest',
    },
  },
  // ... rest of dummy data
];

const UserInfoPage = () => {
  const [searchName, setSearchName] = useState<string>('');
  const [skip, setSkip] = useState<number>(0);
  const [take, setTake] = useState<number>(10);

  const [triggerGetUsers, { data: allUserData }] = useLazyGetUsersQuery();

  const [triggerInfo, { data: infoData }] = useLazyGetUserByIdAndNameQuery();

  // modal state
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    triggerGetUsers({ search: searchName, skip, take });
  }, [triggerGetUsers, skip, take]);

  const handleOpenLogs = (userId: number, username: string) => {
    setSelectedUserId(userId);
    triggerInfo({ userId: userId.toString(), username });
    setOpen(true);
  };

  const columns: ColumnDef<UserManagementData>[] = [
    {
      id: 'platformId',
      header: () => <div className="text-foreground text-sm font-bold">Operator ID</div>,
      cell: ({ row }) => <div>{row?.original?.Platform?.name || '-'}</div>,
    },
    {
      accessorKey: 'id',
      header: () => <div className="text-foreground text-sm font-bold">User ID</div>,
      cell: ({ row }) => (
        <button
          onClick={() => handleOpenLogs(row?.original?.id, row.original.username)}
          className="underline"
        >
          {row?.original?.id || '-'}
        </button>
      ),
    },
    {
      accessorKey: 'username',
      header: () => <div className="text-foreground text-sm font-bold">User Name</div>,
      cell: ({ row }) => <div>{row?.original?.username || '-'}</div>,
    },
  ];

  const users = allUserData?.data ?? [];
  const totalItems = allUserData?.count ?? 0;

  const pageIndex = Math.floor(skip / take);
  const pageCount = Math.ceil(totalItems / take);

  const filteredLogs = dummyLogs.filter((log) => log.userId === selectedUserId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">User Info</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <ClearInput placeholder="Enter User Name" value={searchName} setValue={setSearchName} />
          <Button
            onClick={() => triggerGetUsers({ search: searchName, skip, take })}
            className="bg-primary text-white w-full sm:w-auto"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable data={users} columns={columns} />

      {/* Pagination */}
      <Pagination
        pageSize={take}
        setPageSize={(size) => {
          setTake(size);
          setSkip(0);
        }}
        pageIndex={pageIndex}
        pageCount={pageCount}
        totalItems={totalItems}
        onNextPage={() => setSkip((prev) => prev + take)}
        onPreviousPage={() => setSkip((prev) => Math.max(prev - take, 0))}
        canPreviousPage={pageIndex > 0}
        canNextPage={pageIndex < pageCount - 1}
      />

      {/* Logs Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Logs</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">ID</th>
                  <th className="border px-2 py-1">Remark</th>
                  <th className="border px-2 py-1">IP Address</th>
                  <th className="border px-2 py-1">Login At</th>
                  <th className="border px-2 py-1">Device</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="border px-2 py-1">{log.id}</td>
                      <td className="border px-2 py-1">{log.remark}</td>
                      <td className="border px-2 py-1">{log.ipAddress}</td>
                      <td className="border px-2 py-1">{new Date(log.loginAt).toLocaleString()}</td>
                      <td className="border px-2 py-1">{log.device}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-2">
                      No logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserInfoPage;
