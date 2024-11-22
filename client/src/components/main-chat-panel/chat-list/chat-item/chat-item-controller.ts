import { ChatType } from "@/components/sub-sidebar/chats/chats-controller";
import { useAppStore } from "@/store";
import { useEffect, useMemo, useState } from "react";

interface ChatItemControllerProps {
  chat: ChatType;
}

const useChatItemController = ({ chat }: ChatItemControllerProps) => {
  const [isCurrentChatItemActive, setIsCurrentChatItemActive] = useState(false);

  const { activeChat, currentUserData } = useAppStore();

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

  return { isCurrentChatItemActive, isCurrentUserLastMessageOwner };
};

export default useChatItemController;
