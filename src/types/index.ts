export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  type: string;
  accessToken: string;
}

export interface GameReportData {
  supplier: string;
  turnoverPoints: number;
  ggrPoints: number;
  averageBet: number;
  betCount: number;
  activeUsers: number;
  marginPercent: number;
  subRows?: GameReportData[];
}
export interface RoundReportData {
  userId: number;
  userName: string;
  turnover: number;
  winAmount: number;
  rollbackAmount: number;
  ggrAmount: number;
  averageBet: number;
  totalWon: number;
  totalLost: number;
  totalRollback: number;
  marginPercent: number;
  roundId: number;
}





export interface UserInfoData {
  id: number;
  exclusiveId: string;
  currency: string;
  ipAddress: string;
  firstname?: string;
  lastname?: string;
  username: string;
  email?: string;
  dialCode?: string;
  mobile?: string;
  profileImage?: string;
  isVerified: boolean;
  country?: string;
  status: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  platformId: string;
  Platform: {
    id: string;
    name: string;
    currency: string;
    balanceUrl: string;
    betUrl: string;
    resultUrl: string;
    rollbackUrl: string;
    status: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
}

export interface BetListResponse {
  betId: string;
  userName: string;
  providerName: string;
  subProviderName: string;
  operatorId: string;
  roundId: string;
  gameName: string;
  stake: number;
  win: number;
  status: string;
  createdAt: string;
}

export interface BetStatusData {
  userId: string;
  betId: string;
  operatorId: string;
  providerName: string;
  supplierName: string;
  betTime: string;
  roundId: string;
  status: string;
}

export interface FailedBetsData {
  betId: string;
  userId: number;
  userName: string;
  operatorId: string;
  operatorName: string;
  subProviderName: string;
  betTime: string;
  gameName: string;
  requestType: string;
}

//user management
// export interface UserManagementData {
//   operatorId: string;
//   exclusiveId: string;
//   username: string;
//   ipAddress: string;
//   status: string;
//   platformId: string;
//   Platform: {
//     name: string;
//   };
// }

export interface Platform {
  id: string;
  name: string;
  currency: string;
  balanceUrl: string;
  betUrl: string;
  resultUrl: string;
  rollbackUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserManagementData {
  id: number;
  exclusiveId: string;
  currency: string;
  ipAddress: string;
  firstname: string | null;
  lastname: string | null;
  username: string;
  email: string | null;
  dialCode: string | null;
  mobile: string | null;
  profileImage: string | null;
  isVerified: boolean;
  country: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  platformId: string;
  Platform: Platform;
}

export interface UserInfoByNameId {
  id: number;
  remark: string;
  ipAddress: string;
  loginAt: string;
  userId: number;
  device: string;
  user: {
    id: number;
    username: string;
  };
}
export interface GetUsersParams {
  skip: number;
  take: number;
  search?: string;
}

export interface UserApiResponse<T = unknown> {
  count: number;
  skip: number;
  take: number;
  data: UserManagementData[];
  message: string;
  success: boolean;
  errors?: Record<string, string[]>;
}

// casino games

export interface CasinoGame {
  id: string;
  name: string;
  provider: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CasinoGameApiResponse<T> {
  total: number;
  data: CasinoGame[];
  success: boolean;
  message?: string;
}

export interface GetCasinoGamesParams {
  skip?: number;
  take?: number;
  search?: string;
  category?: string;
  providers?: string[];
  subProviders?: string[];
}

// export interface GameManagementData {
//   gameId: string;
//   gameName: string;
//   category: string;
//   isActive: boolean;
// }
//Casino Provider
export interface CasinoProvider {
  provider: string;
  status: string;
}

export interface ProviderManagementData {
  id: string;
  name: string;
  status: string;
}

export interface CasinoProviderApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ProviderManagementData {
  id: string;
  name: string;
  status: string;
}
export interface SubProviderResponse {
  subProvider: string;
  status: string;
}

//Transaction

// export interface Transaction {
//   transactionId: string;
//   userId: string;
//   amount: string;
//   type: 'CREDIT' | 'DEBIT';
//   status: 'PENDING' | 'SUCCESS' | 'FAILED';
//   createdAt: string;
//   updatedAt?: string;
//   reqId: string;
//   gameId: string;
//   responseTime?: number;
// }
export interface Transaction {
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
    creditAmount: number;
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


export interface TransactionApiResponse<T> {
  data: Transaction[];
  total: number;
  skip: number;
  take: number;
}

export interface GameListData {
  gameId: string;
  gameName: string;
  gameCode: string;
  provider: string;
  subProvider: string;
  category: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export interface AuthTokens {
  accessToken: string;
  // refreshToken: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface OpenBetsData {
  UserName: string;
  betId: string;
  operatorId: string;
  RoundId: string;
  supplierName: string;
  gameName: string;
  betTime: string;
}
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    border: string;
    destructive: string;
    happy?: string;
    info?: string;
    exportBtn?: string;
  };
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface FeatureFlags {
  betaFeatures: boolean;
  advancedAnalytics: boolean;
  experimentalUI: boolean;
}

export type Language = 'en' | 'es';

export interface TableColumn<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<any>;
  validation?: any;
}

export interface AddInputSelect {
  id: string;
  isActive: boolean;
  name: string;
  type?: string;
}
