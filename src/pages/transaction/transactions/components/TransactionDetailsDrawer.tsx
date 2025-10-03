import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { X } from 'lucide-react';
import { Transaction } from '@/types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

interface RequestData {
  betType: string;
  creditAmount: number;
  eventName: string;
  exposure: number;
  exposureEnabled: boolean;
  exposureTime: number;
  gameId: string;
  marketId: string;
  marketName: string;
  operatorId: string;
  reqId: string;
  roundId: string;
  round_closed: boolean;
  runnerName: string;
  token: string;
  transactionId: string;
  userId: number;
}

interface ResponseData {
  status: string;
  balance: number;
}

export default function TransactionDetailsDrawer({ open, onOpenChange, transaction }: Props) {
  console.log('test', transaction);
  if (!transaction) return null;

  const requestData: RequestData = {
    betType: transaction.request.betType || 'Casino',
    creditAmount: transaction.amount,
    eventName: '',
    exposure: 0,
    exposureEnabled: false,
    exposureTime: 0,
    gameId: transaction.request.gameId,
    marketId: '',
    marketName: '',
    operatorId: 'shiv247',
    reqId: transaction.reqId,
    roundId: transaction.request.roundId || '-',
    round_closed: false,
    runnerName: '',
    token: transaction.request.token || '-',
    transactionId: transaction.transactionId,
    userId: transaction.userId,
  };

  const responseData: ResponseData = {
    status: transaction.response.status || '',
    balance: transaction.response.balance || 0,
  };

  const renderJsonWithColors = (obj: any, indent = 0): React.ReactNode => {
    const indentStr = '  '.repeat(indent);

    if (obj === null) return <span className="text-gray-500">null</span>;
    if (typeof obj === 'boolean') return <span className="text-blue-600">{String(obj)}</span>;
    if (typeof obj === 'number') return <span className="text-green-600">{obj}</span>;
    if (typeof obj === 'string') return <span className="text-green-600">"{obj}"</span>;

    if (Array.isArray(obj)) {
      return (
        <span>
          [
          {obj.map((item, i) => (
            <div key={i} className="ml-4">
              {renderJsonWithColors(item, indent + 1)}
              {i < obj.length - 1 && ','}
            </div>
          ))}
          <div>{indentStr}]</div>
        </span>
      );
    }

    if (typeof obj === 'object' && obj !== null) {
      const entries = Object.entries(obj);
      return (
        <span>
          {'{'}
          {entries.map(([key, value], i) => (
            <div key={key} className="ml-4">
              <span className="text-red-600">"{key}"</span>:{' '}
              {renderJsonWithColors(value, indent + 1)}
              {i < entries.length - 1 && ','}
            </div>
          ))}
          <div>
            {indentStr}
            {'}'}
          </div>
        </span>
      );
    }

    return String(obj);
  };
  const ms = transaction.responseTime ?? 0;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[500px] sm:w-[600px] overflow-y-auto flex flex-col">
        <SheetHeader className="pb-4 bg-primary px-9 py-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl text-white">Request and Response</SheetTitle>
            <SheetClose className="rounded-sm opacity-70 transition-opacity hover:opacity-100">
              <X className="h-5 w-5 text-white" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="space-y-6 p-6 bg-white flex-1">
          {/* Request */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Request:</h3>
            <pre className="bg-gray-50 rounded-lg text-sm p-4 overflow-x-auto font-mono">
              <code>{renderJsonWithColors(requestData)}</code>
            </pre>
          </div>
          <div className="text-sm text-gray-600">
            <p>
              <span className="font-medium">Request Time:</span>{' '}
              {transaction.createdAt || 'Tue Sep 02 2025 20:40:07 GMT+0530 (India Standard Time)'}
            </p>
          </div>

          {/* Response */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Response:</h3>
            <pre className="bg-gray-50 rounded-lg text-sm p-4 overflow-x-auto font-mono">
              <code>{renderJsonWithColors(responseData)}</code>
            </pre>
          </div>
          <div className="text-sm text-gray-600">
            <div>
              <div className="font-bold">Response Time:</div>
              <div>{transaction.updatedAt || '-'}</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <div>
              <div className="font-bold">Time Delta:</div>
              <div> {ms >= 1000 ? `${Math.floor(ms / 1000)}s ${ms % 1000}ms` : `${ms}ms`}</div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
