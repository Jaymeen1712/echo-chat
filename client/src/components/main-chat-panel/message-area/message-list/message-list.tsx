import { AnimatePresence, motion } from "framer-motion";
import React, { memo, useMemo } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FixedSizeList as List } from "react-window";
import MessageItem from "./message-item";
import useMessageListController, {
  SingleMessageWithTypeType,
} from "./message-list-controller";

// Memoized message group component
const MessageGroup = memo(
  ({
    date,
    label,
    messages,
  }: {
    date: string;
    label: string;
    messages: SingleMessageWithTypeType[];
  }) => (
    <div className="mb-4">
      <h1 className="mb-2 text-center text-sm text-gray-500">{label}</h1>
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
  ),
);

MessageGroup.displayName = "MessageGroup";

// Virtualized list item component
const VirtualizedMessageItem = memo(
  ({
    index,
    style,
    data,
  }: {
    index: number;
    style: React.CSSProperties;
    data: {
      date: string;
      label: string;
      messages: SingleMessageWithTypeType[];
    }[];
  }) => {
    const group = data[index];
    return (
      <div style={style}>
        <MessageGroup {...group} />
      </div>
    );
  },
);

VirtualizedMessageItem.displayName = "VirtualizedMessageItem";

const MessageList = () => {
  const {
    activeMessages,
    isGetAllMessagesLoading,
    showScrollButton,
    scrollToBottom,
    messageListContainerRef,
    listHeight,
  } = useMessageListController();

  // Memoize the flattened message groups for virtualization
  const messageGroups = useMemo(() => {
    return activeMessages.map(({ date, label, messages }) => ({
      date,
      label,
      messages,
    }));
  }, [activeMessages]);

  // Calculate estimated item height (adjust based on your message heights)
  const estimatedItemHeight = 120;

  return (
    <div className="relative flex flex-1 flex-col-reverse overflow-hidden py-6">
      {!isGetAllMessagesLoading ? (
        <>
          {activeMessages.length ? (
            <div className="flex-1" ref={messageListContainerRef}>
              {messageGroups.length > 10 ? (
                // Use virtualization for large lists
                <List
                  height={listHeight}
                  width="100%"
                  itemCount={messageGroups.length}
                  itemSize={estimatedItemHeight}
                  itemData={messageGroups}
                  style={{ direction: "ltr" }}
                  className="flex flex-col-reverse"
                >
                  {VirtualizedMessageItem}
                </List>
              ) : (
                // Render normally for small lists
                <div className="container flex flex-col-reverse gap-y-4 overflow-y-auto">
                  {messageGroups.map((group) => (
                    <MessageGroup key={group.date} {...group} />
                  ))}
                </div>
              )}
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
