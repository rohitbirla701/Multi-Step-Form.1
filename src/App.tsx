// src/App.tsx
import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AdminRoute } from '@/components/common/AdminRoute';
import MultiStepFormPage from '@/pages/MultiStepFormPage';

import {
  LoginPage,
  MFA,
  DashboardPage,
  OnboardingPage,
  //report
  GameReportPage,
  PlayerReportPage,
  ReportSummaryPage,
  DailyReportPage,
  RoundReportPage,
  UserRoundReportPage,
  SupplierReportPage,
  DailySupplierReportPage,
  GameListPage,
  NotFoundPage,
  //transaction
  TransactionsPage,
  TransactionSummaryPage,
  UserInfoPage,
  BetListPage,
  OpenBetsPage,
  BetStatusPage,
  FailedBetsPage,
  // administration
  UserManagementPage,
  GameManagementPage,
  ProviderManagementPage,
  SubProviderManagementPage,
} from '@/routes/AppRoutes';

export function App() {
  return (
    <Suspense
      fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}
    >
      <Routes>
        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path ="/multiStepFromPage" element={<MultiStepFormPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mfa" element={<MFA />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to="/reports/games" replace />} />
            {/* <Route path="/" element={<DashboardPage />} /> */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Reports */}
            <Route index path="/reports/games" element={<GameReportPage />} />
            <Route path="/reports/players" element={<PlayerReportPage />} />
            <Route path="/reports/summary" element={<ReportSummaryPage />} />
            <Route path="/reports/suppliers" element={<SupplierReportPage />} />
            <Route path="/reports/daily-report" element={<DailyReportPage />} />
            <Route
              path="/reports/daily-supplier-report/:date"
              element={<DailySupplierReportPage />}
            />
            <Route path="/reports/round-report" element={<RoundReportPage />} />
            <Route path="/reports/round-report/:operatorId" element={<UserRoundReportPage />} />

            {/* Transactions */}
            <Route path="/transaction/transactions" element={<TransactionsPage />} />
            <Route path="/transaction/user-info" element={<UserInfoPage />} />
            <Route path="/transaction/summary" element={<TransactionSummaryPage />} />
            <Route path="/transaction/bet-list" element={<BetListPage />} />
            <Route path="/transaction/open-bets" element={<OpenBetsPage />} />
            <Route path="/transaction/bet-status" element={<BetStatusPage />} />
            <Route path="/transaction/failed-bets" element={<FailedBetsPage />} />

            {/* Administration */}
            <Route path="/administration/users" element={<UserManagementPage />} />
            <Route path="/administration/games" element={<GameManagementPage />} />
            <Route
              path="/administration/provider-management"
              element={<ProviderManagementPage />}
            />
            <Route
              path="/administration/provider-management/subproviders/:provider"
              element={<SubProviderManagementPage />}
            />
            <Route path="/administration/notifications" element={<SupplierReportPage />} />
            <Route path="/administration/bet-status" element={<SupplierReportPage />} />
            <Route path="/administration/test-cases" element={<SupplierReportPage />} />

            {/* Tools */}
            <Route path="/tools/gamelist" element={<GameListPage />} />

            {/* Admin-only */}
            <Route element={<AdminRoute />}></Route>
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
