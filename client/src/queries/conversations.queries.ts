import { QUERY_KEY } from "@/constants/query.constants";
import {
  createConversation,
  deleteConversation,
  getAllConversations,
  updateConversation,
} from "@/repositories/conversations/conversationsRepository";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllConversationsQuery = () =>
  useQuery({
    queryKey: [QUERY_KEY.GET_ALL_CONVERSATIONS],
    queryFn: () => getAllConversations(),
    staleTime: 20000,
    enabled: false,
  });

export const useCreateConversationMutation = () =>
  useMutation(createConversation);

export const useUpdateConversationMutation = () =>
  useMutation(updateConversation);

export const useDeleteConversationMutation = () =>
  useMutation(deleteConversation);
