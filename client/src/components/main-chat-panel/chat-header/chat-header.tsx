import { LuSearch } from "react-icons/lu";

const ChatHeader = () => {
  return (
    <div className="relative text-sm text-black-primary">
      <input
        className="w-full rounded-xl bg-purple-primary/30 p-3 pl-12 placeholder:text-black-primary/50 focus:outline-none"
        placeholder="Search"
      />
      <LuSearch
        className="absolute left-6 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"
        size={22}
      />
    </div>
  );
};

export default ChatHeader;
