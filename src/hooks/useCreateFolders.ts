import { createFolder } from "@/actions/workspace";
import {
  FolderSchema,
  folderSchema,
} from "@/components/forms/create-folder/schema";
import { useMutationData } from "./useMutationData";
import useZodForm from "./useZodForm";

export const useCreateFolders = (workSpaceId: string) => {
  const { mutate, isPending, isSuccess } = useMutationData(
    ["create-folder"],
    (formValues: FolderSchema) => createFolder(workSpaceId, formValues.name),
    "workspace-folders"
  );

  const { methods, onFormSubmit } = useZodForm(folderSchema, mutate);
  return { methods, onFormSubmit, isPending, isSuccess };
};
