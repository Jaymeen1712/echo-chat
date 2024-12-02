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
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const {
    currentUserData,
    setReceivedOffer,
    setReceivedCandidate,
    receivedCandidate,
    activeChat,
  } = useAppStore();

  useEffect(() => {
    if (currentUserData) {
      const { _id: currentUserId } = currentUserData;
      socketClient.emit("register", currentUserId);
    }
  }, [socketClient, currentUserData]);

  useEffect(() => {
    if (!currentUserData) return;

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
        setReceivedCandidate(candidate);
      }
    });
  }, [socketClient, peerConnection, currentUserData]);

  useEffect(() => {
    if (peerConnection.remoteDescription) {
      peerConnection.addIceCandidate(new RTCIceCandidate(receivedCandidate));
    }
  }, [peerConnection, receivedCandidate]);

  useEffect(() => {
    if (!activeChat) return;

    const { userId: targetUserId } = activeChat;

    if (!targetUserId) return;

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

  // Listen for remote stream
  peerConnection.ontrack = (event) => {
    const remoteAudio = document.getElementById(
      "remote-audio",
    ) as HTMLAudioElement;

    if (remoteAudio) {
      remoteAudio.srcObject = event.streams[0];
    } else {
      console.error("Remote audio element not found.");
    }
  };

  peerConnection.oniceconnectionstatechange = () => {
    console.log("ICE Connection State:", peerConnection.iceConnectionState);

    if (
      peerConnection.iceConnectionState === "connected" ||
      peerConnection.iceConnectionState === "completed"
    ) {
      console.log("ICE connection established.");
    }
  };

  peerConnection.onconnectionstatechange = () => {
    console.log("Connection State:", peerConnection.connectionState);

    if (peerConnection.connectionState === "connected") {
      console.log("Peer-to-peer connection established!");
    }
  };

  peerConnection.ontrack = (event) => {
    console.log("Remote track received:", event.streams[0]);
  };

  peerConnection.onsignalingstatechange = () => {
    console.log("Signaling State:", peerConnection.signalingState);
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
