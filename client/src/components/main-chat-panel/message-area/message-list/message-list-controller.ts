import { useGetAllMessagesQuery } from "@/queries";
import { useAppStore } from "@/store";
import { GetAllMessagesType, SingleMessageType } from "@/types";
import { handleGroupMessagesByDate } from "@/utils";
import { socketClient } from "@/wrapper";
import { useEffect, useRef, useState } from "react";

export interface SingleMessageWithTypeType extends SingleMessageType {
  type: "sender" | "receiver";
}

const useMessageListController = () => {
  const {
    activeChat,
    currentUserData,
    setActiveMessages,
    activeMessages,
    patchActiveMessages,
  } = useAppStore();

  const {
    refetch: getAllMessagesRefetch,
    data: getAllMessagesData,
    isLoading: isGetAllMessagesLoading,
    dataUpdatedAt: getAllMessagesDataUpdated,
  } = useGetAllMessagesQuery({
    conversationId: activeChat?.conversationId || "",
  });

  const [showScrollButton, setShowScrollButton] = useState(false);

  const messageListContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messageListContainerRef.current) {
      messageListContainerRef.current.scrollTop =
        messageListContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (messageListContainerRef.current) {
      const handleScroll = () => {
        if (messageListContainerRef.current) {
          if (messageListContainerRef.current.scrollTop < -300) {
            setShowScrollButton(true);
          } else {
            setShowScrollButton(false);
          }
        }
      };

      const container = messageListContainerRef.current;
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    // Set messages
    if (getAllMessagesData && currentUserData) {
      const messages = getAllMessagesData.data.data
        .messages as GetAllMessagesType;

      const messagesWithType = messages.map((message) => {
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
      });

      const groupedMessagesByDate = handleGroupMessagesByDate(messagesWithType);

      setActiveMessages(groupedMessagesByDate);
    }
  }, [currentUserData?.userId, getAllMessagesDataUpdated]);

  useEffect(() => {
    if (activeChat && !activeChat.isChatTemp) {
      getAllMessagesRefetch();
    } else {
      setActiveMessages([]);
    }
  }, [activeChat?.isChatTemp, activeChat?.conversationId]);

  useEffect(() => {
    socketClient.on("update-message", (data) => {
      const { message } = data;

      if (
        activeChat?.conversationId === message.conversation &&
        message.sender._id !== currentUserData?._id
      ) {
        patchActiveMessages(message);
      }

      if (!activeChat?.conversationId || !currentUserData?._id) return;

      socketClient.emit("update-seen-messages", {
        conversationId: activeChat?.conversationId,
        senderId: currentUserData?._id,
      });
    });
  }, [socketClient, currentUserData]);

  return {
    activeMessages,
    isGetAllMessagesLoading,
    showScrollButton,
    scrollToBottom,
    messageListContainerRef,
  };
};

export default useMessageListController;
