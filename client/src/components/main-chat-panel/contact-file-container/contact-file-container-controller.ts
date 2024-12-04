import { useAppStore } from "@/store";

const useContactFileContainerController = () => {
  const { setIsContactFileContainerOpen } = useAppStore();

  const handleCloseButtonClick = () => {
    setIsContactFileContainerOpen(false);
  };

  return { handleCloseButtonClick };
};

export default useContactFileContainerController;
