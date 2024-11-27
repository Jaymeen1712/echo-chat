import MessageItem from "./message-item";
import useMessageListController from "./message-list-controller";

const MessageList = () => {
  const { activeMessages, isGetAllMessagesLoading } =
    useMessageListController();

  return (
    <div className="flex flex-1 flex-col-reverse gap-y-4 overflow-y-auto py-4">
      {!isGetAllMessagesLoading &&
        activeMessages.map(({ date, label, messages }) => (
          <div key={date}>
            <h1 className="mb-2 text-center">{label}</h1>
            <div className="flex flex-col gap-y-2">
              {messages.map((message) => (
                <MessageItem
                  type={message.type}
                  message={message}
                  key={message._id}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default MessageList;
