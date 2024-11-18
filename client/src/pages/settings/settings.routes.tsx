import { Route, Routes } from "react-router-dom";
import SettingsPage from ".";
import { PageNotFound } from "../../components";

const SettingsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SettingsPage />} />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
};

export default SettingsRoutes;
