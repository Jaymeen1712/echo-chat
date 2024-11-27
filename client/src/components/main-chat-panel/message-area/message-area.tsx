import { useAppStore } from "@/store";
import MessageHeader from "./message-header";
import MessageInput from "./message-input";
import MessageList from "./message-list";

const MessageArea = () => {
  const { activeChat } = useAppStore();

  return (
    <div className="flex h-full flex-col px-4">
      {activeChat ? (
        <>
          <MessageHeader />
          <MessageList />
          <MessageInput />
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <h1 className="text-2xl">Select a chat</h1>
        </div>
      )}
    </div>
  );
};

export default MessageArea;
