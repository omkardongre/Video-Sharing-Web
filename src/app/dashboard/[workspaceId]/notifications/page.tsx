"use client";
import { getNotifications } from "@/actions/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQueryData } from "@/hooks/useQueryData";
import { User } from "lucide-react";

const Notifications = () => {
  const { data } = useQueryData(
    ["user-notifications"],
    getNotifications
  );

  const { data: notifications, status } = data as {
    status: number;
    data: {
      notification: {
        id: string;
        userId: string | null;
        content: string;
      }[];
    };
  };

  if (status !== 200) {
    return (
      <div className="flex justify-center items-center h-full w-full text-foreground">
        <p>No Notification</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      {notifications.notification.map((n) => (
        <div
          key={n.id}
          className="border border-border bg-card flex gap-x-3 items-center rounded-lg p-3"
        >
          <Avatar>
            <AvatarFallback className="bg-muted text-muted-foreground">
              <User />
            </AvatarFallback>
          </Avatar>
          <p className="text-foreground">{n.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
