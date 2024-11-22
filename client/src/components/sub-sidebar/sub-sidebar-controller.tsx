import { useAppStore } from "@/store";
import ChatsSubSidebar from "./chats";
import ProfileSubSidebar from "./profile";
import SettingsSubSidebar from "./settings";

const useSubSidebarController = () => {
  const { activeSubSidebarKey } = useAppStore();

  const renderSubSidebar = () => {
    switch (activeSubSidebarKey) {
      case "chats":
        return <ChatsSubSidebar subSidebarKey={activeSubSidebarKey} />;
      case "profile":
        return <ProfileSubSidebar />;
      case "settings":
        return <SettingsSubSidebar />;
    }
  };

  return { renderSubSidebar };
};

export default useSubSidebarController;
