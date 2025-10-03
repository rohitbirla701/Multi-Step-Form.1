import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';

// Define a function to render the JSON with syntax highlighting
const JsonSyntaxHighlighter = ({ data = null }) => {
  if (!data) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const formattedJson = jsonString.split('\n').map((line, index) => {
    const parts = line.split(/(".*?"|[\d.]+|true|false|null)/g);
    return (
      <div key={index}>
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
          if (!isNaN(parseFloat(part)) && isFinite(part as any)) {
            return (
              <span key={partIndex} className="text-[#0d21e8]">
                {part}
              </span>
            );
          }
          if (part === 'true' || part === 'false') {
            return (
              <span key={partIndex} className="text-[#5104a3]">
                {part}
              </span>
            );
          }
          if (part === 'null') {
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
    <pre className="p-2 rounded text-xs overflow-x-auto flex justify-center flex-col">
      {formattedJson}
    </pre>
  );
};

// Table data from your logs
const logData = [
  {
    sr: 1,
    requestType: 'BET',
    request: {
      betType: 'Casino',
      competitionId: '',
      competitionName: '',
      debitAmount: 10,
      eventId: '',
      eventName: '',
      eventStatus: '',
      eventdate: 0,
      exposure: 0,
      exposureEnabled: false,
      exposureTime: 0,
      gameId: '860001',
      marketId: '',
      marketName: '',
      odds: 0,
      operatorId: 'shiv247',
      reqId: 'cc021da4-ff6f-420c-a147-57ec65f643ac',
      roundId: '6825223',
      round_closed: false,
      runnerName: '',
      runnerType: '',
      selectionType: '',
      token: 'b0b4ab4b-8d5f-4e1f-9d47-1b5fa8c70118',
      transactionId: '194292652410',
      userId: '78',
    },
    response: {
      status: 'OP_SUCCESS',
      balance: 98628.8,
    },
    responseTime: 1158,
    status: 'Success',
  },
  {
    sr: 2,
    requestType: 'ROLLBACK',
    request: {
      betType: 'Casino',
      eventName: '',
      exposure: 0,
      exposureEnabled: false,
      exposureTime: 0,
      gameId: '860001',
      marketId: '',
      marketName: '',
      operatorId: 'shiv247',
      reqId: '56d16f99-ad1c-4eed-805f-b7b4a3552226',
      rollbackAmount: 10,
      roundId: '6825223',
      round_closed: true,
      runnerName: '',
      token: 'b0b4ab4b-8d5f-4e1f-9d47-1b5fa8c70118',
      transactionId: '194292652410',
      userId: '78',
    },
    response: {
      message: ['rollbackReason should not be empty'],
      error: 'Bad Request',
      statusCode: 400,
    },
    responseTime: 933,
    status: 'Failed',
  },
  {
    sr: 3,
    requestType: 'ROLLBACK',
    request: {
      betType: 'Casino',
      eventName: '',
      exposure: 0,
      exposureEnabled: false,
      exposureTime: 0,
      gameId: '860001',
      marketId: '',
      marketName: '',
      operatorId: 'shiv247',
      reqId: '56d16f99-ad1c-4eed-805f-b7b4a3552226',
      rollbackAmount: 10,
      roundId: '6825223',
      round_closed: true,
      runnerName: '',
      token: 'b0b4ab4b-8d5f-4e1f-9d47-1b5fa8c70118',
      transactionId: '194292652410',
      userId: '78',
    },
    response: {
      message: ['rollbackReason should not be empty'],
      error: 'Bad Request',
      statusCode: 400,
    },
    responseTime: 933,
    status: 'Failed',
  },
  {
    sr: 4,
    requestType: 'ROLLBACK',
    request: {
      betType: 'Casino',
      eventName: '',
      exposure: 0,
      exposureEnabled: false,
      exposureTime: 0,
      gameId: '860001',
      marketId: '',
      marketName: '',
      operatorId: 'shiv247',
      reqId: '56d16f99-ad1c-4eed-805f-b7b4a3552226',
      rollbackAmount: 10,
      roundId: '6825223',
      round_closed: true,
      runnerName: '',
      token: 'b0b4ab4b-8d5f-4e1f-9d47-1b5fa8c70118',
      transactionId: '194292652410',
      userId: '78',
    },
    response: {
      message: ['rollbackReason should not be empty'],
      error: 'Bad Request',
      statusCode: 400,
    },
    responseTime: 726,
    status: 'Failed',
  },
  {
    sr: 5,
    requestType: 'ROLLBACK',
    request: {
      betType: 'Casino',
      eventName: '',
      exposure: 0,
      exposureEnabled: false,
      exposureTime: 0,
      gameId: '860001',
      marketId: '',
      marketName: '',
      operatorId: 'shiv247',
      reqId: '56d16f99-ad1c-4eed-805f-b7b4a3552226',
      rollbackAmount: 10,
      roundId: '6825223',
      round_closed: true,
      runnerName: '',
      token: 'b0b4ab4b-8d5f-4e1f-9d47-1b5fa8c70118',
      transactionId: '194292652410',
      userId: '78',
    },
    response: {
      message: ['rollbackReason should not be empty'],
      error: 'Bad Request',
      statusCode: 400,
    },
    responseTime: 754,
    status: 'Failed',
  },
  {
    sr: 6,
    requestType: 'ROLLBACK',
    request: {
      betType: 'Casino',
      eventName: '',
      exposure: 0,
      exposureEnabled: false,
      exposureTime: 0,
      gameId: '860001',
      marketId: '',
      marketName: '',
      operatorId: 'shiv247',
      reqId: '56d16f99-ad1c-4eed-805f-b7b4a3552226',
      rollbackAmount: 10,
      roundId: '6825223',
      round_closed: true,
      runnerName: '',
      token: 'b0b4ab4b-8d5f-4e1f-9d47-1b5fa8c70118',
      transactionId: '194292652410',
      userId: '78',
    },
    response: {
      message: ['rollbackReason should not be empty'],
      error: 'Bad Request',
      statusCode: 400,
    },
    responseTime: 2004,
    status: 'Failed',
  },
];

export default function TransactionModal({
  open,
  onOpenChange,
  transactionId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
}) {
  const table = useReactTable({
    data: logData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] flex flex-col bg-white">
        <div className="flex justify-between items-center border-b border-gray-200 p-3 shrink-0">
          <h2 className="text-sm font-medium text-gray-700">Transaction: {transactionId}</h2>
          <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
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
                          Response received: {new Date().toLocaleString()}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Columns
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
    cell: ({ getValue }) => <span>{getValue() as any}</span>,
  },
];
