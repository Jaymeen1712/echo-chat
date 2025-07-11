import { ChatType } from "@/components/sub-sidebar/chats/chats-controller";
import { useAppStore } from "@/store";
import React, { memo, useMemo } from "react";
import ChatItem from "./chat-item";

interface ChatListProps {
  handleChatClick: (data: ChatType) => void;
  chatList: ChatType[];
  isUserList: boolean;
  isLoading: boolean;
}

const ChatList: React.FC<ChatListProps> = memo(
  ({ handleChatClick, chatList, isUserList, isLoading }) => {
    const { toggleNewChat } = useAppStore();

    // Memoize the empty state image source
    const emptyStateImage = useMemo(
      () =>
        isUserList ? "/empty-user-container.png" : "/empty-chat-container.png",
      [isUserList],
    );

    // Memoize the chat items to prevent unnecessary re-renders
    const chatItems = useMemo(
      () =>
        chatList.map((chat, index) => (
          <ChatItem
            key={chat.conversationId || `${chat.name}-${index}`}
            chat={chat}
            handleChatClick={handleChatClick}
          />
        )),
      [chatList, handleChatClick],
    );

    return (
      <div className="flex-1 overflow-y-auto">
        {!isLoading ? (
          <>
            {chatList.length ? (
              <div className="space-y-1">{chatItems}</div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-y-8">
                <img
                  src={emptyStateImage}
                  className="h-[180px] w-[180px]"
                  alt=""
                />
                <div className="flex flex-col items-center gap-y-2 text-lg">
                  <h1>No {isUserList ? "users" : "chats"} yet.</h1>
                  {!isUserList && (
                    <div
                      className="cursor-pointer text-2xl font-semibold text-purple-dark-1"
                      onClick={toggleNewChat}
                    >
                      Start a New Chat
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    );
  },
);

ChatList.displayName = "ChatList";

export default ChatList;
