import { ChatHeader, ChatList } from "@/components/main-chat-panel";
import { SubSidebarKeysType } from "@/types";
import { capitalizeWords } from "@/utils";
import { IoChatboxEllipses } from "react-icons/io5";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import useChatsSubSideController from "./chats-controller";
import { DEFAULT_SUB_SIDEBAR_WIDTH } from "@/enums";

interface ChatsSubSidebarProps {
  subSidebarKey: SubSidebarKeysType;
}

const ChatsSubSidebar: React.FC<ChatsSubSidebarProps> = ({ subSidebarKey }) => {
  const {
    handleClickNewChat,
    isNewChatOpen,
    isSearchUserLoading,
    handleChatClick,
    isGetAllConversationsLoading,
  } = useChatsSubSideController();

  return (
    <div
      className="flex flex-col gap-y-4"
      style={{
        width: DEFAULT_SUB_SIDEBAR_WIDTH,
      }}
    >
      {!isNewChatOpen ? (
        <>
          <div className="flex items-center justify-between px-2">
            <h1 className="text-xl">{capitalizeWords(subSidebarKey)}</h1>
            <IoChatboxEllipses
              size={24}
              className="cursor-pointer"
              onClick={handleClickNewChat}
            />
          </div>
          <ChatHeader />
          {!isGetAllConversationsLoading && (
            <ChatList handleChatClick={handleChatClick} />
          )}
        </>
      ) : (
        <>
          <div className="flex items-center gap-x-4 px-2">
            <MdOutlineKeyboardBackspace
              size={24}
              className="cursor-pointer"
              onClick={handleClickNewChat}
            />
            <h1 className="text-xl">New Chat</h1>
          </div>
          <ChatHeader />
          {!isSearchUserLoading && (
            <ChatList handleChatClick={handleChatClick} />
          )}
        </>
      )}
    </div>
  );
};

export default ChatsSubSidebar;
