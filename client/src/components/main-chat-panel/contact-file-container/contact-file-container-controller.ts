import { useGetAllFilesQuery } from "@/queries";
import { useAppStore } from "@/store";
import { FileType } from "@/types";
import { useEffect, useMemo, useState } from "react";

const useContactFileContainerController = () => {
  const { setIsContactFileContainerOpen, activeContactFileInfo } =
    useAppStore();

  const [fileItems, setFileItems] = useState<
    {
      messageId: string;
      file: FileType;
    }[]
  >([]);

  const {
    data: getAllFilesData,
    dataUpdatedAt: getAllFilesUpdatedAt,
    refetch: getAllFilesRefetch,
  } = useGetAllFilesQuery(
    {
      conversationId: activeContactFileInfo?.conversationId || "",
      files:
        (activeContactFileInfo?.uuid && [activeContactFileInfo?.uuid]) || [],
    },
    false,
  );

  const containerTitle = useMemo(() => {
    if (!activeContactFileInfo) return;

    const { uuid } = activeContactFileInfo;
    switch (uuid) {
      case "audio":
        return "Audio files";
      case "document":
        return "Documents";
      case "image":
        return "Images";
      default:
        return;
    }
  }, [activeContactFileInfo?.uuid]);

  const handleCloseButtonClick = () => {
    setIsContactFileContainerOpen(false);
  };

  useEffect(() => {
    if (!activeContactFileInfo) return;

    getAllFilesRefetch();
  }, [activeContactFileInfo?.uuid]);

  useEffect(() => {
    if (!activeContactFileInfo) return;

    if (getAllFilesData) {
      const { uuid } = activeContactFileInfo;
      const files = getAllFilesData.data.data as Record<
        "image" | "application" | "audio",
        {
          messageId: string;
          file: FileType;
        }[]
      >;

      let key: "image" | "audio" | "application";

      if (uuid === "document") {
        key = "application";
      } else {
        key = uuid;
      }

      setFileItems(files[key]);
    }
  }, [getAllFilesUpdatedAt, getAllFilesData]);

  return { handleCloseButtonClick, containerTitle, fileItems };
};

export default useContactFileContainerController;
