import MessageItem from "./message-item";

const MessageList = () => {
  return (
    <div className="flex flex-1 flex-col-reverse gap-y-2 overflow-y-auto py-4">
      <MessageItem type={"sender"} />
      <MessageItem type={"receiver"} />
      <MessageItem type={"receiver"} />
      <MessageItem type={"sender"} />
    </div>
  );
};

export default MessageList;
