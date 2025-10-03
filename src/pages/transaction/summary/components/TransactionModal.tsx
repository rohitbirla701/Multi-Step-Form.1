import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';

interface LogData {
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
    creditAmount?: number;
    debitAmount?: number;
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
}

const columns: ColumnDef<any>[] = [
  { accessorKey: 'sr', header: 'S.No' },
  { accessorKey: 'requestType', header: 'Request Type' },
  {
    accessorKey: 'request',
    header: 'Request',
    cell: ({ getValue }) => <JsonSyntaxHighlighter data={getValue() as any} />,
  },
  {
    accessorKey: 'response',
    header: 'Response',
    cell: ({ getValue }) => <JsonSyntaxHighlighter data={getValue() as any} />,
  },
  { accessorKey: 'responseTime', header: 'Response Time' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <JsonSyntaxHighlighter data={getValue() as any} />,
  },
];

// JSON Syntax Highlighter component with empty object fix
const JsonSyntaxHighlighter: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null;

  if (typeof data === 'object' && Object.keys(data).length === 0) {
    return (
      <pre
        className="p-2 rounded text-xs overflow-x-auto"
        style={{ fontFamily: 'monospace' }}
      >
        {'{} (empty)'}
      </pre>
    );
  }

  const jsonString = JSON.stringify(data, null, 2);

  const formattedJson = jsonString.split('\n').map((line, index) => {
    const parts = line.split(/(".*?"|[\d.]+|true|false|null)/g);
    return (
      <div key={index} style={{ whiteSpace: 'pre-wrap' }}>
        {parts.map((part, partIndex) => {
          if (part.startsWith('"') && part.endsWith('"') && line.includes(':')) {
            return (
              <span key={partIndex} className="text-[#c01c27]">
                {part}
              </span>
            );
          }
          if (part.startsWith('"') && part.endsWith('"')) {
            return (
              <span key={partIndex} className="text-[#3d791b]">
                {part}
              </span>
            );
          }
          if (!isNaN(parseFloat(part)) && isFinite(Number(part))) {
            return (
              <span key={partIndex} className="text-[#0d21e8]">
                {part}
              </span>
            );
          }
          if (part === 'true' || part === 'false' || part === 'null') {
            return (
              <span key={partIndex} className="text-[#5104a3]">
                {part}
              </span>
            );
          }
          return <span key={partIndex}>{part}</span>;
        })}
      </div>
    );
  });

  return (
    <pre
      className="p-2 rounded text-xs overflow-x-auto"
      style={{ fontFamily: 'monospace' }}
    >
      {formattedJson}
    </pre>
  );
};

export default function TransactionModal({
  data,
  open,
  onOpenChange,
  transactionId,
}: {
  data: LogData[] | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
}) {
  const processedData = React.useMemo(() => {
    if (!data) return [];
    return data.map((item, index) => ({
      sr: index + 1,
      requestType: item.type,
      request: item.request,
      response: item.response,
      responseTime: item.responseTime,
      status: item.status,
      createdAt: item.createdAt,
    }));
  }, [data]);

  const table = useReactTable({
    data: processedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] flex flex-col bg-white">
        <div className="flex justify-between items-center border-b border-gray-200 p-3 shrink-0">
          <h2 className="text-sm font-medium text-gray-700">Transaction: {transactionId}</h2>
        </div>
        <div className="flex-1 overflow-auto p-3">
          <table className="w-full border-collapse">
            <thead className="bg-white shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-b border-gray-300 px-2 py-1 text-left bg-white"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="even:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border-b border-gray-300 px-2 py-1 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      {cell.column.id === 'response' && (
                        <div className="mt-1 text-xs text-gray-500">
                          Response received:{' '}
                          {new Date(cell.row.original.createdAt).toLocaleString()}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {processedData.length === 0 && (
            <div className="text-center text-gray-500 mt-4">No data available</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
