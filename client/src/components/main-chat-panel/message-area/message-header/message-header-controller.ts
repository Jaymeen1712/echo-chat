import { useAppStore } from "@/store";

const useMessageHeaderController = () => {
  const { activeChat, setIsContactInfoContainerOpen } = useAppStore();

  const handleContactTitleClick = () => {
    setIsContactInfoContainerOpen(true);
  };

  return { activeChat, handleContactTitleClick };
};

export default useMessageHeaderController;
