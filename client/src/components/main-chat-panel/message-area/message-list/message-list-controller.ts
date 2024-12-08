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
      const container = messageListContainerRef.current;
      const distanceToScroll = container.scrollHeight - container.scrollTop; // Distance left to scroll
      const totalScrollableHeight = container.scrollHeight; // Total scrollable height

      // Calculate scroll duration dynamically
      const baseDuration = 500; // Base scroll time for full scroll
      const scrollDuration =
        (distanceToScroll / totalScrollableHeight) * baseDuration;

      const startTime = performance.now();
      const startScrollPosition = container.scrollTop;
      const targetScrollPosition = container.scrollHeight;

      const animateScroll = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / scrollDuration, 1);

        container.scrollTop =
          startScrollPosition +
          (targetScrollPosition - startScrollPosition) * progress;

        if (progress < 1) {
          window.requestAnimationFrame(animateScroll);
        }
      };

      window.requestAnimationFrame(animateScroll);
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
