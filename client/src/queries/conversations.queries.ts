import { QUERY_KEY } from "@/constants/query.constants";
import {
  createConversation,
  deleteConversation,
  getAllConversations,
  getAllFiles,
  getFilesCount,
  updateConversation,
} from "@/repositories/conversations/conversationsRepository";
import { GetAllFilesParams } from "@/repositories/conversations/conversationsRepository.params";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllConversationsQuery = () =>
  useQuery({
    queryKey: [QUERY_KEY.GET_ALL_CONVERSATIONS],
    queryFn: () => getAllConversations(),
    staleTime: 20000,
    enabled: false,
  });

export const useGetAllFilesCountQuery = (
  data: { conversationId: string },
  enabled = true,
) =>
  useQuery({
    queryKey: [QUERY_KEY.GET_FILES_COUNT, data],
    queryFn: () => getFilesCount(data),
    staleTime: 20000,
    enabled,
  });

export const useGetAllFilesQuery = (
  data: GetAllFilesParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: [QUERY_KEY.GET_ALL_FILES, data],
    queryFn: () => getAllFiles(data),
    staleTime: 20000,
    enabled,
  });
};

export const useCreateConversationMutation = () =>
  useMutation(createConversation);

export const useUpdateConversationMutation = () =>
  useMutation(updateConversation);

export const useDeleteConversationMutation = () =>
  useMutation(deleteConversation);
