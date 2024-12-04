import { useAppStore } from "@/store";

const useMessageHeaderController = () => {
  const { activeChat, setIsContactInfoContainerOpen, setActiveContactInfo } =
    useAppStore();

  const handleContactTitleClick = () => {
    setIsContactInfoContainerOpen(true);
    setActiveContactInfo(activeChat);
  };

  return { activeChat, handleContactTitleClick };
};

export default useMessageHeaderController;
