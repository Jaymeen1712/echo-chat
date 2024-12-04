import { useGetAllFilesCountQuery, useGetAllFilesQuery } from "@/queries";
import { useAppStore } from "@/store";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiGooglePhotosLogo, PiWaveformBold } from "react-icons/pi";

interface AccordionItemType {
  uuid: string;
  count: number;
  icon: IconType;
  label: string;
  items: any[];
}

const useContactInfoContainerController = () => {
  const {
    setIsContactInfoContainerOpen,
    setActiveContactInfo,
    activeContactInfo,
    activeChat,
  } = useAppStore();

  const [accordionItems, setAccordionItems] = useState<AccordionItemType[]>([]);
  console.log("🚀 ~ useContactInfoContainerController ~ accordionItems:", accordionItems)

  const {
    data: getAllFilesCountData,
    dataUpdatedAt: getAllFilesCountUpdatedAt,
  } = useGetAllFilesCountQuery({
    conversationId: activeChat?.conversationId || "",
  });
  const { data: getAllFilesData, dataUpdatedAt: getAllFilesUpdatedAt } =
    useGetAllFilesQuery({
      conversationId: activeChat?.conversationId || "",
      files: ["audio", "document", "image"],
      limit: 3,
    });

  const handleCloseButtonClick = () => {
    setIsContactInfoContainerOpen(false);
  };

  const handleAccordionOnChange = (ids: string[]) => {
    console.log(ids);
  };

  useEffect(() => {
    if (getAllFilesCountData) {
      const { audio_files, documents, images } = getAllFilesCountData.data as {
        images: number;
        documents: number;
        audio_files: number;
      };

      setAccordionItems([
        {
          uuid: "image",
          label: "Photos",
          count: images,
          icon: PiGooglePhotosLogo,
          items: [],
        },
        {
          uuid: "application",
          label: "Documents",
          count: documents,
          icon: IoDocumentTextOutline,
          items: [],
        },
        {
          uuid: "audio",
          label: "Audio files",
          count: audio_files,
          icon: PiWaveformBold,
          items: [],
        },
      ]);
    }
  }, [getAllFilesCountUpdatedAt, getAllFilesCountData]);

  useEffect(() => {
    if (getAllFilesData) {
      const files = getAllFilesData.data.data as Record<
        "image" | "document" | "audio",
        {
          messageId: string;
          file: { data: string };
        }[]
      >;

      const updatedAccordionItems = [...accordionItems].map((item) => {
        return {
          ...item,
          items: files[item.uuid as "image" | "document" | "audio"] || [],
        };
      });

      setAccordionItems(updatedAccordionItems);
    }
  }, [getAllFilesUpdatedAt, getAllFilesData]);

  useEffect(() => {
    return () => {
      setActiveContactInfo(undefined);
    };
  }, [setActiveContactInfo]);

  return {
    handleCloseButtonClick,
    activeContactInfo,
    accordionItems,
    handleAccordionOnChange,
  };
};

export default useContactInfoContainerController;
