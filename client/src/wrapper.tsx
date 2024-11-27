import React from "react";
import { io } from "socket.io-client";

interface WrapperProps {
  children: React.ReactNode;
}

export const socketClient = io(import.meta.env.VITE_SOCKET_URL);

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <>{children}</>;
};

export default Wrapper;
