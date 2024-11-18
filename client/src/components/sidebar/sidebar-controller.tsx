import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FaSlidersH, FaUser } from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { SIDEBAR_KEYS } from "../../enums";

export interface SidebarItemType {
  route: string;
  title: string;
  Icon: IconType;
  onClickHandler?: () => void;
}

const primarySidebarItems: SidebarItemType[] = [
  {
    route: SIDEBAR_KEYS.ALL_CHATS.route,
    title: SIDEBAR_KEYS.ALL_CHATS.title,
    Icon: IoChatbox,
  },
];

const userSidebarItems: SidebarItemType[] = [
  {
    route: SIDEBAR_KEYS.PROFILE.route,
    title: SIDEBAR_KEYS.PROFILE.title,
    Icon: FaUser,
  },
  {
    route: SIDEBAR_KEYS.EDIT.route,
    title: SIDEBAR_KEYS.EDIT.title,
    Icon: FaSlidersH,
  },
];

const useSidebarController = () => {
  const [sidebarActiveItem, setSidebarActiveItem] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location) {
      const { pathname } = location;

      const sidebarActiveItem = pathname.split("/")[1];
      setSidebarActiveItem(sidebarActiveItem);
    }
  }, [location]);

  return {
    primarySidebarItems,
    userSidebarItems,
    sidebarActiveItem,
  };
};

export default useSidebarController;
