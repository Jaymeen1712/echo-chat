import { handleDownload } from "@/utils";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { IoMdDownload } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import useContactInfoContainerController from "./contact-info-container-controller";

const ContactInfoContainer = () => {
  const {
    handleCloseButtonClick,
    activeChat,
    accordionItems,
    handleShowAllButtonClick,
    accordionPanelItems,
  } = useContactInfoContainerController();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between gap-x-3">
        <h4 className="text-xl font-medium">Contact info</h4>
        <IoCloseOutline
          size={28}
          className="cursor-pointer"
          onClick={handleCloseButtonClick}
        />
      </div>

      <div className="my-6 flex items-center gap-x-6">
        <div className="flex justify-center">
          <img
            src={activeChat?.image}
            alt=""
            className="h-[80px] w-[80px] rounded-full bg-black-primary object-cover transition group-hover:brightness-50"
          />
        </div>

        <div className="mb-2 flex flex-col items-center gap-y-1">
          <h4 className="break-all text-base">{activeChat?.name}</h4>
        </div>
      </div>

      <h1 className="text-xl">Files</h1>

      <div className="mt-4 flex-1 overflow-y-auto pr-3">
        <Accordion
          className="flex flex-col gap-y-3"
          allowMultipleExpanded
          allowZeroExpanded
        >
          {accordionItems.map(({ uuid, count, icon: Icon, label }) => (
            <AccordionItem key={uuid} uuid={uuid}>
              <AccordionItemHeading className="text-base">
                <AccordionItemButton>
                  <div className="flex items-center gap-x-3">
                    <Icon size={28} />
                    <div className="flex gap-x-1">
                      <span>{count}</span>
                      <span>{label}</span>
                    </div>
                  </div>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel className="my-3 flex flex-col gap-y-3">
                <div className="hide-scrollbar flex gap-x-3 overflow-x-auto">
                  {accordionPanelItems?.[
                    uuid as "image" | "document" | "audio"
                  ]?.map((item, index) => (
                    <div
                      className="group relative col-span-1 rounded-xl bg-white-primary"
                      key={index}
                    >
                      {item.file.type.startsWith("image/") ? (
                        // Render Image
                        <img
                          src={item.file.data}
                          alt={`Image ${index}`}
                          className="h-[150px] min-w-[180px] rounded-xl bg-white-primary object-cover transition duration-300 group-hover:brightness-50"
                        />
                      ) : (
                        // Render Document
                        <div className="flex h-[150px] w-[180px] flex-col items-center justify-center gap-y-4 rounded-xl bg-white-primary p-3 text-black-primary transition duration-300 group-hover:brightness-50">
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
                        onClick={() =>
                          handleDownload(item.file.data, item.file.name)
                        }
                      />
                    </div>
                  ))}
                </div>
                {count > 3 && (
                  <div
                    className="cursor-pointer"
                    onClick={() => handleShowAllButtonClick({ uuid })}
                  >
                    Show all
                  </div>
                )}
              </AccordionItemPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default ContactInfoContainer;
