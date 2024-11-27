import React from "react";
import { io } from "socket.io-client";

interface WrapperProps {
  children: React.ReactNode;
}

export const socketClient = io("http://localhost:4000");

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <>{children}</>;
};

export default Wrapper;
