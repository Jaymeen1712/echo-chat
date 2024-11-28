import { FiSend } from "react-icons/fi";
import { GrAttachment } from "react-icons/gr";
import { IoMdPhotos } from "react-icons/io";
import { IoDocumentText } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { PiMicrophoneBold } from "react-icons/pi";
import useMessageInputController from "./message-input-controller";

const MessageInput = () => {
  const {
    message,
    handleOnMessageInputChange,
    handleMessageInputSubmit,
    handleAttachOnChange,
    fileAttachments,
    handleDeleteImage,
    isAttachContainerOpen,
    handleToggleAttachButton,
    attachContainerRef,
    isSendButtonDisable,
  } = useMessageInputController();

  return (
    <div className="rounded-xl bg-purple-primary/10 text-sm text-black-primary">
      {fileAttachments.size ? (
        <div className="flex gap-x-4 overflow-x-auto p-3">
          {Array.from(fileAttachments.entries()).map(
            ([id, { url, type, name }]) => (
              <div
                className="group relative col-span-1 rounded-xl bg-white-primary"
                key={id}
              >
                {type.startsWith("image/") ? (
                  <img
                    src={url}
                    alt={`Image ${id}`}
                    className="h-[180px] w-[180px] rounded-xl bg-white-primary object-cover transition duration-300 group-hover:brightness-50"
                  />
                ) : (
                  <div className="flex h-[180px] w-[180px] flex-col items-center justify-center gap-y-4 rounded-xl bg-white-primary p-3 text-black-primary transition duration-300 group-hover:brightness-50">
                    {/* PDF Icon */}
                    {type.includes("pdf") && (
                      <img
                        src={"/pdf-icon.png"} // Custom PDF icon
                        alt={`PDF ${id}`}
                        className="h-[40px] w-[40px] object-contain"
                      />
                    )}

                    {/* Word Document Icon */}
                    {(type.includes("doc") ||
                      type.includes("docx") ||
                      type.includes("ms-doc") ||
                      type.includes("msword")) && (
                      <img
                        src={"/word-icon.webp"} // Custom Word icon
                        alt={`Word ${id}`}
                        className="h-[40px] w-[40px] object-contain"
                      />
                    )}

                    {/* Excel Document Icon */}
                    {type.includes("excel") && (
                      <img
                        src={"/excel-icon.png"} // Custom Excel icon
                        alt={`Excel ${id}`}
                        className="h-[40px] w-[40px] object-contain"
                      />
                    )}

                    {/* Display document name */}
                    <span className="line-clamp-4 break-all text-center text-sm">
                      {name}
                    </span>
                  </div>
                )}

                {/* Delete Icon */}
                <MdDelete
                  className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer text-2xl font-bold text-white opacity-0 transition duration-300 group-hover:opacity-100"
                  onClick={() => handleDeleteImage(id)}
                />
              </div>
            ),
          )}
        </div>
      ) : (
        ""
      )}

      <div className="relative">
        <input
          type="text"
          className="w-full rounded-xl bg-inherit p-3 py-6 pl-16 pr-28 placeholder:text-black-primary/50 focus:outline-none"
          placeholder="Your message"
          onChange={handleOnMessageInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              !isSendButtonDisable && handleMessageInputSubmit();
            }
          }}
          value={message}
        />

        <input
          type="file"
          accept="image/*"
          multiple
          id="attach-image"
          className="hidden"
          onChange={handleAttachOnChange}
          disabled={fileAttachments.size >= 3}
        />

        <input
          type="file"
          accept="application/*"
          multiple
          id="attach-document"
          className="hidden"
          onChange={handleAttachOnChange}
          disabled={fileAttachments.size >= 3}
        />

        {/* Attach container */}
        {isAttachContainerOpen ? (
          <div
            className="box-shadow-container absolute bottom-0 left-0 z-30 -translate-y-[80px] rounded-xl bg-white-primary"
            ref={attachContainerRef}
          >
            <div className="flex flex-col rounded-xl bg-purple-primary/10 p-2">
              <div
                className="flex cursor-pointer items-center gap-x-2 rounded-lg p-2 pr-10 hover:bg-purple-primary/20"
                onClick={() => {
                  document.getElementById("attach-image")?.click();
                  handleToggleAttachButton();
                }}
              >
                <IoMdPhotos className="fill-blue-600" size={22} />
                <span>Photos</span>
              </div>
              <div
                className="flex cursor-pointer items-center gap-x-2 rounded-lg p-2 pr-10 hover:bg-purple-primary/20"
                onClick={() => {
                  document.getElementById("attach-document")?.click();
                  handleToggleAttachButton();
                }}
              >
                <IoDocumentText className="fill-orange-600" size={22} />
                <span>Documents</span>
              </div>
            </div>
          </div>
        ) : null}

        <GrAttachment
          className={`absolute left-8 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-purple-primary ${fileAttachments.size >= 3 && "cursor-not-allowed opacity-50"}`}
          size={23}
          onClick={handleToggleAttachButton}
        />

        <PiMicrophoneBold
          className="absolute right-14 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-purple-primary"
          size={25}
        />
        <FiSend
          className={`absolute right-4 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-purple-primary ${isSendButtonDisable && "cursor-not-allowed opacity-50"}`}
          size={23}
          onClick={() => {
            !isSendButtonDisable && handleMessageInputSubmit();
          }}
        />
      </div>
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
