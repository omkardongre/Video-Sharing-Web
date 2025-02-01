import { editVideoInfo } from "@/actions/workspace";
import { editVideoInfoSchema } from "@/components/forms/edit-video/schema";
import { useMutationData } from "./useMutationData";
import useZodForm from "./useZodForm";

export const useEditVideo = (
  videoId: string,
  title: string,
  description: string
) => {
  const { mutate, isPending, isSuccess } = useMutationData(
    ["edit-video"],
    (data: { title: string; description: string }) =>
      editVideoInfo(videoId, data.title, data.description),
    "preview-video"
  );
  const { methods, onFormSubmit } = useZodForm(editVideoInfoSchema, mutate, {
    title,
    description,
  });

  return { onFormSubmit, methods, isPending, isSuccess };
};
