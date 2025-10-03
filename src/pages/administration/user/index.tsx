import React, { ChangeEvent, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Clock, MoreHorizontal, Edit, Trash2, Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from './components/DataTable/DataTable';
import { UserManagementData } from '@/types';
import { Switch } from '@/components/ui/switch';
import { SwitchThumb } from '@radix-ui/react-switch';
import { Input } from '@/components/ui/input';
import { useGetUsersQuery, useStatusUpdateMutation } from '@/store/api/userApi';
import ClearInput from '@/components/common/ClearInput';

const UserManagementPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchName, setSearchName] = useState<string>('');
  const [searchId, setSearchId] = useState<string>('');
  const [appliedSearch, setAppliedSearch] = useState<string>('');
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery({
    skip: (page - 1) * pageSize,
    take: pageSize,
    search: appliedSearch,
  });

  const [
    statusUpdate,
    { data: statusUpdateData, isLoading: isStatusUpdating, error: statusUpdateError },
  ] = useStatusUpdateMutation();
  const users = usersData?.data ?? [];

  const handleToggleStatus = async (userId: number, newStatus: string) => {
    try {
      await statusUpdate({ userId, status: newStatus }).unwrap();
      console.log('Status updated!');
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const handleApplySearch = () => {
    if (searchId) setAppliedSearch(searchId);
    else setAppliedSearch(searchName);
    setPage(1);
  };

  const columns: ColumnDef<UserManagementData>[] = [
    {
      accessorKey: 'platformId',
      header: () => <div className="text-sm font-bold text-foreground">Platform Id</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.platformId}</div>,
    },
    {
      accessorKey: 'platformName',
      header: () => <div className="text-sm font-bold text-foreground">Platform Name</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.Platform?.name}</div>,
    },
    {
      accessorKey: 'userId',
      header: () => <div className="text-sm font-bold text-foreground">User Id</div>,
      cell: ({ row }) => <div>{row.original.exclusiveId}</div>,
    },
    {
      accessorKey: 'userName',
      header: () => <div className="text-sm font-bold text-foreground">User Name</div>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <span className="text-sm">{row.original.username}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'ip',
      header: () => <div className="text-sm font-bold text-foreground">IP</div>,

      cell: ({ row }) => {
        const user = row.original;
        return <div className="flex items-center space-x-2">{user.ipAddress}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: () => <div className="text-sm font-bold text-foreground">Status</div>,
      cell: ({ row }) => {
        const user = row.original;
        const isActive = user.status === 'Active';

        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={isActive}
              onCheckedChange={async (checked) => {
                try {
                  await handleToggleStatus(user.id, checked ? 'Active' : 'Blocked');
                } catch (err) {
                  console.error('Status change failed', err);
                }
              }}
            />
          </div>
        );
      },
    },
  ];

  if (isUsersLoading) return <div>Loading users...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center sm:justify-between flex-wrap gap-2 justify-center">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <div className="grid sm:flex gap-4 flex-wrap">
          <ClearInput placeholder="User Name" value={searchName} setValue={setSearchName} />
          <ClearInput placeholder="User Id" value={searchId} setValue={setSearchId} />
          <Button
            disabled={!searchId && !searchName}
            className="bg-primary text-white"
            onClick={handleApplySearch}
          >
            Apply
          </Button>
          <Button className="bg-exportBtn text-white hover:bg-exportBtn/90">Export</Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={{
          data: usersData?.data ?? [],
          count: usersData?.count ?? 0,
        }}
        columns={columns}
        searchPlaceholder="Search users..."
        enableSearch={false}
        enableFilters={true}
        enableSelection={false}
        enableExport={true}
        enableColumnVisibility={true}
        pageSize={pageSize}
        currentPage={page}
        onPageChange={(newPage: number) => setPage(newPage)}
        setPageSize={setPageSize}
      />
    </div>
  );
};

export default UserManagementPage;
