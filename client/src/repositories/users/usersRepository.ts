import { API_ROUTES } from "@/constants";
import apiClient from "@/repositories/apiClient";
import {
  createUserParam,
  postLoginParam,
  searchUserPostParams,
  UpdateUserPatchParams,
} from "./usersRepository.params";

export const createUser = async (data: createUserParam) => {
  return await apiClient({
    method: "post",
    url: API_ROUTES.REGISTER,
    data,
  });
};

export const postLogin = async ({ email, password }: postLoginParam) => {
  return await apiClient({
    method: "post",
    url: API_ROUTES.LOGIN,
    data: {
      email,
      password,
    },
  });
};

export const searchUserPost = async ({ query }: searchUserPostParams) => {
  return await apiClient({
    method: "post",
    url: API_ROUTES.SEARCH_USERS,
    data: {
      query,
    },
  });
};

export const meGet = async () => {
  return await apiClient({
    method: "get",
    url: API_ROUTES.ME,
  });
};

export const updateUserPatch = async (reqData: UpdateUserPatchParams) => {
  return await apiClient({
    method: "patch",
    url: API_ROUTES.UPDATE_USER,
    data: reqData,
  });
};
