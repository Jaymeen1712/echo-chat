import { SingleMessageWithTypeType } from "@/components/main-chat-panel/message-area/message-list/message-list-controller";
import { ChatType } from "@/components/sub-sidebar/chats/chats-controller";
import {
  ActiveChatType,
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
      const { participants, _id, lastMessage, createdAt, updatedAt } =
        newSubSidebarChat;
      const { content, sender } = lastMessage;
      const otherParticipant = participants.filter(
        (participant) => participant._id !== state.currentUserData?.userId,
      );
      const { name, image } = otherParticipant[0];

      const subSidebarChat = {
        image,
        name,
        content,
        conversationId: _id,
        senderId: sender._id,
        createdAt,
        updatedAt,
      };

      const subSidebarChats = state.subSidebarChats.map((chat) => {
        if (chat.conversationId === _id) {
          return subSidebarChat;
        }
        return chat;
      });
      console.log("🚀 ~ subSidebarChats ~ subSidebarChats:", subSidebarChats)

      return {
        subSidebarChats: subSidebarChats.sort((a, b) => {
          const aUpdatedAt = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bUpdatedAt = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

          return bUpdatedAt - aUpdatedAt;
        }),
      };
    }),
});
