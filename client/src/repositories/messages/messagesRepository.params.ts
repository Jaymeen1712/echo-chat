export interface createConversationPostParams {
  participants: string[];
  isGroup?: boolean;
  groupName?: string;
  groupImage?: string;
}
export interface updateConversationPatchParams {
  conversationId: string;
  lastMessageId: string;
}
export interface deleteConversationDeleteParams {
  conversationId: string;
}
