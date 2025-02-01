"use client";
import CommentForm from "@/components/forms/comment-form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { timeAgo } from "@/lib/timeAgo";
import { cn } from "@/lib/utils";
import { CommentRepliesProps } from "@/types/index.type";
import { ChevronDown, ChevronUp, DotIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  comment: string;
  author: { image: string; firstName: string; lastName: string };
  videoId: string;
  commentId?: string;
  replies: CommentRepliesProps[];
  isReply?: boolean;
  createdAt: Date;
};

const CommentCard = ({
  author,
  comment,
  replies,
  videoId,
  commentId,
  isReply,
  createdAt,
}: Props) => {
  const [onReply, setOnReply] = useState<boolean>(false);
  const [showReplies, setShowReplies] = useState(false);

  const timeAgoText = timeAgo(createdAt);
  console.log("timeAgoText", timeAgoText);
  return (
    <Card
      className={cn(
        isReply
          ? "bg-[#1D1D1D] pl-10 border-none shadow-none"
          : "border-[1px] bg-[#1D1D1D] p-5 shadow-none",
        "relative"
      )}
    >
      <div className="flex gap-x-2 items-center">
        <Avatar>
          <AvatarImage src={author.image} alt="author" />
        </Avatar>
        <div className="capitalize text-sm text-[#BDBDBD] flex">
          {author.firstName} {author.lastName}{" "}
          <div className="flex items-center gap-[0]">
            <DotIcon className="text-[#707070]" />
            <span className="text-[#707070] text-xs ml-[-6px] normal-case">
              {timeAgoText}
            </span>
          </div>
        </div>
      </div>
      <div className="flex m-3 items-center">
        <p className="text-[#BDBDBD] break-words overflow-auto">{comment}</p>
      </div>
      {!isReply && (
        <div className="flex justify-end mt-3 ">
          {!onReply ? (
            <Button
              onClick={() => setOnReply(true)}
              className="text-sm rounded-full bg-[#252525] text-white hover:text-black absolute z-[1] top-8"
            >
              Reply
            </Button>
          ) : (
            <CommentForm
              close={() => setOnReply(false)}
              videoId={videoId}
              commentId={commentId}
              authorName={author.firstName}
              isReply={true}
            />
          )}
        </div>
      )}
      {replies.length > 0 && (
        <>
          <Button
            variant="ghost"
            className="flex items-center space-x-1 mt-2"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>
              {showReplies
                ? "Hide replies"
                : `Show replies (${replies.length})`}
            </span>
          </Button>

          {showReplies && (
            <div className="flex flex-col gap-y-10 mt-5 border-l-2">
              {replies.map((r) => (
                <CommentCard
                  isReply
                  key={r.id}
                  comment={r.content}
                  commentId={r.parentCommentId || ""}
                  videoId={videoId}
                  replies={[]}
                  author={{
                    image: r.User.image || "/default-avatar.svg",
                    firstName: r.User.firstName,
                    lastName: r.User.lastName,
                  }}
                  createdAt={r.createdAt}
                />
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default CommentCard;
