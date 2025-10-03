import { apiSlice } from './apiSlice';

export interface GameReportQueryParams {
  skip?: number;
  take?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  game?: string[];
  supplier?: string[];
  currency?: string[];
  orderBy?: string;
  orderFormat?: string;
}

export interface PlayerReportQueryParams {
  skip?: number;
  take?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  username?: string;
  supplier?: string | string[];
  provider?: string | string[];
  orderBy?: string;
  orderFormat?: 'ASC' | 'DESC';
}

export interface SupplierReportQueryParams {
  skip?: number;
  take?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  supplier?: string[] | string;
  currency?: string[];
  orderBy?: string;
  orderFormat?: 'ASC' | 'DESC';
}

export interface SummaryReportQueryParams {
  skip?: number;
  take?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  currency?: string[];
}

export interface DailyReportQueryParams {
  skip?: number;
  take?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  supplier?: string[];
  provider?: string[];
}

export interface RoundReportQueryParams {
  skip?: number;
  take?: number;
  search?: string;
}

export interface GameReport {
  report_date: string;
  game_name: string;
  provider: string;
  supplier: string;
  turnover_points: number;
  ggr_points: number;
  average_bet: string;
  bet_count: string;
  active_users: string;
  margin_percent: string;
  currency: string;
  subRows?: GameReport[];
}

export interface SupplierReport {
  report_date: string;
  provider: string;
  supplier: string;
  turnover_points: number;
  ggr_points: number;
  average_bet: number;
  bet_count: number;
  active_users: number;
  margin_percent: number;
  currency: string;
  subRows?: SupplierReport[];
}

export interface SummaryReport {
  platformId: string;
  platformName?: string;
  reportDate: string;
  turnoverPoints: number;
  ggrPoints: number;
  averageBet: string;
  betCount: string;
  activeUsers: string;
  marginPercent: string;
  subRows?: SummaryReport[];
}

export interface PlayerReport {
  report_date: string;
  user_id: string;
  username: string;
  provider: string;
  supplier: string;
  turnover_points: number;
  ggr_points: number;
  bet_count: number;
  currency: string;
  margin_percent: string;
  subRows: PlayerReport[];
}

export interface DailyReport {
  reportDate: string;
  supplier: string;
  turnoverPoints: number;
  ggrPoints: number;
  averageBet: string;
  betCount: string;
  marginPercent: string;
  subRows?: DailyReport[];
}

export interface RoundReport {
  operatorName: string;
  operatorId: string;
  turnover: number;
  winAmount: number;
  rollbackAmount: number;
  ggrAmount: string;
  averageBet: string;
  totalBets: string;
  totalWon: string;
  totalLost: string;
  totalRollback: string;
  marginPercent: string;
}

export interface GameReportApiResponse {
  data: GameReport[];
  total: number;
  skip?: number;
  take?: number;
}

export interface PlayerReportApiResponse {
  data: PlayerReport[];
  total: number;
  pagination: {
    totalCount?: string;
    skip?: number;
    take?: number;
  };
}
export interface SupplierReportApiResponse {
  data: SupplierReport[];
  total: number;
  skip?: number;
  take?: number;
}

export interface SummaryReportApiResponse {
  data: SummaryReport[];
  total: number;
  pagination: {
    skip?: number;
    take?: number;
    totalCount?: number;
  };
}

export interface DailyReportResponse {
  data: DailyReport[];
  totals: {
    totalTurnover: number;
    totalGgr: number;
    avgBet: string;
    totalBets: string;
    avgMargin: string;
  };
  pagination?: {
    skip?: number;
    take?: number;
    totalCount?: number;
  };
}

export interface RoundReportResponse {
  data: RoundReport[];
  pagination: {
    skip: number;
    take: number;
    totalCount: number;
  };
}

export const CasinoReportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGameReport: builder.query<GameReportApiResponse, GameReportQueryParams>({
      query: ({
        skip,
        take,
        search,
        startDate,
        endDate,
        game,
        supplier,
        currency,
        orderBy,
        orderFormat,
      }) => ({
        url: '/reports/game-report',
        params: {
          skip,
          take,
          search,
          startDate,
          endDate,
          game,
          supplier,
          currency,
          orderBy,
          orderFormat,
          _t: Date.now(),
        },
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      }),
      providesTags: ['GameReport'],
    }),

    getPlayerReport: builder.query<PlayerReportApiResponse, PlayerReportQueryParams>({
      query: ({
        skip,
        take,
        search,
        startDate,
        endDate,
        userId,
        username,
        supplier,
        provider,
        orderBy,
        orderFormat,
      }) => ({
        url: '/reports/player',
        params: {
          skip,
          take,
          search,
          startDate,
          endDate,
          userId,
          username,
          supplier,
          provider,
          orderBy,
          orderFormat,
          _t: Date.now(),
        },
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      }),
      providesTags: ['PlayerReport'],
    }),

    /** Supplier Report API */
    getSupplierReport: builder.query<SupplierReportApiResponse, SupplierReportQueryParams>({
      query: ({
        skip,
        take,
        search,
        startDate,
        endDate,
        supplier,
        currency,
        orderBy,
        orderFormat,
      }) => ({
        url: '/reports/supplier-report',
        params: {
          skip,
          take,
          search,
          startDate,
          endDate,
          supplier,
          currency,
          orderBy,
          orderFormat,
          _t: Date.now(),
        },
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      }),
      providesTags: ['SupplierReport'],
    }),
    getSummaryReport: builder.query<SummaryReportApiResponse, SummaryReportQueryParams>({
      query: ({ skip, take, search, startDate, endDate, currency }) => ({
        url: '/reports/summary',
        params: {
          skip,
          take,
          search,
          startDate,
          endDate,
          currency,
          _t: Date.now(),
        },
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      }),
      providesTags: ['SummaryReport'],
    }),
    getDailyReport: builder.query<DailyReportResponse, DailyReportQueryParams>({
      query: ({ skip, take, search, startDate, endDate, supplier, provider }) => ({
        url: '/reports/daily',
        params: {
          skip,
          take,
          search,
          startDate,
          endDate,
          supplier,
          provider,
          _t: Date.now(),
        },
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      }),
      providesTags: ['DailyReport'],
    }),
    getRoundReport: builder.query<RoundReportResponse, RoundReportQueryParams>({
      query: ({ skip, take, search }) => ({
        url: '/reports/round-report',
        params: {
          skip,
          take,
          search,
          _t: Date.now(),
        },
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      }),
      providesTags: ['RoundReport'],
    }),
  }),
});

export const {
  useGetGameReportQuery,
  useLazyGetGameReportQuery,
  useGetPlayerReportQuery,
  useLazyGetPlayerReportQuery,
  useGetSupplierReportQuery,
  useLazyGetSupplierReportQuery,
  useGetSummaryReportQuery,
  useLazyGetSummaryReportQuery,
  useGetDailyReportQuery,
  useLazyGetDailyReportQuery,
  useGetRoundReportQuery,
  useLazyGetRoundReportQuery,
} = CasinoReportApi;
