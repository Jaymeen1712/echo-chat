import apiClient from "@/repositories/apiClient";
import { createUserParam } from "./usersRepository.param";

export const createUser = async (data: createUserParam) => {
  return await apiClient({
    method: "post",
    url: "/user",
    data,
  });
};
