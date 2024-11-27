import { useAppStore } from "@/store";

const useSidebarItemController = () => {
  const { activeSubSidebarKey } = useAppStore();

  return { activeSubSidebarKey };
};

export default useSidebarItemController;
