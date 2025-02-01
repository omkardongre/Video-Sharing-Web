"use client";
import { getVideoComments } from "@/actions/user";
import CommentForm from "@/components/forms/comment-form";
import { TabsContent } from "@/components/ui/tabs";
import { useQueryData } from "@/hooks/useQueryData";
import CommentCard from "../comment-card";

type Props = {
  videoId: string;
};

const Activities = ({ videoId }: Props) => {
  const { data } = useQueryData(["video-comments"], () =>
    getVideoComments(videoId)
  );

  if (!data) return null;

  const { data: comments } = data;

  return (
    <TabsContent
      value="Activity"
      className="rounded-xl flex flex-col gap-y-5  h-screen"
    >
      {/* <div className="border-2 border-gray-400 rounded-md"> */}
      <div className="mr-1">
        <CommentForm videoId={videoId} />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {comments?.map((comment) => (
          <CommentCard
            comment={comment.content}
            key={comment.id}
            author={{
              image: comment.User.image || "/default-avatar.svg",
              firstName: comment.User.firstName,
              lastName: comment.User.lastName,
            }}
            videoId={videoId}
            replies={comment.replies}
            commentId={comment.id}
            createdAt={comment.createdAt}
          />
        ))}
      </div>
    </TabsContent>
  );
};

export default Activities;
