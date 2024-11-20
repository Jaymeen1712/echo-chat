import { createUser, postLogin } from "@/repositories/users/usersRepository";
import { useMutation } from "@tanstack/react-query";

export const useCreateUserMutation = () => useMutation(createUser);

export const usePostLoginMutation = () => useMutation(postLogin);
