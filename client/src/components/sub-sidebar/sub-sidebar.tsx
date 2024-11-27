import useSubSidebarController from "./sub-sidebar-controller";

const SubSidebar = () => {
  const { renderSubSidebar } = useSubSidebarController();

  return <>{renderSubSidebar()}</>;
};

export default SubSidebar;
