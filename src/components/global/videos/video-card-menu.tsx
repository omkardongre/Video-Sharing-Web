import ChangeVideoLocation from "@/components/forms/change-video-location";
import { Move } from "lucide-react";
import Modal from "../modal";

type Props = {
  videoId: string;
  currentWorkspace?: string;
  currentFolderId?: string;
  currentFolderName?: string;
};

const CardMenu = ({
  videoId,
  currentFolderId,
  currentFolderName,
  currentWorkspace,
}: Props) => {
  return (
    <Modal
      className="flex items-center cursor-pointer gap-x-2"
      title="Move to new Workspace/Folder"
      description="This action cannot be undone. This will permanently delete your
  account and remove your data from our servers."
      trigger={<Move size={20} fill="#4f4f4f" className="text-[#4f4f4f]" />}
    >
      <ChangeVideoLocation
        currentFolderId={currentFolderId}
        currentWorkSpace={currentWorkspace}
        videoId={videoId}
        currentFolderName={currentFolderName}
      />
    </Modal>
  );
};

export default CardMenu;
