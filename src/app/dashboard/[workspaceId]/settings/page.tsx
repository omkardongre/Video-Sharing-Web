"use client";
import { enableFirstView, getFirstView } from "@/actions/user";
import { DarkMode } from "@/components/theme/dark.mode";
import { LightMode } from "@/components/theme/light-mode";
import { SystemMode } from "@/components/theme/system-mode";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SettingsPage = () => {
  const [firstView, setFirstView] = useState<undefined | boolean>(undefined);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getFirstView();
      if (response.status === 200) setFirstView(response.data);
    };
    fetchData();
  }, []);

  const switchState = async (checked: boolean) => {
    setFirstView(checked);
    const response = await enableFirstView(checked);
    if (response) {
      toast(response.status === 200 ? "Success" : "Failed", {
        description: response.data,
      });
    }
  };

  return (
    <div className="flex flex-col gap-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-4 flex lg:flex-row flex-col items-start gap-5">
          <div
            className={cn(
              "rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent",
              theme == "system" && "border-primary"
            )}
            onClick={() => setTheme("system")}
          >
            <SystemMode />
          </div>
          <div
            className={cn(
              "rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent",
              theme == "light" && "border-primary"
            )}
            onClick={() => setTheme("light")}
          >
            <LightMode />
          </div>
          <div
            className={cn(
              "rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent",
              theme == "dark" && "border-primary"
            )}
            onClick={() => setTheme("dark")}
          >
            <DarkMode />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-10 gap-y-3">
        <h2 className="text-2xl font-bold">Video Sharing Settings</h2>
        <p className="text-muted-foreground">
          Enabling this feature will send you notifications when someone watched
          your video for the first time. This feature can help during client
          outreach.
        </p>
        <Label className="flex items-center gap-x-3 mt-4 text-md">
          Enable First View
          <Switch
            onCheckedChange={switchState}
            disabled={firstView === undefined}
            checked={firstView}
          />
        </Label>
      </div>
    </div>
  );
};

export default SettingsPage;
