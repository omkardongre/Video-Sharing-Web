import FormGenerator from "@/components/global/form-generator";
import Loader from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { useEditVideo } from "@/hooks/useEditVideo";
import { useEffect } from "react";
import { FormProvider } from "react-hook-form";

type Props = {
  videoId: string;
  title: string;
  description: string;
  onSuccess: () => void;
};

const EditVideoForm = ({ description, title, videoId, onSuccess }: Props) => {
  const { methods, isPending, onFormSubmit, isSuccess } = useEditVideo(
    videoId,
    title,
    description
  );

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={onFormSubmit} className="flex flex-col gap-y-5">
        <FormGenerator
          register={methods.register}
          errors={methods.formState.errors}
          name="title"
          inputType="input"
          type="text"
          placeholder={"Video Title..."}
          label="Title"
        />

        <FormGenerator
          register={methods.register}
          label="Description"
          errors={methods.formState.errors}
          name="description"
          inputType="textarea"
          type="text"
          lines={5}
          placeholder={"Video Description..."}
        />
        <Button>
          <Loader state={isPending}>Update</Loader>
        </Button>
      </form>
    </FormProvider>
  );
};

export default EditVideoForm;
