import { AnimatePresence, motion } from "framer-motion";
import { FiSend } from "react-icons/fi";
import { GrAttachment } from "react-icons/gr";
import { IoMdPhotos } from "react-icons/io";
import { IoDocumentText } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import AudioRecorder from "./audio-recorder";
import useMessageInputController from "./message-input-controller";

const MessageInput = () => {
  const {
    message,
    handleOnMessageInputChange,
    handleMessageInputSubmit,
    handleAttachOnChange,
    fileAttachments,
    handleDeleteFile,
    isAttachContainerOpen,
    handleToggleAttachButton,
    attachContainerRef,
    isSendButtonDisable,
    audioUrl,
    setAudioUrl,
    setAudioBlob,
    textInputRef,
    attachToggleContainerRef,
  } = useMessageInputController();

  const slideUpAnimation = {
    hidden: { opacity: 0, scale: 0.2, y: 0, x: -50 }, // Start from below with opacity 0
    visible: { opacity: 1, scale: 1, y: -80, x: 0 }, // Final position and full opacity
    exit: { opacity: 0, scale: 0.2, y: 0, x: -50 }, // Animate back down on exit
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  return (
    <div className="rounded-xl bg-purple-primary/10 text-sm text-black-primary">
      {audioUrl && (
        <div className="flex gap-x-4 overflow-x-auto p-3">
          <audio controls>
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {fileAttachments.size ? (
        <div className="flex gap-x-4 overflow-x-auto p-3">
          {Array.from(fileAttachments.entries()).map(
            ([id, { data, type, name }]) => (
              <div
                className="group relative col-span-1 rounded-xl bg-white-primary"
                key={id}
              >
                {type.startsWith("image/") ? (
                  <img
                    src={data}
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

                    {/* Audio icon */}
                    {type.includes("audio") && (
                      <img
                        src={"/audio-icon.png"} // Custom audio icon
                        alt={`Audio ${id}`}
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
                  className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer text-2xl font-bold text-white opacity-0 transition duration-300 hover:text-red-600 group-hover:opacity-100"
                  onClick={() => handleDeleteFile(id)}
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
          ref={textInputRef}
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
        <AnimatePresence>
          {isAttachContainerOpen ? (
            <motion.div
              className="box-shadow-container absolute bottom-0 left-0 z-30 -translate-y-[80px] rounded-xl bg-white-primary"
              ref={attachContainerRef}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideUpAnimation}
            >
              <div className="flex flex-col rounded-xl bg-purple-primary/10 p-2">
                {/* Photos */}
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
                {/* Documents */}
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
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div ref={attachToggleContainerRef}>
          <GrAttachment
            className={`absolute left-8 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-purple-primary ${(fileAttachments.size >= 3 || audioUrl) && "cursor-not-allowed opacity-50"}`}
            size={23}
            onClick={handleToggleAttachButton}
          />
        </div>

        <div
          className={`absolute right-14 top-1/2 -translate-x-1/2 -translate-y-1/2 ${fileAttachments.size && "cursor-not-allowed opacity-50"}`}
        >
          <AudioRecorder
            setAudioUrl={setAudioUrl}
            setAudioBlob={setAudioBlob}
            isDisabled={!!fileAttachments.size}
          />
        </div>

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
