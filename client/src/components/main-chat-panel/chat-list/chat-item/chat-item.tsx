import { ChatType } from "@/components/sub-sidebar/chats/chats-controller";
import { handleGetAvatarAlternativeURL } from "@/utils";
import useChatItemController from "./chat-item-controller";

interface ChatItemProps {
  chat: ChatType;
  handleChatClick: (data: ChatType) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, handleChatClick }) => {
  const {
    isCurrentChatItemActive,
    isCurrentUserLastMessageOwner,
    lastMessage,
    lastMessageTimestamp,
  } = useChatItemController({ chat });

  const { name, conversationId, isActive } = chat;

  return (
    <div
      className={`flex cursor-pointer items-center justify-center gap-x-4 rounded-xl px-2 py-3 text-sm transition-all hover:bg-purple-primary/10 ${isCurrentChatItemActive && "!bg-purple-primary/20"}`}
      onClick={() => handleChatClick(chat)}
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
            <div className="animate-blink h-2 w-2 rounded-full bg-contrast-color" />
          )}
          <h4 className="text-base font-semibold leading-7">{name}</h4>
        </div>
        <span className="flex gap-x-2 leading-7">
          {conversationId && (
            <span className="text-purple-primary">
              {isCurrentUserLastMessageOwner ? "You:" : `${name}:`}
            </span>
          )}
          <span className="line-clamp-1 flex-1 text-ellipsis break-all opacity-50">
            {lastMessage}
          </span>
        </span>
      </div>
      <div>
        <span className="opacity-50">{lastMessageTimestamp}</span>
      </div>
    </div>
  );
};

export default ChatItem;
