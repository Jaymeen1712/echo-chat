import { ChatType } from "@/components/sub-sidebar/chats/chats-controller";
import ChatItem from "./chat-item";

interface ChatListProps {
  handleChatClick: (data: ChatType) => void;
  chatList: ChatType[];
}

const ChatList: React.FC<ChatListProps> = ({ handleChatClick, chatList }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {chatList.map((chat, index) => (
        <ChatItem
          key={chat.conversationId || index}
          chat={chat}
          handleChatClick={handleChatClick}
        />
      ))}
    </div>
  );
};

export default ChatList;
