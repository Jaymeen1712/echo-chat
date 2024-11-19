import { Route, Routes } from "react-router-dom";
import AllChatsPage from ".";
import { PageNotFound } from "../../components";

const AllChatsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AllChatsPage />} />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AllChatsRoutes;
