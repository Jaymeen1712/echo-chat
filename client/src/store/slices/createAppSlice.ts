import { ActiveChatType, MeResponseType } from "@/types";
import { UUID } from "@/types/common";
import { StateCreator } from "zustand";

// App slice state interface
export interface AppSlice {
  // UI State
  isNewChatOpen: boolean;
  activeSubSidebar: "chats" | "profile" | "settings";

  // User State
  currentUserData: MeResponseType["user"] | undefined;
  isUserDataLoading: boolean;
  userDataError: string | null;

  // Chat State
  activeChat: ActiveChatType | undefined;
  onlineUsers: UUID[];

  // Actions
  toggleNewChat: () => void;
  setActiveSubSidebar: (sidebar: "chats" | "profile" | "settings") => void;
  setCurrentUserData: (userData: MeResponseType["user"] | undefined) => void;
  setUserDataLoading: (loading: boolean) => void;
  setUserDataError: (error: string | null) => void;
  setActiveChat: (chat: ActiveChatType | undefined) => void;
  setOnlineUsers: (users: UUID[]) => void;
  updateUserOnlineStatus: (userId: UUID, isOnline: boolean) => void;

  // Computed values
  isUserOnline: (userId: UUID) => boolean;

  // Reset functions
  resetAppState: () => void;
  resetUserState: () => void;
}

// Initial state
const initialAppState = {
  isNewChatOpen: false,
  activeSubSidebar: "chats" as const,
  currentUserData: undefined,
  isUserDataLoading: false,
  userDataError: null,
  activeChat: undefined,
  onlineUsers: [],
};

// Create app slice
export const createAppSlice: StateCreator<AppSlice> = (set, get) => ({
  ...initialAppState,

  // UI Actions
  toggleNewChat: () =>
    set((state) => ({
      isNewChatOpen: !state.isNewChatOpen,
    })),

  setActiveSubSidebar: (sidebar) =>
    set({
      activeSubSidebar: sidebar,
    }),

  // User Actions
  setCurrentUserData: (userData) =>
    set({
      currentUserData: userData,
      userDataError: null,
    }),

  setUserDataLoading: (loading) =>
    set({
      isUserDataLoading: loading,
    }),

  setUserDataError: (error) =>
    set({
      userDataError: error,
      isUserDataLoading: false,
    }),

  // Chat Actions
  setActiveChat: (chat) =>
    set({
      activeChat: chat,
    }),

  setOnlineUsers: (users) =>
    set({
      onlineUsers: users,
    }),

  updateUserOnlineStatus: (userId, isOnline) =>
    set((state) => {
      const onlineUsers = new Set(state.onlineUsers);

      if (isOnline) {
        onlineUsers.add(userId);
      } else {
        onlineUsers.delete(userId);
      }

      return { onlineUsers: Array.from(onlineUsers) };
    }),

  // Computed values
  isUserOnline: (userId) => {
    const { onlineUsers } = get();
    return onlineUsers.includes(userId);
  },

  // Reset functions
  resetAppState: () => set(initialAppState),

  resetUserState: () =>
    set({
      currentUserData: undefined,
      isUserDataLoading: false,
      userDataError: null,
    }),
});
