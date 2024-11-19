import { FiSend } from "react-icons/fi";
import { GrAttachment } from "react-icons/gr";
import { PiMicrophoneBold } from "react-icons/pi";

const MessageInput = () => {
  return (
    <div className="relative text-sm text-black-primary">
      <input
        type="text"
        className="w-full rounded-xl bg-purple-primary/10 p-3 py-6 pl-16 pr-28 placeholder:text-black-primary/50 focus:outline-none"
        placeholder="Your message"
      />
      <GrAttachment
        className="absolute left-8 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-purple-primary"
        size={23}
      />
      <PiMicrophoneBold
        className="absolute right-14 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-purple-primary"
        size={25}
      />
      <FiSend
        className="absolute right-4 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-purple-primary"
        size={23}
      />
    </div>
  );
};

export default MessageInput;
