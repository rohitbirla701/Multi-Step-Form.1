import React, { ChangeEvent, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { DataTable } from './components/DataTable/DataTable';
import { SubProviderResponse } from '@/types';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Link, useParams } from 'react-router-dom';
import { RenderIcon } from '@/components/common/RenderIcon';
import { Back } from '@/components/icons';
import {
  useGetSubProvidersByNameQuery,
  useUpdateSubProviderStatusMutation,
} from '@/store/api/ProviderApi';
import toast from 'react-hot-toast';

const SubProviderManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { provider } = useParams();
  const {
    data: subProvidersData,
    isLoading,
    isError,
  } = useGetSubProvidersByNameQuery(provider ?? '');

  const [updateSubProviderStatus] = useUpdateSubProviderStatusMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleCheckedChange = async (subProviderName: string, currentStatus: string) => {
    const newStatus = currentStatus.toLowerCase() === 'active' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateSubProviderStatus({
        providerName: provider!,
        subProviderName,
        status: newStatus,
      }).unwrap();
      toast.success(`User status changed to "${status}"`);
    } catch (err) {
      console.error('Failed to update sub-provider status:', err);
      toast.error('Failed to update user status');
    }
  };

  const columns: ColumnDef<SubProviderResponse>[] = [
    {
      id: 'name',
      header: () => <div className="text-sm font-bold text-foreground">Provider</div>,
      cell: ({ row }) => <div className="text-sm">{provider ?? '-'}</div>,
    },
    {
      accessorKey: 'subProvider',
      header: () => <div className="text-sm font-bold text-foreground">SubProvider</div>,
      cell: ({ row }) => <div className="text-sm">{row.original.subProvider}</div>,
    },
    {
      accessorKey: 'status',
      header: () => <div className="text-sm font-bold text-foreground">Is Active</div>,
      cell: ({ row }) => (
        <Switch
          checked={row.original.status.toLowerCase() === 'active'}
          onCheckedChange={() => handleCheckedChange(row.original.subProvider, row.original.status)}
        />
      ),
    },
  ];

  const filteredData = subProvidersData?.filter((item) =>
    item.subProvider.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex gap-6 items-center">
          <Link to={'/administration/provider-management'}>
            <RenderIcon src={Back} />
          </Link>
          {`${provider}/SubProviders`}
        </h1>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={'Enter Provider'}
            value={searchTerm}
            onChange={handleChange}
            className="pl-8 max-w-sm"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable data={filteredData ?? []} columns={columns} pageSize={10} />
    </div>
  );
};

export default SubProviderManagementPage;
