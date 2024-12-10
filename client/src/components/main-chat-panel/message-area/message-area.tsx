import { IoCallOutline } from "react-icons/io5";
import useMessageAreaController from "./message-area-controller";
import MessageHeader from "./message-header";
import MessageInput from "./message-input";
import MessageList from "./message-list";

const MessageArea = () => {
  const {
    activeChat,
    receivedOffer,
    handleDeclineCall,
    handleAcceptCall,
    isSenderTyping,
    subSidebarChats,
  } = useMessageAreaController();

  return (
    <div className="flex h-full flex-col px-4">
      {receivedOffer ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-y-6">
            <IoCallOutline className="cursor-pointer" size={70} />
            <h1 className="text-lg">Incoming call from</h1>
            <img
              src={receivedOffer?.senderDetails.image}
              alt="incoming-user-img"
              className="flex h-[180px] w-[180px] items-center justify-center rounded-full border bg-white-primary"
            />
            <h1 className="text-2xl">{receivedOffer?.senderDetails.name}</h1>
            <div className="flex gap-x-4">
              <button
                className="rounded-xl bg-red-600 px-4 py-2 text-white-primary transition hover:bg-red-700"
                onClick={handleDeclineCall}
              >
                Decline
              </button>
              <button
                className="rounded-xl bg-green-600 px-4 py-2 text-white-primary transition hover:bg-green-700"
                onClick={handleAcceptCall}
              >
                Accept
              </button>
            </div>
          </div>

          <audio id="remote-audio" autoPlay></audio>
        </div>
      ) : (
        <>
          {activeChat ? (
            <>
              <MessageHeader />
              <MessageList />
              {isSenderTyping && (
                <div className="container">
                  <div className="flex items-center gap-x-1 pb-6 text-purple-dark-1">
                    <span>Typing</span>
                    <span className="flex items-center gap-0.5">
                      <span className="dot-animation bg-purple-dark-1"></span>
                      <span className="dot-animation bg-purple-dark-1"></span>
                      <span className="dot-animation bg-purple-dark-1"></span>
                    </span>
                  </div>
                </div>
              )}
              <MessageInput />
            </>
          ) : (
            <>
              {subSidebarChats.length ? (
                <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-y-4">
                  <img
                    src={"/select-chat-container.png"}
                    className="h-[180px] w-[180px]"
                    alt=""
                  />
                  <div className="flex flex-col items-center gap-y-2 text-lg">
                    <h1>Welcome back!</h1>
                    <div className="text-2xl font-semibold text-purple-dark-1">
                      Select a chat to get started
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MessageArea;
