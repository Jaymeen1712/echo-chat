import { SingleMessageType } from "@/types";
import { UUID } from "@/types/common";
import { StateCreator } from "zustand";

// Message cache entry
interface MessageCacheEntry {
  messages: SingleMessageType[];
  lastFetch: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

// Messages slice state interface
export interface MessagesSlice {
  // Message cache by conversation ID
  messageCache: Record<UUID, MessageCacheEntry>;
  activeConversationId: UUID | null;

  // Loading states
  isLoadingMessages: boolean;
  isSendingMessage: boolean;

  // Typing indicators
  typingUsers: Record<UUID, UUID[]>; // conversationId -> userIds[]

  // Actions
  setActiveConversation: (conversationId: UUID | null) => void;
  setMessages: (
    conversationId: UUID,
    messages: SingleMessageType[],
    hasMore?: boolean,
  ) => void;
  addMessage: (conversationId: UUID, message: SingleMessageType) => void;
  updateMessage: (
    conversationId: UUID,
    messageId: UUID,
    updates: Partial<SingleMessageType>,
  ) => void;
  deleteMessage: (conversationId: UUID, messageId: UUID) => void;
  prependMessages: (
    conversationId: UUID,
    messages: SingleMessageType[],
  ) => void;

  // Loading states
  setLoadingMessages: (conversationId: UUID, loading: boolean) => void;
  setSendingMessage: (sending: boolean) => void;
  setMessagesError: (conversationId: UUID, error: string | null) => void;

  // Typing indicators
  setUserTyping: (
    conversationId: UUID,
    userId: UUID,
    isTyping: boolean,
  ) => void;
  clearTypingUsers: (conversationId: UUID) => void;

  // Cache management
  clearMessageCache: (conversationId?: UUID) => void;
  invalidateCache: (conversationId: UUID) => void;

  // Computed values
  getMessages: (conversationId: UUID) => SingleMessageType[];
  getCacheEntry: (conversationId: UUID) => MessageCacheEntry | null;
  getTypingUsers: (conversationId: UUID) => UUID[];
  hasMoreMessages: (conversationId: UUID) => boolean;

