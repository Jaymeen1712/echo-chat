import { useGetAllFilesCountQuery, useGetAllFilesQuery } from "@/queries";
import { useAppStore } from "@/store";
import { FileType } from "@/types";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiGooglePhotosLogo, PiWaveformBold } from "react-icons/pi";
import { toast } from "react-toastify";

interface AccordionItemType {
  uuid: string;
  count: number;
  icon: IconType;
  label: string;
}

const useContactInfoContainerController = () => {
  const {
    setIsContactInfoContainerOpen,
    activeChat,
    setActiveContactFileInfo,
    setIsContactFileContainerOpen,
  } = useAppStore();

  const [accordionItems, setAccordionItems] = useState<AccordionItemType[]>([]);
  const [accordionPanelItems, setAccordionPanelItems] = useState<
    Record<
      "image" | "document" | "audio",
      {
        messageId: string;
        file: FileType;
      }[]
    >
  >();

  const {
    data: getAllFilesCountData,
    dataUpdatedAt: getAllFilesCountUpdatedAt,
    refetch: getAllFilesCountRefetch,
  } = useGetAllFilesCountQuery(
    {
      conversationId: activeChat?.conversationId || "",
    },
    false,
  );
  const {
    data: getAllFilesData,
    dataUpdatedAt: getAllFilesUpdatedAt,
    refetch: getAllFilesRefetch,
  } = useGetAllFilesQuery(
    {
      conversationId: activeChat?.conversationId || "",
      files: ["audio", "document", "image"],
      limit: 3,
    },
    false,
  );

  const handleCloseButtonClick = () => {
    setIsContactInfoContainerOpen(false);
  };

  const handleShowAllButtonClick = ({ uuid }: { uuid: string }) => {
    if (!activeChat?.conversationId) {
      toast.error("Something went wrong, please try again.");
      return;
    }

    setIsContactFileContainerOpen(true);
    setActiveContactFileInfo({
      conversationId: activeChat.conversationId,
      uuid:
        (uuid === "application" && "document") ||
        (uuid as "image" | "audio" | "document"),
    });
  };

  useEffect(() => {
    if (!activeChat?.conversationId) return;

    getAllFilesCountRefetch();
    getAllFilesRefetch();
  }, [activeChat]);

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
        },
        {
          uuid: "application",
          label: "Documents",
          count: documents,
          icon: IoDocumentTextOutline,
        },
        {
          uuid: "audio",
          label: "Audio files",
          count: audio_files,
          icon: PiWaveformBold,
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
          file: FileType;
        }[]
      >;

      setAccordionPanelItems(files);
    }
  }, [getAllFilesUpdatedAt, getAllFilesData]);

  return {
    handleCloseButtonClick,
    accordionItems,
    activeChat,
    handleShowAllButtonClick,
    accordionPanelItems,
  };
};

export default useContactInfoContainerController;
