import { useAppStore } from "@/store";

const useMessageHeaderController = () => {
  const { activeChat } = useAppStore();

  return { activeChat };
};

export default useMessageHeaderController;
