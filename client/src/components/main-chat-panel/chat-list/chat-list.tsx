import { ChatType } from "@/components/sub-sidebar/chats/chats-controller";
import { useAppStore } from "@/store";
import ChatItem from "./chat-item";

interface ChatListProps {
  handleChatClick: (data: ChatType) => void;
  chatList: ChatType[];
  isUserList: boolean;
}

const ChatList: React.FC<ChatListProps> = ({
  handleChatClick,
  chatList,
  isUserList,
}) => {
  const { toggleNewChat } = useAppStore();

  return (
    <div className="flex-1 overflow-y-auto">
      {chatList.length ? (
        <>
          {chatList.map((chat, index) => (
            <ChatItem
              key={chat.conversationId || index}
              chat={chat}
              handleChatClick={handleChatClick}
            />
          ))}
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-y-8">
          <img
            src={
              isUserList
                ? "/empty-user-container.png"
                : "/empty-chat-container.png"
            }
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
    </div>
  );
};

export default ChatList;
