import { useDeleteConversationMutation } from "@/queries";
import { useAppStore } from "@/store";
import { CallingSenderReceiverDetails } from "@/types";
import { convertDateIntoTimeAgoFormat } from "@/utils";
import { peerConnection, socketClient } from "@/wrapper";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

const useMessageHeaderController = () => {
  const {
    activeChat,
    currentUserData,
    setIsContactInfoContainerOpen,
    setActiveChat,
    deleteSubSidebarChat,
  } = useAppStore();

  const [
    isConversationActionContainerOpen,
    setIsConversationActionContainerOpen,
  ] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const conversationActionContainerRef = useRef<HTMLDivElement | null>(null);
  const conversationActionToggleContainerRef = useRef<HTMLDivElement | null>(
    null,
  );

  const deleteConversationMutation = useDeleteConversationMutation();

  const {
    mutate: deleteConversationMutate,
    data: deleteConversationData,
    isError: deleteConversationIsError,
  } = deleteConversationMutation;

  const messageSubHeader = useMemo(() => {
    if (activeChat?.isActive) {
      return <span>Online</span>;
    } else {
      return (
        <span>
          Last online {convertDateIntoTimeAgoFormat(activeChat?.lastActive)} ago
        </span>
      );
    }
  }, [activeChat?.isActive, activeChat?.lastActive]);

  const handleActionButtonClick = () => {
    setIsConversationActionContainerOpen((prev) => !prev);
  };

  const handleContactTitleClick = () => {
    setIsContactInfoContainerOpen(true);
  };

  const handleDeleteConversation = () => {
    if (!activeChat?.conversationId) return;

    const { conversationId } = activeChat;
    deleteConversationMutate({
      conversationId,
    });
  };

  const createOffer = useCallback(
    async ({
      senderUserDetails,
      targetUserId,
    }: {
      senderUserDetails: CallingSenderReceiverDetails;
      targetUserId: string;
    }) => {
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socketClient.emit("send-offer", {
          senderUserDetails,
          targetUserId,
          offer,
        });
      } catch (error) {
        console.error("🚀 ~ createOffer ~ Error creating offer:", error);
      }
    },
    [peerConnection, socketClient],
  );

  const handleCallClick = useCallback(async () => {
    if (!activeChat) return;

    const { userId: targetUserId } = activeChat;

    if (!targetUserId) {
      console.error("Target user ID is not available.");
      return;
    }

    try {
      // Get user media (audio only)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      if (!currentUserData) {
        toast.error("Something went wrong, please try again.");
        return;
      }

      const { _id: userId, name } = currentUserData;

      // Initiate call by creating an offer
      await createOffer({
        senderUserDetails: {
          name,
          userId,
          image: currentUserData.image,
        },
        targetUserId,
      });
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, [activeChat, peerConnection, createOffer, socketClient, currentUserData]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        conversationActionContainerRef.current &&
        conversationActionToggleContainerRef.current &&
        !conversationActionContainerRef.current.contains(e.target as Node) &&
        !conversationActionToggleContainerRef.current.contains(e.target as Node)
      ) {
        setIsConversationActionContainerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!activeChat?.conversationId) return;

    if (
      deleteConversationData &&
      deleteConversationData.data.isError === false
    ) {
      setActiveChat(undefined);
      deleteSubSidebarChat(activeChat?.conversationId);
      setIsConversationActionContainerOpen(false);
      toast.success("Chat deleted successfully.");
    }

    if (deleteConversationIsError) {
      toast.error("Something went wrong, please try again.");
    }
  }, [deleteConversationData, activeChat?.conversationId]);

  // useEffect(() => {
  //   return () => {
  //     socketClient.off("offer");
  //     socketClient.off("answer");
  //     socketClient.off("ice-candidate");
  //   };
  // }, [socketClient, peerConnection]);

  // useEffect(() => {
  //   return () => {
  //     // Clean up resources when unmounting
  //     peerConnection.close();
  //     localStream?.getTracks().forEach((track) => track.stop());
  //     setLocalStream(null);
  //   };
  // }, [localStream, peerConnection]);

  return {
    activeChat,
    handleCallClick,
    handleContactTitleClick,
    messageSubHeader,
    isConversationActionContainerOpen,
    handleActionButtonClick,
    conversationActionContainerRef,
    handleDeleteConversation,
    conversationActionToggleContainerRef
  };
};

export default useMessageHeaderController;

// Flow of Communication
// Caller (Client A):

// Creates an offer using RTCPeerConnection.createOffer.
// Sends the offer to the signaling server via socket.emit("offer").
// Signaling Server:

// Relays the offer to the target client (Client B) using socket.emit("offer").
// Callee (Client B):

// Receives the offer.
// Sets the remote description (setRemoteDescription) and creates an answer (createAnswer).
// Sends the answer back to the server via socket.emit("answer").
// Signaling Server:

// Relays the answer back to the caller (Client A).
// Both Clients:

// Exchange ICE candidates via socket.emit("ice-candidate") and RTCPeerConnection.addIceCandidate.
// Media Flow:

// Once signaling is complete, a direct peer-to-peer connection is established for audio/video streaming.
