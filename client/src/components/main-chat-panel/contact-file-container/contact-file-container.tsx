import { handleDownload } from "@/utils";
import { IoMdDownload } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import useContactFileContainerController from "./contact-file-container-controller";

const ContactFileContainer = () => {
  const { handleCloseButtonClick, containerTitle, fileItems } =
    useContactFileContainerController();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between gap-x-3">
        <h4 className="text-xl font-medium">{containerTitle}</h4>
        <IoCloseOutline
          size={28}
          className="cursor-pointer"
          onClick={handleCloseButtonClick}
        />
      </div>

      <div className="my-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 pr-3">
          {fileItems.map((item, index) => (
            <div
              className="group relative col-span-1 flex items-center rounded-xl bg-white-primary"
              key={index}
            >
              {item.file.type.startsWith("image/") ? (
                // Render Image
                <img
                  src={item.file.data}
                  alt={`Image ${index}`}
                  className="rounded-xl bg-white-primary object-cover transition duration-300 group-hover:brightness-50"
                />
              ) : (
                // Render Document
                <div className="flex flex-col items-center justify-center gap-y-4 rounded-xl bg-white-primary p-3 text-black-primary transition duration-300 group-hover:brightness-50">
                  {/* PDF Icon */}
                  {item.file.type.includes("pdf") && (
                    <img
                      src={"/pdf-icon.png"} // Custom PDF icon
                      alt={`PDF ${index}`}
                      className="h-[40px] w-[40px] object-contain"
                    />
                  )}

                  {/* Word Document Icon */}
                  {(item.file.type.includes("doc") ||
                    item.file.type.includes("docx") ||
                    item.file.type.includes("ms-doc") ||
                    item.file.type.includes("msword")) && (
                    <img
                      src={"/word-icon.webp"} // Custom Word icon
                      alt={`Word ${index}`}
                      className="h-[40px] w-[40px] object-contain"
                    />
                  )}

                  {/* Excel Document Icon */}
                  {item.file.type.includes("excel") && (
                    <img
                      src={"/excel-icon.png"} // Custom Excel icon
                      alt={`Excel ${index}`}
                      className="h-[40px] w-[40px] object-contain"
                    />
                  )}

                  {/* Audio icon */}
                  {item.file.type.includes("audio") && (
                    <img
                      src={"/audio-icon.png"} // Custom audio icon
                      alt={`Audio ${name}`}
                      className="h-[40px] w-[40px] object-contain"
                    />
                  )}

                  {/* Display Document Name */}
                  <span className="line-clamp-4 break-all text-center text-sm">
                    {item.file.name}
                  </span>
                </div>
              )}

              {/* Download Icon */}
              <IoMdDownload
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer text-2xl font-bold text-white opacity-0 transition duration-300 hover:fill-purple-primary group-hover:opacity-100"
                onClick={() => handleDownload(item.file.data, item.file.name)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactFileContainer;
