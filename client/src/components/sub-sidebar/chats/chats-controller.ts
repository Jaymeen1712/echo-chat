import { useGetAllConversationsQuery } from "@/queries";
import { useSearchUserQuery } from "@/queries/user.queries";
import { useAppStore } from "@/store";
import { FileType, GetAllConversationsType } from "@/types";
import { socketClient } from "@/wrapper";
import { useCallback, useEffect } from "react";

export interface ChatType {
  image?: string;
  name: string;
  senderId?: string;
  conversationId?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  files?: FileType[];
}

const useChatsSubSideController = () => {
  const {
    debouncedSearchQuery,
    currentUserData,
    setActiveChat,
    setSubSidebarChats,
    patchSubSidebarChats,
    isNewChatOpen,
    toggleNewChat,
  } = useAppStore();

  const {
    data: searchUserData,
    refetch: searchUserRefetch,
    isLoading: isSearchUserLoading,
    dataUpdatedAt: isSearchUserDataUpdated,
  } = useSearchUserQuery({
    query: debouncedSearchQuery || "",
  });

  const {
    data: getAllConversationsData,
    refetch: getAllConversationsRefetch,
    isLoading: isGetAllConversationsLoading,
    dataUpdatedAt: isGetAllConversationDataUpdated,
  } = useGetAllConversationsQuery();
  //   {
  //   query: debouncedSearchQuery || "",
  // }

  const handleClickNewChat = () => {
    toggleNewChat();
  };

  const handleGetChatList = useCallback(async () => {
    if (isNewChatOpen) {
      searchUserRefetch();
    } else {
      getAllConversationsRefetch();
    }
  }, [debouncedSearchQuery, isNewChatOpen]);

  const handleChatClick = (chat: ChatType) => {
    const { conversationId, senderId, image, name } = chat;

    const defaultActiveChat = {
      image,
      name,
    };

    if (conversationId) {
      setActiveChat({
        ...defaultActiveChat,
        conversationId,
        isChatTemp: false,
        userId: senderId,
      });
    } else {
      setActiveChat({
        ...defaultActiveChat,
        isChatTemp: true,
        userId: senderId,
      });
    }
  };

  useEffect(() => {
    // Set search users data
    if (searchUserData && currentUserData) {
      const chats: ChatType[] = searchUserData.data.users.map(
        ({
          _id,
          name,
          image,
        }: {
          _id: string;
          name: string;
          image?: string;
        }) => ({
          image,
          name,
          senderId: _id,
        }),
      );

      const { userId } = currentUserData;

      const chatsWithoutCurrentUser = chats.filter(
        (chat) => chat.senderId !== userId,
      );

      setSubSidebarChats(chatsWithoutCurrentUser);
    }
  }, [searchUserData, currentUserData, isSearchUserDataUpdated]);

  useEffect(() => {
    // Set all conversations
    if (
      getAllConversationsData &&
      !getAllConversationsData.data.isError &&
      currentUserData
    ) {
      const conversations = getAllConversationsData.data.data
        .conversations as GetAllConversationsType;

      let chats: ChatType[] = [];

      for (const conversation of conversations) {
        if (!conversation.isGroup) {
          const { participants, _id, lastMessage, createdAt, updatedAt } =
            conversation;

          const otherParticipant = participants.filter(
            (participant) => participant._id !== currentUserData.userId,
          );
          const { name, image, _id: senderId } = otherParticipant[0];

          chats = [
            ...chats,
            {
              image,
              name,
              content: lastMessage?.content,
              conversationId: _id,
              senderId,
              createdAt,
              updatedAt,
              files: lastMessage?.files,
            },
          ];
        } else {
        }
      }

      setSubSidebarChats(chats);
    }
  }, [
    getAllConversationsData,
    currentUserData,
    isGetAllConversationDataUpdated,
  ]);

  useEffect(() => {
    handleGetChatList();
  }, [handleGetChatList]);

  useEffect(() => {
    socketClient.on("update-conversation", (data) => {
      const { conversation, receiverId } = data;

      if (currentUserData?.userId === receiverId) {
        patchSubSidebarChats(conversation);
      }
    });
  }, [socketClient, currentUserData]);

  useEffect(() => {
    return () => {
      setSubSidebarChats([]);
    };
  }, [setSubSidebarChats]);

  return {
    handleClickNewChat,
    isNewChatOpen,
    isSearchUserLoading,
    handleChatClick,
    isGetAllConversationsLoading,
  };
};

export default useChatsSubSideController;
