import { Route, Routes } from "react-router-dom";
import AllChatsPage from ".";
import { PageNotFound, ProtectedLayout, PublicLayout } from "../../components";

const AllChatsRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedLayout>
            <AllChatsPage />
          </ProtectedLayout>
        }
      />

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

export default AllChatsRoutes;
