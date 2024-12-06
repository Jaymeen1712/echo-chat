import moment from "moment";
import { IoMdDownload } from "react-icons/io";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";
import { toast } from "react-toastify";
import { SingleMessageWithTypeType } from "../message-list-controller";

interface MessageItemProps {
  type: "sender" | "receiver";
  message: SingleMessageWithTypeType;
}

const MessageItem: React.FC<MessageItemProps> = ({ type, message }) => {
  const { sender, createdAt, isDelivered, isSeen } = message;
  const { name } = sender;

  const handleDownload = (url: string, name: string) => {
    try {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = name;
      anchor.click();
      anchor.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
      toast.error("Failed to download the file. Please try again.");
    }
  };

  return (
    <div
      className={`flex ${type === "sender" ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`flex w-[70%] items-end gap-x-4 ${type !== "sender" && "!flex-row-reverse"}`}
      >
        {/* <div className="avatar">
          <img
            src={sender?.image || handleGetAvatarAlternativeURL(sender.name)}
            alt="Avatar"
          />
        </div> */}

        <div
          className={`flex flex-col gap-y-3 rounded-2xl bg-purple-primary px-5 py-3 text-sm text-white-primary ${type !== "sender" && "!bg-purple-primary/10"}`}
        >
          {/* {type === "sender" && (
            <h4 className={`font-semibold text-white-primary`}>{name}</h4>
          )} */}

          <div>
            {message?.files?.length ? (
              <div className="flex gap-x-4 overflow-x-auto pb-3 pt-2">
                {message?.files.map(({ name, type, data }, index) => (
                  <div
                    className="flex flex-col items-center justify-center gap-y-5"
                    key={index}
                  >
                    {type.includes("audio") && (
                      <audio controls>
                        <source src={data} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    )}

                    <div className="group relative col-span-1 rounded-xl bg-white-primary">
                      {type.startsWith("image/") ? (
                        // Render Image
                        <img
                          src={data}
                          alt={`Image ${index}`}
                          className="h-[180px] w-[180px] rounded-xl bg-white-primary object-cover transition duration-300 group-hover:brightness-50"
                        />
                      ) : (
                        // Render Document
                        <div className="flex h-[180px] w-[180px] flex-col items-center justify-center gap-y-4 rounded-xl bg-white-primary p-3 text-black-primary transition duration-300 group-hover:brightness-50">
                          {/* PDF Icon */}
                          {type.includes("pdf") && (
                            <img
                              src={"/pdf-icon.png"} // Custom PDF icon
                              alt={`PDF ${index}`}
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
                              alt={`Word ${index}`}
                              className="h-[40px] w-[40px] object-contain"
                            />
                          )}

                          {/* Excel Document Icon */}
                          {type.includes("excel") && (
                            <img
                              src={"/excel-icon.png"} // Custom Excel icon
                              alt={`Excel ${index}`}
                              className="h-[40px] w-[40px] object-contain"
                            />
                          )}

                          {/* Audio icon */}
                          {type.includes("audio") && (
                            <img
                              src={"/audio-icon.png"} // Custom audio icon
                              alt={`Audio ${name}`}
                              className="h-[40px] w-[40px] object-contain"
                            />
                          )}

                          {/* Display Document Name */}
                          <span className="line-clamp-4 break-all text-center text-sm">
                            {name}
                          </span>
                        </div>
                      )}

                      {/* Download Icon */}
                      <IoMdDownload
                        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer text-2xl font-bold text-white opacity-0 transition duration-300 hover:fill-purple-primary group-hover:opacity-100"
                        onClick={() => handleDownload(data, name)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}

            <span
              className={`font-medium ${type !== "sender" && "!text-purple-dark-1"} break-all`}
            >
              {message?.content}
            </span>
          </div>

          <div
            className={`flex items-center gap-x-2 ${type !== "sender" && "!text-purple-dark-1"}`}
          >
            <div className="h-4 w-4 flex-1 rounded-full"></div>

            <div className="flex items-center gap-x-2">
              <span className="opacity-50">
                {moment(createdAt).format("hh:mm A")}
              </span>
              {type !== "sender" && (
                <div className="text-purple-primary">
                  {!isSeen && !isDelivered ? (
                    <IoCheckmark size={20} className="opacity-50" />
                  ) : (
                    <>
                      {isSeen ? (
                        <IoCheckmarkDone
                          size={20}
                          className="text-contrast-color"
                        />
                      ) : (
                        <IoCheckmarkDone size={20} className="opacity-50" />
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
