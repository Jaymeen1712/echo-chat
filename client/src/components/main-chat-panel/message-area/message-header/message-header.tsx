import { BsThreeDotsVertical } from "react-icons/bs";
import { IoCallOutline } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import useMessageHeaderController from "./message-header-controller";

const MessageHeader = () => {
  const { activeChat, handleCallClick, handleContactTitleClick } = useMessageHeaderController();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-1">
        <h1
          className="cursor-pointer text-3xl font-medium"
          onClick={handleContactTitleClick}
        >
          {activeChat?.name}
        </h1>
        {/* <span className="text-sm opacity-50">23 members, 10 online</span> */}
      </div>

      <div className="flex gap-x-6 opacity-50">
        <LuSearch className="cursor-pointer" size={32} />
        <IoCallOutline
          className="cursor-pointer"
          size={32}
          onClick={handleCallClick}
        />
        <BsThreeDotsVertical className="cursor-pointer" size={32} />
      </div>
    </div>
  );
};

export default MessageHeader;
