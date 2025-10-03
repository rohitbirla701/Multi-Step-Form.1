import React, { useState, ChangeEvent } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils';
import ClearInput from '@/components/common/ClearInput';
import {
  useLazyGetTransactionDetailsQuery,
  useLazyGetTransactionsQuery,
} from '@/store/api/TransactionApi';
import TransactionModal from './components/TransactionModal';

const TransactionSummaryPage = () => {
  const [transactionId, setTransactionId] = useState<string>('');
  const [roundId, setRoundId] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [take, setTake] = useState<number>(100);
  const [getTransactions, { data: logData, error, isLoading, isFetching }] =
    useLazyGetTransactionsQuery({ transactionId, roundId } as any);

  const DetailCard = ({ header = 'Game', value = 'One Day Teen Patti Classic' }) => {
    return (
      <div className="bg-background  rounded-md  p-4">
        <p className="text-xs text-gray-500">{header}</p>
        <h2 className="text-sm font-semibold text-gray-800">{value}</h2>
      </div>
    );
  };
  const headersMap: Record<string, string> = {
    userName: 'User Name',
    userId: 'User ID',
    operatorId: 'Operator ID',
    transactionId: 'Transaction ID',
    roundId: 'Round ID',
    game: 'Game',
    providerName: 'Provider Name',
    subProviderName: 'Sub Provider',
    stake: 'Stake',
    win: 'Win',
    balAfterBet: 'Balance After Bet',
    balAfterResult: 'Balance After Result',
    rollbackAmt: 'Rollback Amount',
    betTime: 'Bet Time',
    resultTime: 'Result Time',
    status: 'Status',
  };
  const [
    getTransactionDetails,
    {
      data: transaction,
      error: transactionError,
      isLoading: transactionIsLoading,
      isFetching: transactionIsFetching,
    },
  ] = useLazyGetTransactionDetailsQuery();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Summary</h1>
        </div>
        <div className="flex space-x-2 items-center">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Transaction Id Input */}
            <ClearInput
              placeholder="Transaction Id"
              value={transactionId}
              setValue={setTransactionId}
            />
            {/* Round Id Input */}
            <ClearInput placeholder="Round Id" value={roundId} setValue={setRoundId} />

            {/* Apply Button */}
            <Button
              disabled={!transactionId}
              className="bg-primary text-white w-full sm:w-auto"
              onClick={() => getTransactionDetails({ transactionId, roundId })}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {Object.entries(transaction?.[0] ?? {}).map(([key, value]) => (
          <DetailCard key={key} header={headersMap[key] ?? key} value={String(value)} />
        ))}
      </div>
      {transaction && (
        <Button
          onClick={() => {
            getTransactions({ transactionId, roundId, skip, take });
            setOpen(true);
          }}
          className="w-full max-w-[396px] py-2"
        >
          Transaction Logs
        </Button>
      )}
      <TransactionModal
        data={logData?.data ?? []}
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
        transactionId={transactionId}
      />
    </div>
  );
};

export default TransactionSummaryPage;
