import MessageHeader from "./message-header";
import MessageInput from "./message-input";
import MessageList from "./message-list";

const MessageArea = () => {
  return (
    <div className="flex h-full flex-col px-4">
      <MessageHeader />
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default MessageArea;
