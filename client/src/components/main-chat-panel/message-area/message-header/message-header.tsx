import { AnimatePresence, motion } from "framer-motion";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoCallOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import ReactPlayer from "react-player";
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
    localStream,
  } = useMessageHeaderController();

  const slideUpAnimation = {
    hidden: { opacity: 0, y: 0, scale: 0.25 }, // Start below with smaller size
    visible: { opacity: 1, y: 60, scale: 1 }, // Full opacity and normal size
    exit: { opacity: 0, y: 0, scale: 0.25 }, // Animate back down and shrink
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }, // Custom easing
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
        <IoCallOutline
          className="cursor-pointer"
          size={32}
          onClick={handleCallClick}
        />
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

      <div className="hidden">
        <ReactPlayer url={localStream} playing muted />
      </div>
    </div>
  );
};

export default MessageHeader;
