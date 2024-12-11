import { checkWorkspaceExists } from "@/actions/workspace";
import FormGenerator from "@/components/global/form-generator";
import Loader from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "@/hooks/useCreateWorkspace";
import { useEffect } from "react";
import { FormProvider } from "react-hook-form";

type Props = {
  onSuccess: () => void;
};

const WorkspaceForm = ({ onSuccess }: Props) => {
  const { methods, onFormSubmit, isPending, isSuccess } = useCreateWorkspace();

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);

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
          checkExists={async (name: string) => {
            const result = await checkWorkspaceExists(name);
            return result;
          }}
        />
        <Button
          className="text-sm w-full mt-2"
          type="submit"
          disabled={isPending}
        >
          <Loader state={isPending}>Create Workspace</Loader>
        </Button>
      </form>
    </FormProvider>
  );
};

export default WorkspaceForm;
