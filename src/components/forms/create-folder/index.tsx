import FormGenerator from "@/components/global/form-generator";
import Loader from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { useCreateFolders } from "@/hooks/useCreateFolders";
import { useEffect } from "react";
import { FormProvider } from "react-hook-form";

type Props = { workspaceId: string; onSuccess: () => void };

const CreateFolderForm = ({ workspaceId, onSuccess }: Props) => {
  const { methods, onFormSubmit, isPending, isSuccess } =
    useCreateFolders(workspaceId);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={onFormSubmit} className="flex flex-col gap-y-3">
        <FormGenerator
          register={methods.register}
          name="name"
          placeholder={"Workspace Name"}
          label="Name"
          errors={methods.formState.errors}
          inputType="input"
          type="text"
        />
        <Button
          className="text-sm w-full mt-2"
          type="submit"
          disabled={isPending}
        >
          <Loader state={isPending}>Create Folder</Loader>
        </Button>
      </form>
    </FormProvider>
  );
};

export default CreateFolderForm;
