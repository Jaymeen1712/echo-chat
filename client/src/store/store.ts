import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { CommonSlice, createCommonSlice } from "./slices";
import { AppSlice, createAppSlice } from "./slices/createAppSlice";
import {
  createMessagesSlice,
  MessagesSlice,
} from "./slices/createMessagesSlice";

// Combined store interface
type StoreState = CommonSlice & AppSlice & MessagesSlice;

export const useAppStore = create<StoreState>()(
  devtools(
    persist(
      (...args) => ({
        ...createCommonSlice(...args),
        ...createAppSlice(...args),
        ...createMessagesSlice(...args),
      }),
      {
        name: "chat-app-storage",
        // Only persist certain parts of the state
        partialize: (state) => ({
          activeSubSidebar: state.activeSubSidebar,
          currentUserData: state.currentUserData,
          // Don't persist messages cache or temporary UI state
        }),
        // Merge persisted state with initial state
        merge: (persistedState, currentState) => ({
          ...currentState,
          ...(persistedState || {}),
        }),
      },
    ),
    {
      name: "chat-app-store",
    },
  ),
);
