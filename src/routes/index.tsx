import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

// Pages
import { LoginPage } from '@/features/auth/pages/login-page';
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page';
import { CentersPage } from '@/features/centers/pages/centers-page';
import { CenterOnboardingPage } from '@/features/centers/pages/center-onboarding-page';
import { CenterDetailsPage } from '@/features/centers/pages/center-details-page';
import { PlansPage } from '@/features/subscription-plans/pages/plans-page';
import { PaymentsPage } from '@/features/subscription-payments/pages/payments-page';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="centers" element={<CentersPage />} />
          <Route path="centers/new" element={<CenterOnboardingPage />} />
          <Route path="centers/:id" element={<CenterDetailsPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="subscription-payments" element={<Navigate to="/payments" replace />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
