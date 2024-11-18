import { useNavigate } from "react-router-dom";
import { SidebarItemType } from "../sidebar-controller";

interface SidebarItemControllerProps {
  item: SidebarItemType;
}

const useSidebarItemController = ({ item }: SidebarItemControllerProps) => {
  const navigate = useNavigate();

  const handleClickSidebarItem = () => {
    navigate(`/${item.route}`);
  };

  return { handleClickSidebarItem };
};

export default useSidebarItemController;
