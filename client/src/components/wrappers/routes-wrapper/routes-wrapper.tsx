import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import {
  ProtectedLayout,
  PublicLayout,
  SidebarLayout,
} from "../layout-wrappers";

// Lazy load all pages for better code splitting
const MainPage = lazy(() => import("@/pages/main"));
const LoginPage = lazy(() => import("../../../pages/authentication/login"));
const SignUpPage = lazy(() => import("../../../pages/authentication/sign-up"));
const PageNotFound = lazy(
  () => import("../../../components/page-not-found/page-not-found"),
);

// Loading component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-primary border-t-transparent"></div>
  </div>
);

const RoutesWrapper = () => {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route
        path="/login"
        element={
          <PublicLayout>
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          </PublicLayout>
        }
      />
      <Route
        path="/sign-up"
        element={
          <PublicLayout>
            <Suspense fallback={<PageLoader />}>
              <SignUpPage />
            </Suspense>
          </PublicLayout>
        }
      />

      {/* Protected Routes */}
      <Route
        path={`/`}
        element={
          <ProtectedLayout>
            <SidebarLayout>
              <Suspense fallback={<PageLoader />}>
                <MainPage />
              </Suspense>
            </SidebarLayout>
          </ProtectedLayout>
        }
      />

      {/* Fallback Route */}
      <Route
        path="/*"
        element={
          <PublicLayout>
            <Suspense fallback={<PageLoader />}>
              <PageNotFound />
            </Suspense>
          </PublicLayout>
        }
      />
    </Routes>
  );
};

export default RoutesWrapper;
