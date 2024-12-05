import { SubSidebarKeysType } from "@/types";

export const SIDEBAR_KEYS: Record<
  string,
  {
    title: string;
    key: SubSidebarKeysType;
  }
> = {
  ALL_CHATS: {
    title: "Chats",
    key: "chats",
  },
  PROFILE: {
    title: "Profile",
    key: "profile",
  },
  EDIT: {
    title: "Edit",
    key: "settings",
  },
};

export const USER_ACCESS_KEY = {
  TOKEN: "accessToken",
};

export const DEFAULT_SUB_SIDEBAR_WIDTH = 400;
