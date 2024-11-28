import { FileType } from "@/types";

export interface createMessagePostParams {
  senderId: string;
  conversationId: string;
  content?: string;
  files?: FileType[];
}
export interface getAllMessagesGetParams {
  conversationId: string;
}
export interface deleteMessageDeleteParams {
  messageId: string;
}
