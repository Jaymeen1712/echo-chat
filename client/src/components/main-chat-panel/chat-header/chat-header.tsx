import { LuSearch } from "react-icons/lu";
import useChatHeaderController from "./chat-header-controller";

const ChatHeader = () => {
  const { handleOnChangeSearchInput } = useChatHeaderController();

  return (
    <div className="relative px-2 text-sm text-black-primary">
      <input
        className="w-full rounded-xl bg-purple-primary/20 p-3 pl-12 placeholder:text-black-primary/50 focus:outline-none"
        placeholder="Search"
        onChange={handleOnChangeSearchInput}
      />
      <LuSearch
        className="absolute left-8 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"
        size={22}
      />
    </div>
  );
};

export default ChatHeader;
