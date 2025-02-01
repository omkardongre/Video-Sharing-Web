import { getWorkspaceFolders, moveVideoLocation } from "@/actions/workspace";
import { moveVideoSchema } from "@/components/forms/change-video-location/schema";
import { useAppSelector } from "@/redux/store";
import { FolderDetails } from "@/types/index.type";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { useMutationData } from "./useMutationData";
import useZodForm from "./useZodForm";

export const useMoveVideos = (videoId: string, currentWorkspaceId: string) => {
  //get state redux
  const { folders } = useAppSelector((state) => state.FolderReducer);
  const { workspaces } = useAppSelector((state) => state.WorkSpaceReducer);

  // fetching states
  const [isFetching, setIsFetching] = useState(false);
  //stat folders
  const [isFolders, setIsFolders] = useState<FolderDetails[] | undefined>(
    undefined
  );

  //use mutation data optimistic
  const { mutate, isPending, isSuccess } = useMutationData(
    ["change-video-location"],
    (data: { folder_id: string; workspace_id: string }) =>
      moveVideoLocation(videoId, data.workspace_id, data.folder_id),
    ["workspace-folders", "user-videos"]
  );
  //use zod form
  const { onFormSubmit, methods } = useZodForm(moveVideoSchema, mutate, {
    folder_id: null,
    workspace_id: currentWorkspaceId,
  });

  const workspaceId = useWatch({
    control: methods.control,
    name: "workspace_id",
  });

  const { register } = methods;
  const errors = methods.formState.errors;

  //fetch folders with a use effect
  const fetchFolders = async (workspace: string) => {
    setIsFetching(true);
    const folders = await getWorkspaceFolders(workspace);
    setIsFetching(false);
    setIsFolders(folders.data);
  };
  useEffect(() => {
    fetchFolders(currentWorkspaceId);
  }, [currentWorkspaceId]);

  useEffect(() => {
    if (workspaceId) {
      fetchFolders(workspaceId);
    }
  }, [workspaceId]);

  return {
    onFormSubmit,
    errors,
    register,
    isPending,
    isSuccess,
    folders,
    workspaces,
    isFetching,
    isFolders,
  };
};
