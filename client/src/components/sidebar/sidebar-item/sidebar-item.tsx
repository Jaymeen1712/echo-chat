import { SidebarItemType } from "../sidebar-controller";
import useSidebarItemController from "./sidebar-item-controller";

interface SidebarItemProps {
  item: SidebarItemType;
  sidebarActiveItem: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  sidebarActiveItem,
}) => {
  const { Icon, route, title } = item;

  const { handleClickSidebarItem } = useSidebarItemController({ item });

  return (
    <div
      className={`flex cursor-pointer flex-col justify-center gap-y-2 rounded-xl p-3 text-center opacity-50 transition-all hover:bg-white-primary/30 ${sidebarActiveItem === route && "bg-white-primary/30"}`}
      onClick={handleClickSidebarItem}
    >
      <Icon size={22} className="w-full" />
      <span className="">{title}</span>
    </div>
  );
};

export default SidebarItem;
