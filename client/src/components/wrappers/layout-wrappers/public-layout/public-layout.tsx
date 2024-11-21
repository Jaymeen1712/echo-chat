import { isAuthenticated } from "@/utils";
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const PublicLayout: React.FC<{ children: ReactNode }> = ({ children }) =>
  isAuthenticated() ? <Navigate to="/" /> : <>{children}</>;

export default PublicLayout;
