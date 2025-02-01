import Loader from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMoveVideos } from "@/hooks/useFolders";
import { useCallback } from "react";

type Props = {
  videoId: string;
  currentFolderId?: string;
  currentWorkspaceId?: string;
  currentFolderName?: string;
  onSuccess: () => void;
};

const ChangeVideoLocation = ({
  videoId,
  currentFolderId,
  currentWorkspaceId,
  onSuccess,
}: Props) => {
  const { register, isPending, onFormSubmit, folders, workspaces, isFolders } =
    useMoveVideos(videoId, currentWorkspaceId!);

  const folder = folders.find((f) => f.id === currentFolderId);
  const workspace = workspaces.find((f) => f.id === currentWorkspaceId);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      await onFormSubmit(e);
      onSuccess();
    },
    [onFormSubmit, onSuccess]
  );

  return (
    <form className="flex flex-col gap-y-5" onSubmit={handleSubmit}>
      <div className="border-[1px] rounded-xl p-5">
        <h2 className="text-xs text-[#a4a4a4]">Current Workspace</h2>
        {workspace && <p>{workspace.name}</p>}
        <h2 className="text-xs text-[#a4a4a4] mt-4">Current Folder</h2>
        {folder ? <p>{folder.name}</p> : "This video has no folder"}
      </div>
      <Separator orientation="horizontal" />
      <div className="flex flex-col gap-y-5 p-5 border-[1px] rounded-xl">
        <h2 className="text-xs text-[#a4a4a4]">To</h2>
        <Label className="flex-col gap-y-2 flex">
          <p className="text-xs">Workspace</p>
          <select
            className="rounded-xl bg-transparent text-sm"
            {...register("workspace_id")}
          >
            {workspaces.map((workspace) => (
              <option
                key={workspace.id}
                className="text-[#a4a4a4]"
                value={workspace.id}
              >
                {workspace.name}
              </option>
            ))}
          </select>
        </Label>
        <Label className="flex flex-col gap-y-2">
          <p className="text-xs">Folders in this workspace</p>
          <Loader state={!isFolders} color="white">
            {isFolders && isFolders.length > 0 ? (
              <select
                {...register("folder_id")}
                className="rounded-xl bg-transparent text-base"
              >
                {isFolders.map((folder) => (
                  <option
                    className="text-[#a4a4a4]"
                    key={folder.id}
                    value={folder.id}
                  >
                    {folder.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[#a4a4a4] text-sm">
                This workspace has no folders
              </p>
            )}
          </Loader>
        </Label>
      </div>
      <Button>
        <Loader state={isPending} color="#000">
          Transfer
        </Loader>
      </Button>
    </form>
  );
};

export default ChangeVideoLocation;
