import { LuSearch } from "react-icons/lu";

const MessageHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-3xl font-medium">Design chat</h1>
        <span className="text-sm opacity-50">23 members, 10 online</span>
      </div>

      <div className="flex gap-x-6 opacity-50">
        <LuSearch className="cursor-pointer" size={32} />
        <LuSearch className="cursor-pointer" size={32} />
        <LuSearch className="cursor-pointer" size={32} />
      </div>
    </div>
  );
};

export default MessageHeader;