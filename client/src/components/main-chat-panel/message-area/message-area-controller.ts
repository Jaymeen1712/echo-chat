import { useAppStore } from "@/store";
import { GetAllMessagesType } from "@/types";
import { handleGroupMessagesByDate } from "@/utils";
import { peerConnection, socketClient } from "@/wrapper";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const useMessageAreaController = () => {
  const {
    receivedOffer,
    activeChat,
    setReceivedOffer,
    onlineUsers,
    patchActiveMessagesIsDeliveredField,
    currentUserData,
    setActiveMessages,
  } = useAppStore();

  const [isSenderTyping, setIsSenderTyping] = useState(false);

  const createAnswer = useCallback(
    async ({
      offer,
      senderUserId,
    }: {
      offer: RTCSessionDescriptionInit;
      senderUserId: string;
    }) => {
      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer),
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socketClient.emit("send-answer", { senderUserId, answer });
      } catch (error) {
        console.error("Error creating answer:", error);
      }
    },
    [peerConnection, socketClient],
  );

  const handleDeclineCall = () => {
    setReceivedOffer(undefined);
  };

  const handleAcceptCall = useCallback(async () => {
    if (!receivedOffer) {
      toast.error("Something went wrong while accepting offer");
      return;
    }

    const { offer, senderDetails } = receivedOffer;
    await createAnswer({
      offer,
      senderUserId: senderDetails.userId,
    });
  }, [peerConnection, socketClient, receivedOffer]);

  useEffect(() => {
    if (!activeChat?.conversationId || !currentUserData?._id) return;

    socketClient.emit("update-seen-messages", {
      conversationId: activeChat?.conversationId,
      senderId: currentUserData?._id,
    });
  }, [socketClient, activeChat?.conversationId]);

  useEffect(() => {
    if (!activeChat?.userId) return;

    const { userId } = activeChat;

    if (onlineUsers.includes(userId)) {
      patchActiveMessagesIsDeliveredField();
    }
  }, [activeChat?.userId, onlineUsers]);

  useEffect(() => {
    if (!activeChat || !currentUserData) return;
    socketClient.on("updated-seen-messages", ({ messages, conversationId }) => {
      if (activeChat.conversationId === conversationId) {
        const messagesWithType = (messages as GetAllMessagesType).map(
          (message) => {
            let type: "sender" | "receiver";
            if (message.sender._id === currentUserData.userId) {
              type = "receiver";
            } else {
              type = "sender";
            }
            return {
              ...message,
              type,
            };
          },
        );

        const groupedMessagesByDate =
          handleGroupMessagesByDate(messagesWithType);

        setActiveMessages(groupedMessagesByDate);
      }
    });
  }, [socketClient, activeChat, currentUserData]);

  useEffect(() => {
    if (!activeChat?.conversationId) return;
    socketClient.on("receive-true-typing", ({ conversationId }) => {
      if (conversationId === activeChat.conversationId) {
        setIsSenderTyping(true);
      }
    });
    socketClient.on("receive-false-typing", ({ conversationId }) => {
      if (conversationId === activeChat.conversationId) {
        setIsSenderTyping(false);
      }
    });
  }, [socketClient, activeChat?.conversationId]);

  return {
    activeChat,
    receivedOffer,
    handleDeclineCall,
    handleAcceptCall,
    isSenderTyping,
  };
};

export default useMessageAreaController;
