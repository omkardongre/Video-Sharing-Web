import { createWorkspace } from "@/actions/workspace";
import { workspaceSchema } from "@/components/forms/workspace-form/schema";
import { useMutationData } from "./useMutationData";
import useZodForm from "./useZodForm";

export const useCreateWorkspace = () => {
  const { mutate, isPending, isSuccess } = useMutationData(
    ["create-workspace"],
    (data: { name: string }) => createWorkspace(data.name),
    "user-workspaces"
  );

  const { methods, onFormSubmit } = useZodForm(workspaceSchema, mutate);
  return { methods, onFormSubmit, isPending, isSuccess };
};
