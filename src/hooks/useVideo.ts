import { createCommentAndReply, getUserProfile } from "@/actions/user";
import { createCommentSchema } from "@/components/forms/comment-form/schema";
import { useMutationData } from "./useMutationData";
import { useQueryData } from "./useQueryData";
import useZodForm from "./useZodForm";

export const useVideoComment = (videoId: string, commentId?: string) => {
  const { data: userProfileResponse } = useQueryData(
    ["user-profile"],
    getUserProfile
  );

  const { isPending, mutate } = useMutationData(
    ["new-comment"],
    (data: { comment: string }) => {
      if (!userProfileResponse || !userProfileResponse.data)
        return Promise.resolve(null);

      return createCommentAndReply(
        userProfileResponse.data.id,
        data.comment,
        videoId,
        commentId
      );
    },
    "video-comments",
    () => methods.reset()
  );

  const { methods, onFormSubmit } = useZodForm(createCommentSchema, mutate);

  return { methods, onFormSubmit, isPending };
};
