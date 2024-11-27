import MainPage from "@/pages/main";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import PageNotFound from "../../page-not-found/page-not-found";
import {
  ProtectedLayout,
  PublicLayout,
  SidebarLayout,
} from "../layout-wrappers";

// const MainPage = lazy(
//   () => import("@/pages/main"),
// );
const LoginPage = lazy(() => import("../../../pages/authentication/login"));
const SignUpPage = lazy(() => import("../../../pages/authentication/sign-up"));
// const PageNotFound = lazy(() => import("../../../components/page-not-found"));

const RoutesWrapper = () => {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route
        path="/login"
        element={
          <PublicLayout>
            <LoginPage />
          </PublicLayout>
        }
      />
      <Route
        path="/sign-up"
        element={
          <PublicLayout>
            <SignUpPage />
          </PublicLayout>
        }
      />

      {/* Protected Routes */}
      <Route
        path={`/`}
        element={
          <ProtectedLayout>
            <SidebarLayout>
              <MainPage />
            </SidebarLayout>
          </ProtectedLayout>
        }
      />

      {/* Fallback Route */}
      <Route
        path="/*"
        element={
          <PublicLayout>
            <PageNotFound />
          </PublicLayout>
        }
      />
    </Routes>
  );
};

export default RoutesWrapper;
