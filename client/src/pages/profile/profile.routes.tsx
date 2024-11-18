import { Route, Routes } from "react-router-dom";
import ProfilePage from ".";
import { PageNotFound } from "../../components";

const ProfileRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProfilePage />} />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
};

export default ProfileRoutes;
