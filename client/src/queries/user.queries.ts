import { QUERY_KEY } from "@/constants/query.constants";
import {
  createUser,
  meGet,
  postLogin,
  searchUserPost,
  updateUserPatch,
} from "@/repositories/users/usersRepository";
import { searchUserPostParams } from "@/repositories/users/usersRepository.params";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSearchUserQuery = (params: searchUserPostParams) =>
  useQuery({
    queryKey: [QUERY_KEY.SEARCH_USERS],
    queryFn: () => searchUserPost(params).then((res) => res.data),
    staleTime: 20000,
    enabled: false,
  });

export const useMeQuery = () =>
  useQuery({
    queryKey: [QUERY_KEY.ME],
    queryFn: () => meGet(),
    staleTime: 20000,
  });

export const useCreateUserMutation = () => useMutation(createUser);

export const usePostLoginMutation = () => useMutation(postLogin);

export const useUpdateUserMutation = () => useMutation(updateUserPatch);