  // Optimistic updates
  addOptimisticMessage: (
    conversationId: UUID,
    message: Omit<SingleMessageType, "_id">,
  ) => string;
  removeOptimisticMessage: (conversationId: UUID, tempId: string) => void;
  confirmOptimisticMessage: (
    conversationId: UUID,
    tempId: string,
    confirmedMessage: SingleMessageType,
  ) => void;
}

// Initial state
const initialMessagesState = {
  messageCache: {},
  activeConversationId: null,
  isLoadingMessages: false,
  isSendingMessage: false,
  typingUsers: {},
};

// Helper function to create empty cache entry
const createEmptyCacheEntry = (): MessageCacheEntry => ({
  messages: [],
  lastFetch: 0,
  hasMore: true,
  isLoading: false,
  error: null,
});

// Create messages slice
export const createMessagesSlice: StateCreator<MessagesSlice> = (set, get) => ({
  ...initialMessagesState,

  // Active conversation
  setActiveConversation: (conversationId) => {
    set({ activeConversationId: conversationId });
  },

  // Message management
  setMessages: (conversationId, messages, hasMore = true) =>
    set((state) => ({
      messageCache: {
        ...state.messageCache,
        [conversationId]: {
          ...createEmptyCacheEntry(),
          ...state.messageCache[conversationId],
          messages,
          lastFetch: Date.now(),
          hasMore,
          isLoading: false,
          error: null,
        },
      },
    })),

  addMessage: (conversationId, message) =>
    set((state) => {
      const cacheEntry =
        state.messageCache[conversationId] || createEmptyCacheEntry();
      const updatedMessages = [...cacheEntry.messages, message];

      return {
        messageCache: {
          ...state.messageCache,
          [conversationId]: {
            ...cacheEntry,
            messages: updatedMessages,
          },
        },
      };
    }),

  updateMessage: (conversationId, messageId, updates) =>
    set((state) => {
      const cacheEntry = state.messageCache[conversationId];
      if (!cacheEntry) return state;

      const updatedMessages = cacheEntry.messages.map((msg) =>
        msg._id === messageId ? { ...msg, ...updates } : msg,
      );

      return {
        messageCache: {
          ...state.messageCache,
          [conversationId]: {
            ...cacheEntry,
            messages: updatedMessages,
          },
        },
      };
    }),

  deleteMessage: (conversationId, messageId) =>
    set((state) => {
      const cacheEntry = state.messageCache[conversationId];
      if (!cacheEntry) return state;

      const updatedMessages = cacheEntry.messages.filter(
        (msg) => msg._id !== messageId,
      );

      return {
        messageCache: {
          ...state.messageCache,
          [conversationId]: {
            ...cacheEntry,
            messages: updatedMessages,
          },
        },
      };
    }),

  prependMessages: (conversationId, messages) =>
    set((state) => {
      const cacheEntry =
        state.messageCache[conversationId] || createEmptyCacheEntry();
      const updatedMessages = [...messages, ...cacheEntry.messages];

      return {
        messageCache: {
          ...state.messageCache,
          [conversationId]: {
            ...cacheEntry,
            messages: updatedMessages,
            lastFetch: Date.now(),
          },
        },
      };
    }),

  // Loading states
  setLoadingMessages: (conversationId, loading) =>
    set((state) => ({
      messageCache: {
        ...state.messageCache,
        [conversationId]: {
          ...createEmptyCacheEntry(),
          ...state.messageCache[conversationId],
          isLoading: loading,
        },
      },
      isLoadingMessages: loading,
    })),

  setSendingMessage: (sending) => set({ isSendingMessage: sending }),

  setMessagesError: (conversationId, error) =>
    set((state) => ({
      messageCache: {
        ...state.messageCache,
        [conversationId]: {
          ...createEmptyCacheEntry(),
          ...state.messageCache[conversationId],
          error,
          isLoading: false,
        },
      },
    })),

  // Typing indicators
  setUserTyping: (conversationId, userId, isTyping) =>
    set((state) => {
      const currentTyping = state.typingUsers[conversationId] || [];
      let updatedTyping: UUID[];

      if (isTyping) {
        updatedTyping = currentTyping.includes(userId)
          ? currentTyping
          : [...currentTyping, userId];
      } else {
        updatedTyping = currentTyping.filter((id) => id !== userId);
      }

      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: updatedTyping,
        },
      };
    }),

  clearTypingUsers: (conversationId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: [],
      },
    })),

  // Cache management
  clearMessageCache: (conversationId) =>
    set((state) => {
      if (conversationId) {
        const { [conversationId]: removed, ...rest } = state.messageCache;
        return { messageCache: rest };
      }
      return { messageCache: {} };
    }),

  invalidateCache: (conversationId) =>
    set((state) => {
      const cacheEntry = state.messageCache[conversationId];
      if (!cacheEntry) return state;

      return {
        messageCache: {
          ...state.messageCache,
          [conversationId]: {
            ...cacheEntry,
            lastFetch: 0,
          },
        },
      };
    }),

  // Computed values
  getMessages: (conversationId) => {
    const cacheEntry = get().messageCache[conversationId];
    return cacheEntry?.messages || [];
  },

  getCacheEntry: (conversationId) => {
    return get().messageCache[conversationId] || null;
  },

  getTypingUsers: (conversationId) => {
    return get().typingUsers[conversationId] || [];
  },

  hasMoreMessages: (conversationId) => {
    const cacheEntry = get().messageCache[conversationId];
    return cacheEntry?.hasMore ?? true;
  },

  // Optimistic updates
  addOptimisticMessage: (conversationId, message) => {
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const optimisticMessage: SingleMessageType = {
      ...message,
      _id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDelivered: false,
      isSeen: false,
    } as SingleMessageType;

    get().addMessage(conversationId, optimisticMessage);
    return tempId;
  },

  removeOptimisticMessage: (conversationId, tempId) => {
    get().deleteMessage(conversationId, tempId);
  },

  confirmOptimisticMessage: (conversationId, tempId, confirmedMessage) => {
    const state = get();
    const cacheEntry = state.messageCache[conversationId];
    if (!cacheEntry) return;

    const updatedMessages = cacheEntry.messages.map((msg) =>
      msg._id === tempId ? confirmedMessage : msg,
    );

    state.setMessages(conversationId, updatedMessages, cacheEntry.hasMore);
  },
});
