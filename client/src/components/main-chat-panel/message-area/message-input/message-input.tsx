import { FiSend } from "react-icons/fi";
import { GrAttachment } from "react-icons/gr";
import { PiMicrophoneBold } from "react-icons/pi";
import useMessageInputController from "./message-input-controller";

const MessageInput = () => {
  const { message, handleOnMessageInputChange, handleMessageInputSubmit } =
    useMessageInputController();

  return (
    <div className="relative text-sm text-black-primary">
      <input
        type="text"
        className="w-full rounded-xl bg-purple-primary/10 p-3 py-6 pl-16 pr-28 placeholder:text-black-primary/50 focus:outline-none"
        placeholder="Your message"
        onChange={handleOnMessageInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleMessageInputSubmit();
          }
        }}
        value={message}
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
        onClick={handleMessageInputSubmit}
      />
    </div>
  );
};

export default MessageInput;

{
  /* <div className="flex items-end gap-x-6 rounded-xl bg-purple-primary/10 px-6 py-3">
<GrAttachment
  className="cursor-pointer self-end text-purple-primary"
  size={22}
/>
<textarea
  className="max-h-[180px] flex-1 resize-none py-2 text-sm leading-[1.5] text-black-primary placeholder:text-black-primary/50 focus:outline-none"
  placeholder="Your message"
  onChange={handleOnMessageInputChange}
   onInput={(e) => {
     e.target.style.height = "auto";
     e.target.style.height = `${e.target.scrollHeight}px`; 
   }}
  value={message}
  defaultValue={""}
  maxLength={380}
  style={{
    backgroundColor: "initial",
  }}
/>
<PiMicrophoneBold
  className="cursor-pointer self-end text-purple-primary"
  size={24}
/>
<FiSend
  className="cursor-pointer self-end text-purple-primary"
  size={22}
/>
</div> */
}
