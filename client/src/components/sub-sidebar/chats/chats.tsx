import { ChatHeader, ChatList } from "@/components/main-chat-panel";
import { DEFAULT_SUB_SIDEBAR_WIDTH } from "@/enums";
import { SubSidebarKeysType } from "@/types";
import { capitalizeWords } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import useChatsSubSideController from "./chats-controller";

interface ChatsSubSidebarProps {
  subSidebarKey: SubSidebarKeysType;
}

const ChatsSubSidebar: React.FC<ChatsSubSidebarProps> = ({ subSidebarKey }) => {
  const {
    handleClickNewChat,
    isNewChatOpen,
    handleChatClick,
    subSidebarUsers,
    subSidebarChats,
  } = useChatsSubSideController();

  const slideVariants = {
    hidden: {
      x: "-100%",
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
    visible: {
      x: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: {
      x: "-100%",
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden" // Ensure no content overflow
      style={{
        width: DEFAULT_SUB_SIDEBAR_WIDTH,
      }}
    >
      <div className="flex h-full flex-col gap-y-4">
        <div className="flex items-center justify-between px-2">
          <h1 className="text-xl">{capitalizeWords(subSidebarKey)}</h1>
          <img
            src="/chat-plus-icon.png"
            className="h-[20px] w-[20px] cursor-pointer"
            alt=""
            onClick={handleClickNewChat}
          />
        </div>
        {/* <ChatHeader /> */}
        <ChatList
          handleChatClick={handleChatClick}
          chatList={subSidebarChats}
        />
      </div>

      <AnimatePresence mode="wait">
        {isNewChatOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            className="absolute inset-0 z-10 h-full w-full bg-white-primary"
          >
            <motion.div
              key="new-chat-sidebar"
              className="flex h-full flex-col gap-y-4"
            >
              <div className="flex items-center gap-x-4 px-2">
                <MdOutlineKeyboardBackspace
                  size={24}
                  className="cursor-pointer"
                  onClick={handleClickNewChat}
                />
                <h1 className="text-xl">New Chat</h1>
              </div>
              <ChatHeader />
              <ChatList
                handleChatClick={handleChatClick}
                chatList={subSidebarUsers}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatsSubSidebar;
