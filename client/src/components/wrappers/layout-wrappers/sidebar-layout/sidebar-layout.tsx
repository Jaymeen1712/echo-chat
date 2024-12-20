import React, { ReactNode } from "react";
import Sidebar from "../../../sidebar";

const SidebarLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="h-full flex-1 p-3 pl-0">{children}</div>
    </div>
  );
};

export default SidebarLayout;
