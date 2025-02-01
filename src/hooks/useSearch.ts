import { useEffect, useState } from "react";

import { searchUsers } from "@/actions/user";
import { UserDetails } from "@/types/index.type";
import { useQueryData } from "./useQueryData";

export const useSearch = (workSpaceId: string, key: string, type: "USERS") => {
  const [query, setQuery] = useState("");
  const [debounce, setDebounce] = useState("");
  const [onUsers, setOnUsers] = useState<UserDetails[]>([]);

  const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebounce(query);
    }, 1000);
    return () => clearTimeout(delayInputTimeoutId);
  }, [query]);

  const { refetch, isFetching } = useQueryData(
    [key, debounce],
    async ({ queryKey }) => {
      if (type === "USERS") {
        const users = await searchUsers(queryKey[1] as string, workSpaceId);
        if (users.status === 200) {
          setOnUsers(users.data);
          return users.data;
        } else {
          setOnUsers([]);
          return [];
        }
      }
    }
  );

  useEffect(() => {
    if (debounce) refetch();
    if (!debounce) setOnUsers([]);
    return () => {};
  }, [debounce, refetch]);

  return { onSearchQuery, query, isFetching, onUsers, refetch };
};
