"use client";
import { getPreviewVideo, sendEmailForFirstView } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";
import { timeAgo } from "@/lib/timeAgo";
import { truncateString } from "@/lib/utils";
import { VideoProps } from "@/types/index.type";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Activities from "../../activities";
import AiTools from "../../ai-tools";
import TabMenu from "../../tabs";
import VideoTranscript from "../../video-transcript";
import CopyLink from "../copy-link";
import EditVideo from "../edit";
import RichLink from "../rich-link";

type Props = {
  videoId: string;
};

const VideoPreview = ({ videoId }: Props) => {
  const router = useRouter();

  const { data } = useQueryData(["preview-video"], () =>
    getPreviewVideo(videoId)
  );

  const notifyFirstView = async () => await sendEmailForFirstView(videoId);

  const { data: video, status, author } = data as VideoProps;
  if (status !== 200) router.push("/");

  const timeAgoText = timeAgo(video.createdAt);

  useEffect(() => {
    if (video.views === 0) {
      notifyFirstView();
    }
    return () => {
      notifyFirstView();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 lg:py-10 overflow-y-auto gap-5">
      <div className="flex flex-col lg:col-span-2 gap-y-10">
        <div>
          <div className="flex gap-x-5 items-start justify-between">
            <h2 className="text-white text-4xl font-bold">{video.title}</h2>
            {author ? (
              <EditVideo
                videoId={videoId}
                title={video.title as string}
                description={video.description as string}
              />
            ) : (
              <></>
            )}
          </div>
          <span className="flex gap-x-3 mt-2">
            <p className="text-[#9D9D9D] capitalize">
              {video.User?.firstName} {video.User?.lastName}
            </p>
            <p className="text-[#707070]">{timeAgoText} ago</p>
          </span>
        </div>
        <video
          preload="metadata"
          className="w-full aspect-video opacity-50 rounded-xl"
          controls
        >
          <source
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#1`}
          />
        </video>
        <div className="flex flex-col text-2xl gap-y-4">
          <h2 className="text-[#BDBDBD] text-semibold">Description</h2>
          <p className="text-[#9D9D9D] text-lg text-medium">
            {video.description}
          </p>
        </div>
      </div>
      <div className="lg:col-span-1 flex flex-col gap-y-16">
        <div className="flex justify-end gap-x-5 items-center">
          <CopyLink
            variant="outline"
            className="rounded-full bg-transparent px-10"
            videoId={videoId}
          />
          <RichLink
            description={truncateString(video.description as string, 150)}
            id={videoId}
            source={video.source}
            title={video.title as string}
          />
          <Download className="text-[#4d4c4c]" />
        </div>
        <div>
          <TabMenu
            defaultValue="Ai tools"
            triggers={["Ai tools", "Transcript", "Activity"]}
          >
            {/* TODO : Complete the AiTools component */}
            <AiTools
              videoId={videoId}
              trial={video.User.trial}
              plan={video.User.subscription?.plan || "FREE"}
            />
            <VideoTranscript transcript={video.summary} />
            <Activities videoId={videoId} />
          </TabMenu>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
