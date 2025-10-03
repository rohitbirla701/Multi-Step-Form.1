import { ApiResponse, BetListResponse, Transaction } from '@/types';
import { apiSlice } from './apiSlice';

interface GetTransactionsParams {
  skip: number;
  take: number;
  search?: string;
  transactionId?: string;
  reqId?: string;
  userId?: string;
  username?: string;
  roundId?: string;
  status?: 'PENDING' | 'SUCCESS' | 'FAILED';
  type?: 'BET' | 'RESULT' | 'ROLLBACK';
  gameId?: string;
  startDate?: string;
  endDate?: string;
  provider?: string[];
}

interface BetListParams {
  skip?: number;
  take?: number;
  search?: string;
  transactionId?: string;
  userId?: number;
  username?: string;
  roundId?: string;
  gameId?: string;
  provider?: string[];
  subProviders?: string[];
  startDate?: string;
  endDate?: string;
  amountMin?: number;
  amountMax?: number;
}

interface TransactionApiResponse<T> {
  data: T;
  total: number;
  skip: number;
  take: number;
}

interface GetTransactionDetailsParams {
  roundId: string;
  transactionId: string;
}

interface BetListApiResponse<T> {
  data: T;
  total?: number;
}

interface TransactionSummary {
  userName: string;
  userId: number;
  operatorId: string;
  transactionId: string;
  roundId: string;
  game: string;
  providerName: string;
  subProviderName: string;
  stake: number;
  win: number;
  rollbackAmt: number;
  status: 'WIN' | 'LOSS' | 'PENDING';
  betTime: string;
  resultTime: string;
  balAfterBet: number;
  balAfterResult: number;
}

export const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<TransactionApiResponse<Transaction[]>, GetTransactionsParams>({
      query: (data) => ({
        url: '/transaction/all',
        params: { ...data, _t: Date.now() },
      }),
      providesTags: ['Transaction'],
    }),

    getTransactionDetails: builder.query<TransactionSummary[], GetTransactionDetailsParams>({
      query: ({ transactionId, roundId }) => ({
        url: '/transaction/details',
        params: { transactionId, roundId, _t: Date.now() },
      }),
      providesTags: ['Transaction'],
    }),
    getBetList: builder.query<BetListApiResponse<BetListResponse[]>, BetListParams>({
      query: (params) => {
        // remove undefined / null / empty string / empty array
        const cleanedParams = Object.fromEntries(
          Object.entries(params).filter(([_, v]) => {
            if (v === undefined || v === null) return false;
            if (typeof v === 'string' && v.trim() === '') return false;
            if (Array.isArray(v) && v.length === 0) return false;
            return true;
          })
        );

        return {
          url: '/transaction/bets',
          params: { ...cleanedParams, _t: Date.now() },
        };
      },
      providesTags: ['Transaction'],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useLazyGetTransactionsQuery,
  useGetTransactionDetailsQuery,
  useLazyGetTransactionDetailsQuery,
  useGetBetListQuery,
  useLazyGetBetListQuery,
} = transactionApi;
