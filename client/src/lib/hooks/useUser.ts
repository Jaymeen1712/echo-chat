import { useMeQuery } from "@/queries";
import { useAppStore } from "@/store";
import { useEffect } from "react";

const useUser = () => {
  const { setCurrentUserData } = useAppStore();

  const { data } = useMeQuery();

  useEffect(() => {
    if (data) {
      const { user } = data.data.data;
      setCurrentUserData(user);
    }
  }, [data]);

  return null;
};

export default useUser;
