import { useGetAllConversationsQuery } from "@/queries";
import { useSearchUserQuery } from "@/queries/user.queries";
import { useAppStore } from "@/store";
import { FileType, GetAllConversationsType } from "@/types";
import { socketClient } from "@/wrapper";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";

export interface ChatType {
  image?: string;
  name: string;
  senderId?: string;
  conversationId?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  files?: FileType[];
  isActive: boolean;
  lastActive: Date;
  unreadMessagesCount: number;
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
    subSidebarChats,
    activeChat,
    findAndUpdateSubSidebarChatUnreadMessagesFieldToZero,
  } = useAppStore();

  const [subSidebarUsers, setSubSidebarUsers] = useState<ChatType[]>([]);

  const {
    data: searchUserData,
    refetch: searchUserRefetch,
    isFetching: isSearchUserLoading,
    dataUpdatedAt: isSearchUserDataUpdated,
  } = useSearchUserQuery({
    query: debouncedSearchQuery || "",
  });

  const {
    data: getAllConversationsData,
    refetch: getAllConversationsRefetch,
    isFetching: isGetAllConversationsLoading,
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
    const { conversationId, senderId, image, name, isActive, lastActive } =
      chat;

    const defaultActiveChat = {
      image,
      name,
      isActive,
      lastActive,
    };

    if (conversationId) {
      setActiveChat({
        ...defaultActiveChat,
        conversationId,
        isChatTemp: false,
        userId: senderId,
      });
      findAndUpdateSubSidebarChatUnreadMessagesFieldToZero(conversationId);
    } else {
      setActiveChat({
        ...defaultActiveChat,
        isChatTemp: true,
        userId: senderId,
      });
    }
  };

  useLayoutEffect(() => {
    // Set search users data
    if (searchUserData && currentUserData) {
      const chats: ChatType[] = searchUserData.data.users.map(
        ({
          _id,
          name,
          image,
          isActive,
          lastActive,
        }: {
          _id: string;
          name: string;
          image?: string;
          isActive: boolean;
          lastActive: Date;
        }) => ({
          image,
          name,
          senderId: _id,
          isActive,
          lastActive,
        }),
      );

      const { userId } = currentUserData;

      const chatsWithoutCurrentUser = chats.filter(
        (chat) => chat.senderId !== userId,
      );

      setSubSidebarUsers(chatsWithoutCurrentUser);
    }
  }, [searchUserData, currentUserData, isSearchUserDataUpdated]);

  useLayoutEffect(() => {
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
          const {
            participants,
            _id,
            lastMessage,
            createdAt,
            updatedAt,
            unreadMessagesCount,
          } = conversation;

          const otherParticipant = participants.filter(
            (participant) => participant._id !== currentUserData.userId,
          );
          const {
            name,
            image,
            _id: senderId,
            isActive,
            lastActive,
          } = otherParticipant[0];

          chats = [
            ...chats,
            {
              image,
              name,
              isActive,
              lastActive,
              content: lastMessage?.content,
              conversationId: _id,
              senderId,
              createdAt,
              updatedAt,
              files: lastMessage?.files,
              unreadMessagesCount,
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

  useEffect(() => {
    if (!activeChat) return;

    const { conversationId: activeChatConversationId } = activeChat;
    const chat = subSidebarChats.find(
      (chat) => chat.conversationId === activeChatConversationId,
    );

    if (!chat) return;

    const { conversationId, senderId, image, name, isActive, lastActive } =
      chat;

    const defaultActiveChat = {
      image,
      name,
      isActive,
      lastActive,
      userId: senderId,
    };

    if (conversationId) {
      setActiveChat({
        ...defaultActiveChat,
        conversationId,
        isChatTemp: false,
      });
    } else {
      setActiveChat({
        ...defaultActiveChat,
        isChatTemp: true,
      });
    }
  }, [subSidebarChats]);

  return {
    handleClickNewChat,
    isNewChatOpen,
    handleChatClick,
    isSearchUserLoading,
    isGetAllConversationsLoading,
    subSidebarUsers,
    subSidebarChats,
  };
};

export default useChatsSubSideController;
