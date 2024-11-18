import { ChatHeader, ChatList, MessageArea } from "../../components";

const AllChatsPage = () => {
  return (
    <div className="flex h-full w-full gap-x-8 overflow-y-auto rounded-3xl bg-white-primary py-6 px-4">
      <div className="flex w-[340px] flex-col gap-y-4">
        <ChatHeader />
        <ChatList />
      </div>
      <div className="flex-1">
        <MessageArea />
      </div>
    </div>
  );
};

export default AllChatsPage;
