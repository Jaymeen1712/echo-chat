import { BiLogOut } from "react-icons/bi";
import useSidebarController from "./sidebar-controller";
import SidebarItem from "./sidebar-item";

const Sidebar = () => {
  const { primarySidebarItems, userSidebarItems } = useSidebarController();

  return (
    <div className="text-white-primary relative flex h-full flex-col justify-between px-2 py-8 text-xs">
      <div className="text-center">Logo</div>

      <div className="flex flex-col gap-y-2 text-center">
        {primarySidebarItems.map((item) => (
          <SidebarItem key={item.key} item={item} />
        ))}

        <div className="bg-white-primary mx-5 my-4 h-[0.5px] opacity-50" />

        {userSidebarItems.map((item) => (
          <SidebarItem key={item.key} item={item} />
        ))}
      </div>

      <SidebarItem
        item={{
          Icon: BiLogOut,
          key: "logOut",
          title: "Log out",
        }}
      />
    </div>
  );
};

export default Sidebar;
