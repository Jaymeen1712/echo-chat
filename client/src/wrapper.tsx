import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { io } from "socket.io-client";

import "react-toastify/dist/ReactToastify.css";
import { useAppStore } from "./store";

interface WrapperProps {
  children: React.ReactNode;
}

export const socketClient = io(import.meta.env.VITE_SOCKET_URL);

export const peerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:global.stun.twilio.com:3478",
      ],
    },
  ],
});

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const {
    currentUserData,
    setReceivedOffer,
    setReceivedCandidate,
    receivedCandidate,
    activeChat,
    setOnlineUsers,
    onlineUsers,
    patchSubSidebarChatsIsActiveStates,
    setCallStatus,
    setLocalCallStream,
  } = useAppStore();

  useEffect(() => {
    if (currentUserData) {
      const { _id: currentUserId } = currentUserData;
      socketClient.emit("register", currentUserId);
    }
  }, [socketClient, currentUserData]);

  useEffect(() => {
    socketClient.on("online-users", (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });
  }, [socketClient]);

  useEffect(() => {
    patchSubSidebarChatsIsActiveStates(onlineUsers);
  }, [onlineUsers]);

  useEffect(() => {
    if (!currentUserData || !peerConnection) return;

    const { _id: currentUserId } = currentUserData;
    socketClient.on(
      "receive-offer",
      async ({ senderUserDetails, offer, targetUserId }) => {
        if (currentUserId !== targetUserId) return;

        setReceivedOffer({
          offer,
          senderDetails: senderUserDetails,
        });
      },
    );

    socketClient.on("receive-answer", async ({ answer }) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
    });

    socketClient.on("receive-ice-candidate", ({ candidate, targetUserId }) => {
      if (currentUserId !== targetUserId) return;

      if (candidate) {
        console.log("🚀 ~ socketClient.on ~ candidate:", candidate);
        console.log("candidate received to callee");
        setReceivedCandidate(candidate);
        peerConnection.addIceCandidate(new RTCIceCandidate(receivedCandidate));
      }
    });
  }, [socketClient, peerConnection, currentUserData]);

  useEffect(() => {
    if (!peerConnection) return;

    try {
      if (peerConnection.remoteDescription) {
        peerConnection.addIceCandidate(new RTCIceCandidate(receivedCandidate));
      }
    } catch (error) {
      console.error("Error adding received ICE candidate", error);
    }
  }, [peerConnection, receivedCandidate]);

  // useEffect(() => {
  //   if (!activeChat || !peerConnection) return;

  //   const { userId: targetUserId } = activeChat;

  //   if (!targetUserId) return;

  //   //  ICE candidate handling
  //   const candidate = new RTCIceCandidate();

  //   peerConnection.onicecandidate = (event) => {
  //     if (event.candidate) {
  //       socketClient.emit("send-ice-candidate", {
  //         candidate: candidate,
  //         targetUserId,
  //       });
  //     }
  //   };
  // }, [peerConnection, socketClient, activeChat]);

  useEffect(() => {
    if (!activeChat || !peerConnection) return;

    const { userId: targetUserId } = activeChat;

    if (!targetUserId) return;

    peerConnection.addEventListener("track", (ev) => {
      const streams = ev.streams;
      setLocalCallStream(streams[0]);
    });

    //  ICE candidate handling
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketClient.emit("send-ice-candidate", {
          candidate: event.candidate,
          targetUserId,
        });
      }
    };
  }, [peerConnection, socketClient, activeChat]);

  peerConnection.onconnectionstatechange = () => {
    console.log("Connection State:", peerConnection.connectionState);
    if (peerConnection.connectionState === "connected") {
      // Peer-to-peer connection is established
      setCallStatus(peerConnection.connectionState);
    }
  };

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
