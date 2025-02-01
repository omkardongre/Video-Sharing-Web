"use client";
import FormGenerator from "@/components/global/form-generator";
import Loader from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { useVideoComment } from "@/hooks/useVideo";
import { useState } from "react";
import { FormProvider } from "react-hook-form";

type Props = {
  videoId: string;
  commentId?: string;
  authorName?: string;
  isReply?: boolean;
  close?: () => void;
};

const CommentForm = ({ videoId, commentId, authorName, isReply, close }: Props) => {
  const { methods, onFormSubmit, isPending } = useVideoComment(
    videoId,
    commentId
  );

  const [showButtons, setShowButtons] = useState(false);

  // Watch the comment field to toggle Comment button
  const { register, formState, watch, handleSubmit } = methods;
  const commentValue = watch("comment") || "";

  return (
    <FormProvider {...methods}>
      <form
        className="w-full flex flex-col space-y-2"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <FormGenerator
          register={register}
          errors={formState.errors}
          placeholder={"Add a comment"}
          name="comment"
          inputType="input"
          lines={8}
          type="text"
          defaultValue={authorName ? `@${authorName} ` : ""}
          onFocus={() => setShowButtons(true)}
        />
        {showButtons && (
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              className="bg-secondary text-secondary-foreground"
              onClick={() => {
                methods.reset({ comment: "" });
                setShowButtons(false);
                if (close) close();
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!commentValue.trim() || isPending}
              className="bg-primary text-primary-foreground"
            >
              <Loader state={isPending}>{isReply ? "Reply" : "Comment"}</Loader>
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default CommentForm;
