import { SingleConversationType, SingleMessageType } from "./types";

export interface MeResponseType {
  user: {
    userId: string;
    email: string;
    iat: number;
    exp: number;
  };
}
export interface CreateConversationResponseType {
  participants?: string[] | null;
  participantsKey: string;
  isGroup: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface CreateMessageResponseType {
  sender: string;
  content: string;
  conversation: string;
  seenBy?: null[] | null;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export type GetAllConversationsType = SingleConversationType[];
export type GetAllMessagesType = SingleMessageType[];
