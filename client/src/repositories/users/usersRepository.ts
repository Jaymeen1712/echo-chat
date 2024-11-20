import apiClient from "@/repositories/apiClient";
import { createUserParam, postLoginParam } from "./usersRepository.param";

export const createUser = async (data: createUserParam) => {
  return await apiClient({
    method: "post",
    url: "/user",
    data,
  });
};

export const postLogin = async ({ email, password }: postLoginParam) => {
  return await apiClient({
    method: "post",
    url: `/user/login`,
    data: {
      email,
      password,
    },
  });
};
