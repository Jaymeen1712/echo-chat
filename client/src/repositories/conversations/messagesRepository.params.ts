export interface createMessagePostParams {
  senderId: string;
  conversationId: string;
  content: string;
}
export interface getAllMessagesGetParams {
  conversationId: string;
}
export interface deleteMessageDeleteParams {
  messageId: string;
}
