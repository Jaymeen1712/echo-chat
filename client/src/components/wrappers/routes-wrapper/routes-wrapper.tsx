import { lazy, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { SIDEBAR_KEYS } from "../../../enums";
import AllChatsRoutes from "../../../pages/all-chats/all-chats.routes";
import ProfileRoutes from "../../../pages/profile/profile.routes";
import SettingsPage from "../../../pages/settings";
import PageNotFound from "../../page-not-found/page-not-found";
import {
  ProtectedLayout,
  PublicLayout,
  SidebarLayout,
} from "../layout-wrappers";

// const AllChatsRoutes = lazy(
//   () => import("../../../pages/all-chats/all-chats.routes"),
// );
// const ProfileRoutes = lazy(
//   () => import("../../../pages/profile/profile.routes"),
// );
// const SettingsPage = lazy(() => import("../../../pages/settings"));
const LoginPage = lazy(() => import("../../../pages/authentication/login"));
const SignUpPage = lazy(() => import("../../../pages/authentication/sign-up"));
// const PageNotFound = lazy(() => import("../../../components/page-not-found"));

const RoutesWrapper = () => {
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const { pathname } = location;

    if (pathname === "/") {
      navigate(`/${SIDEBAR_KEYS.ALL_CHATS.route}`);
    }
  }, [location]);

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
        path={`/${SIDEBAR_KEYS.ALL_CHATS.route}/*`}
        element={
          <ProtectedLayout>
            <SidebarLayout>
              <AllChatsRoutes />
            </SidebarLayout>
          </ProtectedLayout>
        }
      />
      <Route
        path={`/${SIDEBAR_KEYS.PROFILE.route}/*`}
        element={
          <ProtectedLayout>
            <SidebarLayout>
              <ProfileRoutes />
            </SidebarLayout>
          </ProtectedLayout>
        }
      />
      <Route
        path={`/${SIDEBAR_KEYS.EDIT.route}/*`}
        element={
          <ProtectedLayout>
            <SidebarLayout>
              <SettingsPage />
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
