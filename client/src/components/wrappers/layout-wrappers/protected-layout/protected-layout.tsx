import React, { ReactNode } from "react";

const ProtectedLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedLayout;
