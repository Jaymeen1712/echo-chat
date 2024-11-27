import { ChatType } from "@/components/sub-sidebar/chats/chats-controller";
import useChatItemController from "./chat-item-controller";

interface ChatItemProps {
  chat: ChatType;
  handleChatClick: (data: ChatType) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, handleChatClick }) => {
  const { isCurrentChatItemActive, isCurrentUserLastMessageOwner } =
    useChatItemController({ chat });

  const { name, content = "", conversationId } = chat;

  return (
    <div
      className={`flex cursor-pointer items-center justify-center gap-x-4 rounded-xl px-2 py-3 text-sm transition-all hover:bg-purple-primary/10 ${isCurrentChatItemActive && "!bg-purple-primary/20"}`}
      onClick={() => handleChatClick(chat)}
    >
      <div className="avatar">
        <img src="/user-avatar-1.png" alt="Avatar" />
      </div>
      <div className="flex-1">
        <h4 className="text-base font-semibold leading-7">{name}</h4>
        <span className="flex gap-x-2 leading-7">
          <span className="text-purple-primary">
            {conversationId &&
              (isCurrentUserLastMessageOwner ? "You:" : `${name}:`)}
          </span>
          <span className="line-clamp-1 flex-1 text-ellipsis break-all opacity-50">
            {content}
          </span>
        </span>
      </div>
      <div>
        <span className="opacity-50">4m</span>
      </div>
    </div>
  );
};

export default ChatItem;
