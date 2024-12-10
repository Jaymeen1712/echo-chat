import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import MessageItem from "./message-item";
import useMessageListController from "./message-list-controller";

const MessageList = () => {
  const {
    activeMessages,
    isGetAllMessagesLoading,
    showScrollButton,
    scrollToBottom,
    messageListContainerRef,
  } = useMessageListController();

  return (
    <div className="relative flex flex-1 flex-col-reverse overflow-y-auto py-6">
      {!isGetAllMessagesLoading ? (
        <>
          {activeMessages.length ? (
            <div
              className="container flex flex-col-reverse gap-y-4 overflow-y-auto"
              ref={messageListContainerRef}
            >
              {activeMessages.map(({ date, label, messages }) => (
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
          ) : (
            <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-y-4">
              <img
                src={"/empty-message-container.png"}
                className="h-[180px] w-[180px]"
                alt=""
              />
              <div className="flex flex-col items-center gap-y-2 text-lg">
                <h1>No messages yet.</h1>
                <div className="text-2xl font-semibold text-purple-dark-1">
                  Your messages will appear here
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}

      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2"
          >
            <button
              onClick={scrollToBottom}
              className="cursor-pointer rounded-full bg-purple-dark-1 p-1 text-white-primary shadow-2xl hover:bg-opacity-95"
            >
              <MdOutlineKeyboardArrowDown size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageList;
