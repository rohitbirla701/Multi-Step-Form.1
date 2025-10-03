import { Loading } from '@/components/common/Loader';
import loadable from '@/utils/loadable';

// Auth
export const LoginPage = loadable(() => import('@/pages/auth/login'), {
  fallback: <Loading />,
});
export const MFA = loadable(() => import('@/pages/auth/mfa'), {
  fallback: <Loading />,
});

// Dashboard
export const DashboardPage = loadable(() => import('@/pages/dashboard/DashboardPage'), {
  fallback: <Loading />,
});

// Onboarding
export const OnboardingPage = loadable(() => import('@/pages/onboarding/OnboardingPage'), {
  fallback: <Loading />,
});

// Reports
export const GameReportPage = loadable(() => import('@/pages/reports/game'), {
  fallback: <Loading />,
});
export const PlayerReportPage = loadable(() => import('@/pages/reports/player'), {
  fallback: <Loading />,
});
export const ReportSummaryPage = loadable(() => import('@/pages/reports/summary'), {
  fallback: <Loading />,
});
export const SupplierReportPage = loadable(() => import('@/pages/reports/supplier'), {
  fallback: <Loading />,
});
export const DailyReportPage = loadable(() => import('@/pages/reports/daily'), {
  fallback: <Loading />,
});
export const DailySupplierReportPage = loadable(() => import('@/pages/reports/dailysupplier'), {
  fallback: <Loading />,
});
export const RoundReportPage = loadable(() => import('@/pages/reports/round'), {
  fallback: <Loading />,
});
export const UserRoundReportPage = loadable(() => import('@/pages/reports/userround'), {
  fallback: <Loading />,
});

// Transaction 
export const TransactionsPage = loadable(
  () => import('@/pages/transaction/transactions'),
  {
    fallback: <Loading />,
  }
);

export const TransactionSummaryPage = loadable(
  () => import('@/pages/transaction/summary'),
  {
    fallback: <Loading />,
  }
);

export const UserInfoPage = loadable(
  () => import('@/pages/transaction/userinfo'),
  {
    fallback: <Loading />,
  }
);

export const BetListPage = loadable(() => import('@/pages/transaction/betlist'), {
  fallback: <Loading />,
});

export const OpenBetsPage = loadable(() => import('@/pages/transaction/openbets'), {
  fallback: <Loading />,
});
export const BetStatusPage = loadable(() => import('@/pages/transaction/betstatus'), {
  fallback: <Loading />,
});
export const FailedBetsPage = loadable(() => import('@/pages/transaction/failedbets'), {
  fallback: <Loading />,
});

// Administration

export const UserManagementPage = loadable(
  () => import('@/pages/administration/user'),
  {
    fallback: <Loading />,
  }
);

export const GameManagementPage = loadable(() => import('@/pages/administration/game'), {
  fallback: <Loading />,
});

export const SubProviderManagementPage = loadable(
  () => import('@/pages/administration/subprovider'),
  {
    fallback: <Loading />,
  }
);
export const ProviderManagementPage = loadable(
  () => import('@/pages/administration/provider'),
  {
    fallback: <Loading />,
  }
);

// Tools
export const GameListPage = loadable(() => import('@/pages/tools/gamelist'), {
  fallback: <Loading />,
});


// Misc
export const NotFoundPage = loadable(() => import('@/pages/NotFoundPage'), {
  fallback: <Loading />,
});
