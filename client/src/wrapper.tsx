import React from "react";
import { ToastContainer } from "react-toastify";
import { io } from "socket.io-client";

import "react-toastify/dist/ReactToastify.css";

interface WrapperProps {
  children: React.ReactNode;
}

export const socketClient = io(import.meta.env.VITE_SOCKET_URL);

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
      />
      {children}
    </>
  );
};

export default Wrapper;
