import { ChatType } from "@/components/sub-sidebar/chats/chats-controller";
import { useAppStore } from "@/store";
import ChatItem from "./chat-item";

interface ChatListProps {
  handleChatClick: (data: ChatType) => void;
}

const ChatList: React.FC<ChatListProps> = ({ handleChatClick }) => {
  const { subSidebarChats } = useAppStore();
  console.log("🚀 ~ subSidebarChats:", subSidebarChats)

  return (
    <div className="flex-1 overflow-y-auto">
      {subSidebarChats.map((chat, index) => (
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
