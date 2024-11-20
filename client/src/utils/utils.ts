import { USER_ACCESS_KEY } from "@/enums";
import Cookies from "js-cookie";

export const isAuthenticated = (): boolean => {
  const accessToken = Cookies.get(USER_ACCESS_KEY.TOKEN);
  return !!accessToken;
};
