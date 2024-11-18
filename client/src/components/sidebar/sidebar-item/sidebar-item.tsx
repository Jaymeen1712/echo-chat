import { SidebarItemType } from "../sidebar-controller";

interface SidebarItemProps {
  item: SidebarItemType;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
  const { Icon, key, title } = item;

  return (
    <div className="hover:bg-white-primary/30 flex cursor-pointer flex-col justify-center gap-y-2 rounded-xl p-3 text-center opacity-50 transition-all">
      <Icon size={22} className="w-full" />
      <span className="">{title}</span>
    </div>
  );
};

export default SidebarItem;
