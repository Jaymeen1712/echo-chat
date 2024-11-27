import { SidebarItemType } from "../sidebar-controller";
import useSidebarItemController from "./sidebar-item-controller";

interface SidebarItemProps {
  item: SidebarItemType;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
  const { Icon, key, title, onClickHandler } = item;

  const { activeSubSidebarKey } = useSidebarItemController();

  return (
    <div
      className={`flex cursor-pointer flex-col justify-center gap-y-2 rounded-xl p-3 text-center opacity-50 transition-all hover:bg-white-primary/30 ${activeSubSidebarKey === key && "bg-white-primary/30 !opacity-100"}`}
      onClick={onClickHandler}
    >
      <Icon size={22} className="w-full" />
      <span className="">{title}</span>
    </div>
  );
};

export default SidebarItem;
