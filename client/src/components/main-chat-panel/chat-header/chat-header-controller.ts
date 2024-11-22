import { useDebounce } from "@/lib/hooks";
import { useAppStore } from "@/store";
import { useEffect, useState } from "react";

const useChatHeaderController = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { setDebouncedSearchQuery } = useAppStore();

  const debouncedHookSearchQuery = useDebounce(searchQuery, 500);

  const handleOnChangeSearchInput: React.InputHTMLAttributes<HTMLInputElement>["onChange"] =
    (e) => {
      setSearchQuery(e.target.value);
    };

  useEffect(() => {
    if (debouncedHookSearchQuery !== undefined) {
      const debouncedSearchQuery = debouncedHookSearchQuery.length
        ? debouncedHookSearchQuery
        : undefined;

      setDebouncedSearchQuery(debouncedSearchQuery);
    }
  }, [debouncedHookSearchQuery]);

  return { handleOnChangeSearchInput };
};

export default useChatHeaderController;
