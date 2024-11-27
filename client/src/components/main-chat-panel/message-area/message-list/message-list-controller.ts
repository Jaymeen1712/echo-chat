import { useGetAllMessagesQuery } from "@/queries";
import { useAppStore } from "@/store";
import { GetAllMessagesType, SingleMessageType } from "@/types";
import { handleGroupMessagesByDate } from "@/utils";
import { useEffect } from "react";

export interface SingleMessageWithTypeType extends SingleMessageType {
  type: "sender" | "receiver";
}

const useMessageListController = () => {
  const { activeChat, currentUserData, setActiveMessages, activeMessages } =
    useAppStore();

  const {
    refetch: getAllMessagesRefetch,
    data: getAllMessagesData,
    isLoading: isGetAllMessagesLoading,
    dataUpdatedAt: getAllMessagesDataUpdated,
  } = useGetAllMessagesQuery({
    conversationId: activeChat?.conversationId || "",
  });

  useEffect(() => {
    // Set messages
    if (getAllMessagesData && currentUserData) {
      const messages = getAllMessagesData.data.data
        .messages as GetAllMessagesType;

      const messagesWithType = messages.map((message) => {
        let type: "sender" | "receiver";
        if (message.sender._id === currentUserData.userId) {
          type = "receiver";
        } else {
          type = "sender";
        }
        return {
          ...message,
          type,
        };
      });

      const groupedMessagesByDate = handleGroupMessagesByDate(messagesWithType);

      setActiveMessages(groupedMessagesByDate);
    }
  }, [currentUserData?.userId, getAllMessagesDataUpdated, ,]);

  useEffect(() => {
    if (activeChat && !activeChat.isChatTemp) {
      getAllMessagesRefetch();
    }
  }, [activeChat?.isChatTemp, activeChat?.conversationId]);

  return { activeMessages, isGetAllMessagesLoading };
};

export default useMessageListController;
