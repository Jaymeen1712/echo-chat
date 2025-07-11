import { ChatType } from "@/components/sub-sidebar/chats/chats-controller";
import { handleGetAvatarAlternativeURL } from "@/utils";
import React, { memo, useCallback } from "react";
import useChatItemController from "./chat-item-controller";

interface ChatItemProps {
  chat: ChatType;
  handleChatClick: (data: ChatType) => void;
}

const ChatItem: React.FC<ChatItemProps> = memo(({ chat, handleChatClick }) => {
  const {
    isCurrentChatItemActive,
    isCurrentUserLastMessageOwner,
    lastMessage,
    lastMessageTimestamp,
    isSenderTyping,
  } = useChatItemController({ chat });

  const { name, conversationId, isActive, unreadMessagesCount } = chat;

  // Memoize the click handler to prevent unnecessary re-renders
  const handleClick = useCallback(() => {
    handleChatClick(chat);
  }, [handleChatClick, chat]);

  return (
    <div
      className={`flex cursor-pointer items-center justify-center gap-x-4 rounded-xl px-2 py-3 text-sm transition-all hover:bg-purple-primary/10 ${isCurrentChatItemActive && "!bg-purple-primary/20"}`}
      onClick={handleClick}
    >
      <div className="avatar">
        <img
          src={chat?.image || handleGetAvatarAlternativeURL(name)}
          alt="avatarImg"
          className="h-[40px] w-[40px] object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-x-2">
          {isActive && (
            <div className="animate-blink h-2 w-2 rounded-full bg-red-danger" />
          )}
          <h4 className="text-base font-semibold leading-7">{name}</h4>
        </div>
        {isSenderTyping ? (
          <div className="flex items-center gap-x-1 text-purple-dark-1">
            <span>Typing</span>
            <span className="flex items-center gap-0.5">
              <span className="dot-animation bg-purple-dark-1"></span>
              <span className="dot-animation bg-purple-dark-1"></span>
              <span className="dot-animation bg-purple-dark-1"></span>
            </span>
          </div>
        ) : (
          <div className="flex gap-x-2 leading-7">
            {conversationId && (
              <span className="text-purple-primary">
                {isCurrentUserLastMessageOwner ? "You:" : `${name}:`}
              </span>
            )}
            <span className="line-clamp-1 flex-1 text-ellipsis break-all opacity-50">
              {lastMessage}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-between gap-y-2">
        <span className="opacity-50">{lastMessageTimestamp}</span>
        {unreadMessagesCount > 0 && (
          <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-red-danger text-xs text-white-primary">
            {unreadMessagesCount}
          </span>
        )}
      </div>
    </div>
  );
});

ChatItem.displayName = "ChatItem";

export default ChatItem;
