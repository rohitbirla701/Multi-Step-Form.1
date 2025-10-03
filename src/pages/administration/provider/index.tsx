import React, { ChangeEvent, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { DataTable } from './components/DataTable/DataTable';
import { CasinoProvider, ProviderManagementData } from '@/types';
import {
  useGetCasinoProvidersQuery,
  useUpdateProviderStatusMutation,
} from '@/store/api/ProviderApi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProviderManagementPage = () => {
  const { data: providersData, isLoading, isError } = useGetCasinoProvidersQuery();
  const [updateProviderStatus] = useUpdateProviderStatusMutation();
  const [searchTerm, setSearchTerm] = useState('');

  // 🔄 Format API response or fallback to mock data
  const formattedProviders: ProviderManagementData[] =
    providersData?.map((p: CasinoProvider, index: number) => ({
      id: String(index),
      name: p.provider,
      status: p.status,
    })) ?? [];

  // 🔍 Filter providers by search input
  const filteredProviders = useMemo(() => {
    if (!searchTerm) return formattedProviders;
    return formattedProviders.filter((provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, formattedProviders]);

  // ✅ Search handler
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // ✅ Toggle provider status
  const handleToggleStatus = async (name: string, newStatus: string) => {
    try {
      const res = await updateProviderStatus({ providerName: name, status: newStatus }).unwrap();
      toast.success(`All games for provider ${name} updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update provider status:', error);
      toast.error('Failed to update provider status');
    }
  };

  // 📊 DataTable column definitions
  const columns: ColumnDef<ProviderManagementData>[] = [
    {
      accessorKey: 'name',
      header: () => <div className="text-sm font-bold text-foreground">Providers</div>,
      cell: ({ row }) => (
        <div className="text-sm">
          <Link to={`/administration/provider-management/subproviders/${row.original.name}`}>
            {row.original.name}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: () => <div className="text-sm font-bold text-foreground">Is Active</div>,
      cell: ({ row }) => (
        <Switch
          checked={row.original.status.toLowerCase() === 'active' ? true : false}
          onCheckedChange={(checked) =>
            handleToggleStatus(row.original.name, checked ? 'ACTIVE' : 'INACTIVE')
          }
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 🔹 Header */}
      <div className="flex items-center sm:justify-between flex-wrap gap-2 justify-center">
        <h1 className="text-3xl font-bold tracking-tight">Provider Management</h1>
        <div className="grid sm:flex gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter Provider"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-8 max-w-sm"
            />
          </div>
        </div>
      </div>

      {/* 🔹 Data Table */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading providers...</p>
      ) : isError ? (
        <p className="text-sm text-red-500">Failed to load providers.</p>
      ) : (
        <DataTable data={filteredProviders} columns={columns} pageSize={10} />
      )}
    </div>
  );
};

export default ProviderManagementPage;
