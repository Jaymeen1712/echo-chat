import ChatItem from "./chat-item";

const ChatList = () => {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {[...Array(10)].map((_, index) => (
        <ChatItem key={index} />
      ))}
    </div>
  );
};

export default ChatList;
