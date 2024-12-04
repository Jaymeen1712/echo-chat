import { SingleMessageWithTypeType } from "@/components/main-chat-panel/message-area/message-list/message-list-controller";
import { ChatType } from "@/components/sub-sidebar/chats/chats-controller";
import {
  ActiveChatType,
  ActiveContactFileInfoType,
  ActiveContactInfoType,
  GroupedMessageByDateType,
  MeResponseType,
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
  subSidebarChats: ChatType[];
  setSubSidebarChats: (data: ChatType[]) => void;
  patchSubSidebarChats: (data: SingleConversationType) => void;
  isContactInfoContainerOpen: boolean;
  setIsContactInfoContainerOpen: (data: boolean) => void;
  toggleContactInfoContainerState: () => void;
  activeContactInfo: ActiveContactInfoType | undefined;
  setActiveContactInfo: (data: ActiveContactInfoType | undefined) => void;
  isContactFileContainerOpen: boolean;
  setIsContactFileContainerOpen: (data: boolean) => void;
  activeContactFileInfo: ActiveContactFileInfoType | undefined;
  setActiveContactFileInfo: (
    data: ActiveContactFileInfoType | undefined,
  ) => void;
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
      const { participants, _id, createdAt, updatedAt } = newSubSidebarChat;
      const currentUserId = state.currentUserData?.userId;

      // Find the participant who is not the current user
      const otherParticipant = participants.find(
        (participant) => participant._id !== currentUserId,
      );
      const { name = "", image = "" } = otherParticipant || {};

      // Construct the new chat object
      const subSidebarChat = {
        image,
        name,
        content: newSubSidebarChat?.lastMessage?.content || "", // Default to an empty string if no content
        conversationId: _id,
        senderId: newSubSidebarChat?.lastMessage?.sender?._id, // Handle cases where lastMessage or sender might be null
        createdAt,
        updatedAt,
        files: newSubSidebarChat?.lastMessage?.files,
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
  isContactInfoContainerOpen: false,
  setIsContactInfoContainerOpen: (isContactInfoContainerOpen) =>
    set({
      isContactInfoContainerOpen,
    }),
  toggleContactInfoContainerState: () =>
    set({
      isContactInfoContainerOpen: !get().isContactInfoContainerOpen,
    }),
  activeContactInfo: undefined,
  setActiveContactInfo: (activeContactInfo) =>
    set({
      activeContactInfo,
    }),
  isContactFileContainerOpen: true,
  setIsContactFileContainerOpen: (isContactFileContainerOpen) =>
    set({
      isContactFileContainerOpen,
    }),
  activeContactFileInfo: undefined,
  setActiveContactFileInfo: (activeContactFileInfo) =>
    set({
      activeContactFileInfo,
    }),
});
