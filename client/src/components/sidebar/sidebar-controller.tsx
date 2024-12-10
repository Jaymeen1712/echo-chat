import { useAppStore } from "@/store";
import Cookies from "js-cookie";
import { useCallback, useMemo } from "react";
import { IconType } from "react-icons";
import { FaSlidersH, FaUser } from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";
import { SIDEBAR_KEYS, USER_ACCESS_KEY } from "../../enums";

export interface SidebarItemType {
  key: string;
  title: string;
  Icon: IconType;
  onClickHandler: () => void;
}

const useSidebarController = () => {
  const { setActiveSubSidebarKey } = useAppStore();

  const primarySidebarItems: SidebarItemType[] = [
    {
      key: SIDEBAR_KEYS.ALL_CHATS.key,
      title: SIDEBAR_KEYS.ALL_CHATS.title,
      Icon: IoChatbox,
      onClickHandler: () => setActiveSubSidebarKey(SIDEBAR_KEYS.ALL_CHATS.key),
    },
  ];

  const userSidebarItems: SidebarItemType[] = useMemo(
    () => [
      {
        key: SIDEBAR_KEYS.PROFILE.key,
        title: SIDEBAR_KEYS.PROFILE.title,
        Icon: FaUser,
        onClickHandler: () => setActiveSubSidebarKey(SIDEBAR_KEYS.PROFILE.key),
      },
      {
        key: SIDEBAR_KEYS.EDIT.key,
        title: SIDEBAR_KEYS.EDIT.title,
        Icon: FaSlidersH,
        onClickHandler: () => setActiveSubSidebarKey(SIDEBAR_KEYS.EDIT.key),
      },
    ],
    [],
  );

  const handleLogoutUser = useCallback(async () => {
    Cookies.remove(USER_ACCESS_KEY.TOKEN);
    window.location.reload();
    // window.location.href = "/login";
  }, []);

  return {
    handleLogoutUser,
    primarySidebarItems,
    userSidebarItems,
  };
};

export default useSidebarController;
