import { SingleMessageWithTypeType } from "@/components/main-chat-panel/message-area/message-list/message-list-controller";
import { AxiosError, AxiosResponse } from "axios";

export interface AxiosCustomErrorType extends AxiosError {
  response: AxiosError["response"] & {
    data: CustomErrorDataType;
  };
}
interface CustomErrorDataType {
  message: string;
}

export interface AxiosCustomResponseType extends AxiosResponse {
  data: AxiosCustomResponseDataType;
}

interface AxiosCustomResponseDataType {
  message: string;
  data?: any;
  isError: boolean;
}

export type SubSidebarKeysType = "chats" | "profile" | "settings";

export interface ActiveChatType {
  image?: string;
  name: string;
  userId?: string;
  conversationId?: string;
  isChatTemp: boolean;
  isActive: boolean;
  lastActive: Date;
}
export interface SingleConversationType {
  _id: string;
  participants: ParticipantsEntity[];
  participantsKey: string;
  lastMessage?: SingleMessageType;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface ParticipantsEntity {
  _id: string;
  name: string;
  image?: string;
  isActive: boolean;
  lastActive: Date;
}
export interface SingleMessageType {
  _id: string;
  sender: Sender;
  content?: string;
  conversation: string;
  seenBy?: null[] | null;
  createdAt: string;
  updatedAt: string;
  files?: FileType[];
  __v: number;
  isSeen: boolean;
  isDelivered: boolean;
}
export interface Sender {
  _id: string;
  name: string;
  image?: string;
}
export interface GroupedMessageByDateType {
  date: string;
  label: string;
  messages: SingleMessageWithTypeType[];
}
export interface FileType {
  data: string;
  name: string;
  size: number;
  type: string;
}
export interface ReceivedOfferType {
  offer: RTCSessionDescriptionInit;
  senderDetails: CallingSenderReceiverDetails;
}
export interface CallingSenderReceiverDetails {
  userId: string;
  image?: string;
  name: string;
}
export type ActiveContactInfoType = ActiveChatType;
export type ActiveContactFileInfoType = {
  uuid: "image" | "audio" | "document";
  conversationId: string;
};
