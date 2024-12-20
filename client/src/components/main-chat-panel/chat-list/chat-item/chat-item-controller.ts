import { ChatType } from "@/components/sub-sidebar/chats/chats-controller";
import { useAppStore } from "@/store";
import { convertDateIntoTimeAgoFormat } from "@/utils";
import { socketClient } from "@/wrapper";
import { useEffect, useMemo, useState } from "react";

interface ChatItemControllerProps {
  chat: ChatType;
}

const useChatItemController = ({ chat }: ChatItemControllerProps) => {
  const [isCurrentChatItemActive, setIsCurrentChatItemActive] = useState(false);
  const [isSenderTyping, setIsSenderTyping] = useState(false);

  const { activeChat, currentUserData } = useAppStore();

  const lastMessage = useMemo(() => {
    // If chat has content, return it
    if (chat?.content) return chat.content;

    // Otherwise, handle the files
    const files = chat?.files || [];

    if (!files.length) return "No messages yet";

    if (files.length === 1) {
      const file = files[0];
      const filePrefix = file.type.includes("audio") ? "Audio" : "File";
      return `${filePrefix}: ${file.name}`;
    }

    // If there are multiple files, return "Files"
    return "Files";
  }, [chat]);

  const lastMessageTimestamp = useMemo(
    () => convertDateIntoTimeAgoFormat(chat.updatedAt),
    [chat.updatedAt],
  );

  const isCurrentUserLastMessageOwner = useMemo(
    () => chat.senderId === currentUserData?.userId,
    [chat.senderId, currentUserData?.userId],
  );

  useEffect(() => {
    if (!activeChat) return;

    if (activeChat.isChatTemp) {
      setIsCurrentChatItemActive(activeChat.userId === chat.senderId);
    } else {
      setIsCurrentChatItemActive(
        activeChat.conversationId === chat.conversationId,
      );
    }
  }, [activeChat]);

  useEffect(() => {
    if (!chat.conversationId) return;
    socketClient.on("receive-true-typing", ({ conversationId }) => {
      if (conversationId === chat.conversationId) {
        setIsSenderTyping(true);
      }
    });
    socketClient.on("receive-false-typing", ({ conversationId }) => {
      if (conversationId === chat.conversationId) {
        setIsSenderTyping(false);
      }
    });
  }, [socketClient, chat.conversationId]);

  return {
    isCurrentChatItemActive,
    isCurrentUserLastMessageOwner,
    lastMessage,
    lastMessageTimestamp,
    isSenderTyping,
  };
};

export default useChatItemController;
