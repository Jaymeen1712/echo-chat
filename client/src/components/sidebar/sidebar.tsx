import { BiLogOut } from "react-icons/bi";
import useSidebarController from "./sidebar-controller";
import SidebarItem from "./sidebar-item";

const Sidebar = () => {
  const { primarySidebarItems, userSidebarItems, sidebarActiveItem } =
    useSidebarController();

  return (
    <div className="relative flex h-full flex-col justify-between gap-y-2 px-2 py-8 text-xs text-white-primary">
      <div className="text-center">Logo</div>

      <div className="flex flex-col gap-y-2 overflow-y-auto text-center">
        {primarySidebarItems.map((item) => (
          <SidebarItem
            key={item.route}
            item={item}
            sidebarActiveItem={sidebarActiveItem}
          />
        ))}

        <div className="mx-5 my-4 h-[0.5px] bg-white-primary opacity-50" />

        {userSidebarItems.map((item) => (
          <SidebarItem
            key={item.route}
            item={item}
            sidebarActiveItem={sidebarActiveItem}
          />
        ))}
      </div>

      <SidebarItem
        item={{
          Icon: BiLogOut,
          route: "logOut",
          title: "Log out",
        }}
        sidebarActiveItem={sidebarActiveItem}
      />
    </div>
  );
};

export default Sidebar;
