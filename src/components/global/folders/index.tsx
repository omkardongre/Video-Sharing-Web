"use client";

import Videos from "../videos";
import FolderList from "./folder-list";

type Props = {
  workspaceId: string;
};

const VideoLibrary = ({ workspaceId }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <FolderList workspaceId={workspaceId} />
      <Videos
        workspaceId={workspaceId}
        folderId={workspaceId}
        videosKey="user-videos"
      />
    </div>
  );
};

export default VideoLibrary;
