import { createMockMessage, createMockUser } from "@/test/utils";
import { MeResponseType } from "@/types";
import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "../store";

// Helper to create mock user data for store
const createMockStoreUser = (): MeResponseType["user"] => ({
  userId: "user-123",
  _id: "user-123",
  name: "Test User",
  email: "test@example.com",
  image: "https://example.com/avatar.jpg",
  iat: Date.now(),
  exp: Date.now() + 3600000,
});

describe("App Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.getState().resetAppState();
  });

  describe("App Slice", () => {
    it("should have initial state", () => {
      const state = useAppStore.getState();

      expect(state.isNewChatOpen).toBe(false);
      expect(state.activeSubSidebar).toBe("chats");
      expect(state.currentUserData).toBeNull();
      expect(state.isUserDataLoading).toBe(false);
      expect(state.userDataError).toBeNull();
      expect(state.activeChat).toBeNull();
      expect(state.onlineUsers).toEqual([]);
    });

    it("should toggle new chat", () => {
      const { toggleNewChat } = useAppStore.getState();

      expect(useAppStore.getState().isNewChatOpen).toBe(false);

      toggleNewChat();
      expect(useAppStore.getState().isNewChatOpen).toBe(true);

      toggleNewChat();
      expect(useAppStore.getState().isNewChatOpen).toBe(false);
    });

    it("should set active sidebar", () => {
      const { setActiveSubSidebar } = useAppStore.getState();

      setActiveSubSidebar("profile");
      expect(useAppStore.getState().activeSubSidebar).toBe("profile");

      setActiveSubSidebar("settings");
      expect(useAppStore.getState().activeSubSidebar).toBe("settings");
    });

    it("should set current user data", () => {
      const { setCurrentUserData } = useAppStore.getState();
      const mockUser = createMockStoreUser();

      setCurrentUserData(mockUser);
      expect(useAppStore.getState().currentUserData).toEqual(mockUser);
      expect(useAppStore.getState().userDataError).toBeNull();
    });

    it("should set user data loading state", () => {
      const { setUserDataLoading } = useAppStore.getState();

      setUserDataLoading(true);
      expect(useAppStore.getState().isUserDataLoading).toBe(true);

      setUserDataLoading(false);
      expect(useAppStore.getState().isUserDataLoading).toBe(false);
    });

    it("should set user data error", () => {
      const { setUserDataError } = useAppStore.getState();
      const error = "Failed to load user data";

      setUserDataError(error);
      expect(useAppStore.getState().userDataError).toBe(error);
      expect(useAppStore.getState().isUserDataLoading).toBe(false);
    });

    it("should set active chat", () => {
      const { setActiveChat } = useAppStore.getState();
      const mockChat = {
        name: "Test Chat",
        userId: "user-123",
        conversationId: "conv-123",
        isChatTemp: false,
        isActive: true,
        lastActive: new Date(),
      };

      setActiveChat(mockChat);
      expect(useAppStore.getState().activeChat).toEqual(mockChat);
    });

    it("should manage online users", () => {
      const { setOnlineUsers, updateUserOnlineStatus } = useAppStore.getState();

      setOnlineUsers(["user-1", "user-2"]);
      expect(useAppStore.getState().onlineUsers).toEqual(["user-1", "user-2"]);

      updateUserOnlineStatus("user-3", true);
      expect(useAppStore.getState().onlineUsers).toContain("user-3");

      updateUserOnlineStatus("user-1", false);
      expect(useAppStore.getState().onlineUsers).not.toContain("user-1");
    });

    it("should check if user is online", () => {
      const { setOnlineUsers, isUserOnline } = useAppStore.getState();

      setOnlineUsers(["user-1", "user-2"]);

      expect(isUserOnline("user-1")).toBe(true);
      expect(isUserOnline("user-3")).toBe(false);
    });

    it("should reset app state", () => {
      const {
        setCurrentUserData,
        setActiveChat,
        toggleNewChat,
        resetAppState,
      } = useAppStore.getState();

      // Modify state
      setCurrentUserData(createMockStoreUser());
      setActiveChat({
        name: "Test",
        userId: "user-1",
        conversationId: "conv-1",
        isChatTemp: false,
        isActive: true,
        lastActive: new Date(),
      });
      toggleNewChat();

      // Reset state
      resetAppState();

      const state = useAppStore.getState();
      expect(state.isNewChatOpen).toBe(false);
      expect(state.currentUserData).toBeNull();
      expect(state.activeChat).toBeNull();
    });
  });

  describe("Messages Slice", () => {
    it("should have initial messages state", () => {
      const state = useAppStore.getState();

      expect(state.messageCache).toEqual({});
      expect(state.activeMessages).toEqual([]);
      expect(state.activeConversationId).toBeNull();
      expect(state.isLoadingMessages).toBe(false);
      expect(state.isSendingMessage).toBe(false);
      expect(state.typingUsers).toEqual({});
    });

    it("should set active conversation", () => {
      const { setActiveConversation } = useAppStore.getState();
      const conversationId = "conv-123";

      setActiveConversation(conversationId);
      expect(useAppStore.getState().activeConversationId).toBe(conversationId);
    });

    it("should set messages for conversation", () => {
      const { setMessages } = useAppStore.getState();
      const conversationId = "conv-123";
      const messages = [
        createMockMessage(),
        createMockMessage({ _id: "msg-2" }),
      ];

      setMessages(conversationId, messages);

      const state = useAppStore.getState();
      expect(state.messageCache[conversationId]).toBeDefined();
      expect(state.messageCache[conversationId].messages).toEqual(messages);
      expect(state.messageCache[conversationId].hasMore).toBe(true);
    });

    it("should add message to conversation", () => {
      const { setMessages, addMessage, setActiveConversation } =
        useAppStore.getState();
      const conversationId = "conv-123";
      const initialMessages = [createMockMessage()];
      const newMessage = createMockMessage({ _id: "msg-2" });

      setMessages(conversationId, initialMessages);
      setActiveConversation(conversationId);
      addMessage(conversationId, newMessage);

      const state = useAppStore.getState();
      expect(state.messageCache[conversationId].messages).toHaveLength(2);
      expect(state.messageCache[conversationId].messages[1]).toEqual(
        newMessage,
      );
      expect(state.activeMessages).toHaveLength(2);
    });

    it("should update message in conversation", () => {
      const { setMessages, updateMessage } = useAppStore.getState();
      const conversationId = "conv-123";
      const message = createMockMessage();

      setMessages(conversationId, [message]);
      updateMessage(conversationId, message._id, { isSeen: true });

      const state = useAppStore.getState();
      expect(state.messageCache[conversationId].messages[0].isSeen).toBe(true);
    });

    it("should delete message from conversation", () => {
      const { setMessages, deleteMessage } = useAppStore.getState();
      const conversationId = "conv-123";
      const messages = [
        createMockMessage(),
        createMockMessage({ _id: "msg-2" }),
      ];

      setMessages(conversationId, messages);
      deleteMessage(conversationId, "msg-2");

      const state = useAppStore.getState();
      expect(state.messageCache[conversationId].messages).toHaveLength(1);
      expect(state.messageCache[conversationId].messages[0]._id).toBe(
        "message-123",
      );
    });

    it("should manage typing indicators", () => {
      const { setUserTyping, getTypingUsers, clearTypingUsers } =
        useAppStore.getState();
      const conversationId = "conv-123";

      setUserTyping(conversationId, "user-1", true);
      expect(getTypingUsers(conversationId)).toContain("user-1");

      setUserTyping(conversationId, "user-2", true);
      expect(getTypingUsers(conversationId)).toEqual(["user-1", "user-2"]);

      setUserTyping(conversationId, "user-1", false);
      expect(getTypingUsers(conversationId)).toEqual(["user-2"]);

      clearTypingUsers(conversationId);
      expect(getTypingUsers(conversationId)).toEqual([]);
    });

    it("should handle optimistic message updates", () => {
      const {
        addOptimisticMessage,
        confirmOptimisticMessage,
        removeOptimisticMessage,
        setActiveConversation,
      } = useAppStore.getState();
      const conversationId = "conv-123";

      setActiveConversation(conversationId);

      // Add optimistic message
      const tempId = addOptimisticMessage(conversationId, {
        content: "Optimistic message",
        sender: createMockUser(),
        conversation: conversationId,
        isDelivered: false,
        isSeen: false,
        files: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      });

      let state = useAppStore.getState();
      expect(state.messageCache[conversationId].messages).toHaveLength(1);
      expect(state.messageCache[conversationId].messages[0]._id).toBe(tempId);

      // Confirm optimistic message
      const confirmedMessage = createMockMessage({ _id: "confirmed-123" });
      confirmOptimisticMessage(conversationId, tempId, confirmedMessage);

      state = useAppStore.getState();
      expect(state.messageCache[conversationId].messages[0]._id).toBe(
        "confirmed-123",
      );

      // Test removing optimistic message
      const tempId2 = addOptimisticMessage(conversationId, {
        content: "Another optimistic message",
        sender: createMockUser(),
        conversation: conversationId,
        isDelivered: false,
        isSeen: false,
        files: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      });

      removeOptimisticMessage(conversationId, tempId2);

      state = useAppStore.getState();
      expect(state.messageCache[conversationId].messages).toHaveLength(1);
      expect(state.messageCache[conversationId].messages[0]._id).toBe(
        "confirmed-123",
      );
    });
  });
});
