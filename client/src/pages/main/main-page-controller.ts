import { useAppStore } from "@/store";

const useMainPageController = () => {
  const { isContactInfoContainerOpen, isContactFileContainerOpen } =
    useAppStore();

  return { isContactInfoContainerOpen, isContactFileContainerOpen };
};

export default useMainPageController;
