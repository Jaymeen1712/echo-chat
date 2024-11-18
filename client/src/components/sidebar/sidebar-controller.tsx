import { IconType } from "react-icons";
import { FaSlidersH, FaUser } from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";

export interface SidebarItemType {
  key: string;
  title: string;
  Icon: IconType;
  onClickHandler?: () => void;
}

const useSidebarController = () => {
  const primarySidebarItems: SidebarItemType[] = [
    {
      key: "allChats",
      title: "All chats",
      Icon: IoChatbox,
    },
  ];

  const userSidebarItems: SidebarItemType[] = [
    {
      key: "profile",
      title: "Profile",
      Icon: FaUser,
    },
    {
      key: "edit",
      title: "Edit",
      Icon: FaSlidersH,
    },
  ];

  return {
    primarySidebarItems,
    userSidebarItems,
  };
};

export default useSidebarController;
