import { isAuthenticated } from "@/utils";
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const ProtectedLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedLayout;
