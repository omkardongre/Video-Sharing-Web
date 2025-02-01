import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutationData } from "@/hooks/useMutationData";
import { useSearch } from "@/hooks/useSearch";
import { User } from "lucide-react";

import { inviteMembers } from "@/actions/user";
import { useState } from "react";
import Loader from "../loader";

type Props = {
  workspaceId: string;
};

const Search = ({ workspaceId }: Props) => {
  const { query, onSearchQuery, isFetching, onUsers, refetch } = useSearch(
    workspaceId,
    "get-users",
    "USERS"
  );

  const { mutate, isPending } = useMutationData(
    ["invite-member"],
    (data: { receiverId: string; email: string }) =>
      inviteMembers(workspaceId, data.receiverId, data.email)
  );

  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-y-5">
      <Input
        onChange={onSearchQuery}
        value={query}
        className="bg-background border-border border-2 outline-none"
        placeholder="Search for your user..."
        type="text"
      />

      {isFetching && !onUsers ? (
        <div className="flex flex-col gap-y-2">
          <Skeleton className="w-full h-8 rounded-xl" />
        </div>
      ) : !onUsers ? (
        <p className="text-center text-sm text-[#a4a4a4]">No Users Found</p>
      ) : (
        <div>
          {onUsers.map((user) => (
            <div
              key={user.id}
              className="flex gap-x-3 items-center border-border border-2 w-full p-3 rounded-xl bg-card"
            >
              <Avatar>
                <AvatarImage src={user.image as string} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <h3 className="text-bold text-lg capitalize">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="lowercase text-xs bg-background px-2 rounded-lg text-foreground">
                  {user.subscription?.plan}
                </p>
              </div>
              <div className="flex-1 flex justify-end items-center">
                <Button
                  onClick={() => {
                    setLoadingUserId(user.id);
                    mutate(
                      { receiverId: user.id, email: user.email },
                      {
                        onSettled: () => setLoadingUserId(null),
                        onSuccess: () => refetch(),
                      }
                    );
                  }}
                  variant={"default"}
                  className="w-5/12 font-bold"
                >
                  <Loader
                    state={loadingUserId === user.id && isPending}
                    color="#000"
                  >
                    Invite
                  </Loader>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
