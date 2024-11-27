import { API_ROUTES } from "@/constants";
import apiClient from "@/repositories/apiClient";
import {
  createConversationPostParams,
  updateConversationPatchParams,
  deleteConversationDeleteParams,
} from "../messages/messagesRepository.params";

export const createConversation = async (
  data: createConversationPostParams,
) => {
  return await apiClient({
    method: "post",
    url: API_ROUTES.CREATE_CONVERSATION,
    data,
  });
};
export const getAllConversations = async () => {
  return await apiClient({
    method: "get",
    url: API_ROUTES.GET_ALL_CONVERSATIONS,
  });
};
export const updateConversation = async (
  data: updateConversationPatchParams,
) => {
  return await apiClient({
    method: "patch",
    url: API_ROUTES.UPDATE_CONVERSATION,
    data,
  });
};
export const deleteConversation = async (
  data: deleteConversationDeleteParams,
) => {
  return await apiClient({
    method: "delete",
    url: API_ROUTES.DELETE_CONVERSATION.replace(
      ":conversationId",
      data.conversationId,
    ),
  });
};
