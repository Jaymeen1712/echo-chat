import { AnimatePresence, motion } from "framer-motion";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import useMessageHeaderController from "./message-header-controller";

const MessageHeader = () => {
  const {
    activeChat,
    handleCallClick,
    handleContactTitleClick,
    messageSubHeader,
    isConversationActionContainerOpen,
    handleActionButtonClick,
    conversationActionContainerRef,
    handleDeleteConversation,
    conversationActionToggleContainerRef,
  } = useMessageHeaderController();

  const slideUpAnimation = {
    hidden: { opacity: 0 }, // Start from below with opacity 0
    visible: { opacity: 1 }, // Final position and full opacity
    exit: { opacity: 0 }, // Animate back down on exit
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  return (
    <div className="relative flex items-center justify-between">
      <div className="flex flex-col gap-y-1">
        <h1
          className="cursor-pointer text-3xl font-medium"
          onClick={handleContactTitleClick}
        >
          {activeChat?.name}
        </h1>
        {messageSubHeader}
      </div>

      <div className="flex gap-x-6 opacity-50">
        {/* <LuSearch className="cursor-pointer" size={32} /> */}
        {/* <IoCallOutline
          className="cursor-pointer"
          size={32}
          // onClick={handleCallClick}
        /> */}
        <div ref={conversationActionToggleContainerRef}>
          <BsThreeDotsVertical
            className="cursor-pointer"
            size={32}
            onClick={handleActionButtonClick}
          />
        </div>
      </div>

      {/* Conversation container */}
      <AnimatePresence>
        {isConversationActionContainerOpen && (
          <motion.div
            className="box-shadow-container absolute right-0 top-0 z-30 -translate-x-2 translate-y-[60px] rounded-xl bg-white-primary"
            ref={conversationActionContainerRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideUpAnimation}
          >
            <div className="flex flex-col rounded-xl bg-purple-primary/10 p-2">
              <div
                onClick={handleDeleteConversation}
                className="flex cursor-pointer items-center gap-x-2 rounded-lg p-2 pr-3 text-red-600 hover:bg-purple-primary/20"
              >
                <MdDelete size={22} />
                <span>Delete chat</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageHeader;
