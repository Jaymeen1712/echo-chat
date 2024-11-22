import { QUERY_KEY } from "@/constants/query.constants";
import { getAllMessagesGetParams } from "@/repositories/conversations/messagesRepository.params";
import {
  createMessage,
  deleteMessage,
  getAllMessages,
} from "@/repositories/messages/messagesRepository";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllMessagesQuery = (data: getAllMessagesGetParams) =>
  useQuery({
    queryKey: [QUERY_KEY.GET_ALL_MESSAGES],
    queryFn: () => getAllMessages(data),
    staleTime: 20000,
    enabled: false,
  });

export const useCreateMessageMutation = () => useMutation(createMessage);

export const useDeleteMessageMutation = () => useMutation(deleteMessage);
