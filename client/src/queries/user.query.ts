import { createUser } from "@/repositories/users/usersRepository";
import { useMutation } from "@tanstack/react-query";

export const useCreateUserMutation = () => useMutation(createUser);
