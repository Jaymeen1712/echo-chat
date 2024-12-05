import { API_ROUTES } from "@/constants";
import apiClient from "@/repositories/apiClient";
import {
  createMessagePostParams,
  deleteMessageDeleteParams,
  getAllMessagesGetParams,
} from "../conversations/conversationsRepository.params";

export const createMessage = async (data: createMessagePostParams) => {
  return await apiClient({
    method: "post",
    url: API_ROUTES.CREATE_MESSAGE,
    data,
  });
};
export const getAllMessages = async (data: getAllMessagesGetParams) => {
  return await apiClient({
    method: "get",
    url: API_ROUTES.GET_ALL_MESSAGES.replace(
      ":conversationId",
      data.conversationId,
    ),
    data,
  });
};
export const deleteMessage = async (data: deleteMessageDeleteParams) => {
  return await apiClient({
    method: "delete",
    url: API_ROUTES.DELETE_MESSAGE.replace(":messageId", data.messageId),
  });
};
