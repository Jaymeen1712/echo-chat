import { useAppStore } from "./store";

export { useAppStore };

// Selector hooks for better performance
export const useCurrentUser = () =>
  useAppStore((state) => state.currentUserData);
export const useActiveChat = () => useAppStore((state) => state.activeChat);
export const useActiveMessages = () =>
  useAppStore((state) => state.activeMessages);
export const useOnlineUsers = () => useAppStore((state) => state.onlineUsers);
export const useIsNewChatOpen = () =>
  useAppStore((state) => state.isNewChatOpen);
export const useActiveSubSidebar = () =>
  useAppStore((state) => state.activeSubSidebar);

// Action hooks
export const useAppActions = () =>
  useAppStore((state) => ({
    toggleNewChat: state.toggleNewChat,
    setActiveSubSidebar: state.setActiveSubSidebar,
    setCurrentUserData: state.setCurrentUserData,
    setActiveChat: state.setActiveChat,
    setOnlineUsers: state.setOnlineUsers,
    updateUserOnlineStatus: state.updateUserOnlineStatus,
  }));

export const useMessageActions = () =>
  useAppStore((state) => ({
    setActiveConversation: state.setActiveConversation,
    setMessages: state.setMessages,
    addMessage: state.addMessage,
    updateMessage: state.updateMessage,
    deleteMessage: state.deleteMessage,
    addOptimisticMessage: state.addOptimisticMessage,
    removeOptimisticMessage: state.removeOptimisticMessage,
    confirmOptimisticMessage: state.confirmOptimisticMessage,
    setUserTyping: state.setUserTyping,
    clearTypingUsers: state.clearTypingUsers,
  }));
