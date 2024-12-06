import { SingleMessageWithTypeType } from "@/components/main-chat-panel/message-area/message-list/message-list-controller";
import { ChatType } from "@/components/sub-sidebar/chats/chats-controller";
import {
  ActiveChatType,
  ActiveContactFileInfoType,
  GroupedMessageByDateType,
  MeResponseType,
  ReceivedOfferType,
  SingleConversationType,
  SubSidebarKeysType,
} from "@/types";
import { handleAddMessageToGroup } from "@/utils";
import { StateCreator } from "zustand";

export interface CommonSlice {
  currentUserData: MeResponseType["user"] | undefined;
  setCurrentUserData: (data: MeResponseType["user"] | undefined) => void;
  activeSubSidebarKey: SubSidebarKeysType;
  setActiveSubSidebarKey: (data: SubSidebarKeysType) => void;

  // Main page state types
  isNewChatOpen: boolean;
  setIsNewChatOpen: (data: boolean) => void;
  toggleNewChat: () => void;
  debouncedSearchQuery: string | undefined;
  setDebouncedSearchQuery: (data: string | undefined) => void;
  activeChat: ActiveChatType | undefined;
  setActiveChat: (data: ActiveChatType | undefined) => void;
  patchActiveChat: (data: Partial<ActiveChatType>) => void;
  activeMessages: GroupedMessageByDateType[];
  setActiveMessages: (data: GroupedMessageByDateType[]) => void;
  patchActiveMessages: (data: SingleMessageWithTypeType) => void;
  patchActiveMessagesIsDeliveredField: () => void;
  subSidebarChats: ChatType[];
  setSubSidebarChats: (data: ChatType[]) => void;
  patchSubSidebarChats: (data: SingleConversationType) => void;
  patchSubSidebarChatsIsActiveStates: (data: string[]) => void;
  findAndUpdateSubSidebarChatUnreadMessagesFieldToZero: (data: string) => void;

  // Calling state types
  receivedOffer: ReceivedOfferType | undefined;
  setReceivedOffer: (data: ReceivedOfferType | undefined) => void;
  receivedCandidate: RTCIceCandidateInit | undefined;
  setReceivedCandidate: (data: RTCIceCandidateInit | undefined) => void;
  isContactInfoContainerOpen: boolean;
  setIsContactInfoContainerOpen: (data: boolean) => void;
  toggleContactInfoContainerState: () => void;
  isContactFileContainerOpen: boolean;
  setIsContactFileContainerOpen: (data: boolean) => void;
  activeContactFileInfo: ActiveContactFileInfoType | undefined;
  setActiveContactFileInfo: (
    data: ActiveContactFileInfoType | undefined,
  ) => void;

  // Live user socket types
  onlineUsers: string[];
  setOnlineUsers: (data: string[]) => void;
}

