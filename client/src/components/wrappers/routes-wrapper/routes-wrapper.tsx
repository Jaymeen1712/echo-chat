import { lazy, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { SIDEBAR_KEYS } from "../../../enums";
import {
  ProtectedLayout,
  PublicLayout,
  SidebarLayout,
} from "../layout-wrappers";

const AllChatsRoutes = lazy(
  () => import("../../../pages/all-chats/all-chats.routes"),
);
const LoginPage = lazy(() => import("../../../pages/authentication/login"));
const SignUpPage = lazy(() => import("../../../pages/authentication/sign-up"));
const PageNotFound = lazy(() => import("../../../components/page-not-found"));

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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />

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
