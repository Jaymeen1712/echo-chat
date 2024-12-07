import { BiLogOut } from "react-icons/bi";
import IconLogo from "../icon-logo";
import useSidebarController from "./sidebar-controller";
import SidebarItem from "./sidebar-item";

const Sidebar = () => {
  const { primarySidebarItems, userSidebarItems, handleLogoutUser } =
    useSidebarController();

  return (
    <div className="relative flex h-full flex-col justify-between gap-y-2 px-2 py-8 text-xs text-white-primary">
      <div className="mt-1 flex items-center justify-center">
        <IconLogo />
      </div>

      <div className="flex flex-col gap-y-2 overflow-y-auto text-center">
        {primarySidebarItems.map((item) => (
          <SidebarItem key={item.key} item={item} />
        ))}

        <div className="mx-5 my-4 h-[0.5px] bg-white-primary opacity-50" />

        {userSidebarItems.map((item) => (
          <SidebarItem key={item.key} item={item} />
        ))}
      </div>

      <SidebarItem
        item={{
          Icon: BiLogOut,
          key: "logOut",
          title: "Log out",
          onClickHandler: handleLogoutUser,
        }}
      />
    </div>
  );
};

export default Sidebar;