export const createCommonSlice: StateCreator<CommonSlice> = (set, get) => ({
  currentUserData: undefined,
  setCurrentUserData: (data) => {
    set({ currentUserData: data });
  },
  activeSubSidebarKey: "chats",
  setActiveSubSidebarKey: (activeSubSidebarKey) =>
    set({
      activeSubSidebarKey,
    }),

  // Main page states
  isNewChatOpen: false,
  setIsNewChatOpen: (isNewChatOpen) =>
    set({
      isNewChatOpen,
    }),
  toggleNewChat: () =>
    set((state) => ({
      isNewChatOpen: !state.isNewChatOpen,
    })),
  debouncedSearchQuery: undefined,
  setDebouncedSearchQuery: (debouncedSearchQuery) =>
    set({
      debouncedSearchQuery,
    }),
  activeChat: undefined,
  setActiveChat: (activeChat) =>
    set({
      activeChat,
    }),
  patchActiveChat: (patchActiveChat) =>
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        ...(patchActiveChat as ActiveChatType),
      },
    })),
  activeMessages: [],
  setActiveMessages: (activeMessages) =>
    set({
      activeMessages,
    }),
  patchActiveMessages: (newMessage) =>
    set((state) => {
      const groupedMessageByDate = handleAddMessageToGroup(
        newMessage,
        state.activeMessages,
      );
      return {
        activeMessages: groupedMessageByDate,
      };
    }),
  patchActiveMessagesIsDeliveredField: () =>
    set((state) => {
      const updatedActiveMessages = state.activeMessages.map(
        ({ messages, ...rest }) => {
          const updatedMessages = messages.map((message) => {
            return {
              ...message,
              isDelivered: true,
            };
          });
          return {
            ...rest,
            messages: updatedMessages,
          };
        },
      );
      return { activeMessages: updatedActiveMessages };
    }),
  subSidebarChats: [],
  setSubSidebarChats: (subSidebarChats: ChatType[]) =>
    set({
      subSidebarChats: subSidebarChats.sort((a, b) => {
        const aUpdatedAt = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bUpdatedAt = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

        return bUpdatedAt - aUpdatedAt;
      }),
    }),
  patchSubSidebarChats: (newSubSidebarChat) =>
    set((state) => {
      const { participants, _id, createdAt, updatedAt, unreadMessagesCount } =
        newSubSidebarChat;
      const currentUserId = state.currentUserData?.userId;

      // Find the participant who is not the current user
      const otherParticipant = participants.find(
        (participant) => participant._id !== currentUserId,
      );
      const {
        name = "",
        image = "",
        isActive = false,
        lastActive = new Date(),
        _id: userId,
      } = otherParticipant || {};

      // Construct the new chat object
      const subSidebarChat = {
        image,
        name,
        content: newSubSidebarChat?.lastMessage?.content || "", // Default to an empty string if no content
        conversationId: _id,
        senderId: userId, // Handle cases where lastMessage or sender might be null
        createdAt,
        updatedAt,
        files: newSubSidebarChat?.lastMessage?.files,
        isActive,
        lastActive,
        unreadMessagesCount,
      };

      // Check if the conversation already exists in the subSidebarChats
      const chatIndex = state.subSidebarChats.findIndex(
        (chat) => chat.conversationId === _id,
      );

      let updatedSubSidebarChats = [...state.subSidebarChats];

      if (chatIndex === -1) {
        updatedSubSidebarChats.push(subSidebarChat);
      } else {
        updatedSubSidebarChats[chatIndex] = subSidebarChat;
      }

      // Sort chats by updatedAt in descending order
      updatedSubSidebarChats.sort((a, b) => {
        const aUpdatedAt = new Date(a.updatedAt || 0).getTime();
        const bUpdatedAt = new Date(b.updatedAt || 0).getTime();
        return bUpdatedAt - aUpdatedAt;
      });

      return { subSidebarChats: updatedSubSidebarChats };
    }),
  patchSubSidebarChatsIsActiveStates: (onlineUsers) =>
    set((state) => {
      const subSidebarChats = [...state.subSidebarChats].map((chat) => {
        const { senderId } = chat;

        if (!senderId) return chat;

        if (onlineUsers.includes(senderId)) {
          return {
            ...chat,
            isActive: true,
            lastActive: new Date(),
          };
        } else {
          return {
            ...chat,
            isActive: false,
          };
        }
      });

      return { subSidebarChats };
    }),
  findAndUpdateSubSidebarChatUnreadMessagesFieldToZero: (
    updateConversationId,
  ) =>
    set((state) => {
      const subSidebarChats = [...state.subSidebarChats].map((chat) => {
        const { conversationId } = chat;

        if (!conversationId) return chat;

        if (updateConversationId === conversationId) {
          return {
            ...chat,
            unreadMessagesCount: 0,
          };
        }

        return chat;
      });

      return { subSidebarChats };
    }),

  // Calling states
  receivedOffer: undefined,
  setReceivedOffer: (receivedOffer) =>
    set({
      receivedOffer,
    }),
  receivedCandidate: undefined,
  setReceivedCandidate: (receivedCandidate) =>
    set({
      receivedCandidate,
    }),
  isContactInfoContainerOpen: false,
  setIsContactInfoContainerOpen: (isContactInfoContainerOpen) =>
    set({
      isContactInfoContainerOpen,
    }),
  toggleContactInfoContainerState: () =>
    set({
      isContactInfoContainerOpen: !get().isContactInfoContainerOpen,
    }),
  isContactFileContainerOpen: false,
  setIsContactFileContainerOpen: (isContactFileContainerOpen) =>
    set({
      isContactFileContainerOpen,
    }),
  activeContactFileInfo: undefined,
  setActiveContactFileInfo: (activeContactFileInfo) =>
    set({
      activeContactFileInfo,
    }),

  // Live users socket states
  onlineUsers: [],
  setOnlineUsers: (onlineUsers) =>
    set({
      onlineUsers,
    }),
});
