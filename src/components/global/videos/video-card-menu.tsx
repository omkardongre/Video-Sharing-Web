import ChangeVideoLocation from "@/components/forms/change-video-location";
import { useModal } from "@/hooks/use-modal";
import { Move } from "lucide-react";
import Modal from "../modal";

type Props = {
  videoId: string;
  currentWorkspaceId?: string;
  currentFolderId?: string;
  currentFolderName?: string;
};

const CardMenu = ({
  videoId,
  currentFolderId,
  currentFolderName,
  currentWorkspaceId,
}: Props) => {
  const { isOpen, onClose, onToggle } = useModal();

  return (
    <Modal
      open={isOpen}
      onOpenChange={onToggle}
      className="flex items-center cursor-pointer gap-x-2"
      title="Move to new Workspace/Folder"
      description="Select a new workspace or folder to move this video. The video will be immediately available in the new location."
      trigger={<Move size={20} fill="#4f4f4f" className="text-[#4f4f4f]" />}
    >
      <ChangeVideoLocation
        currentFolderId={currentFolderId}
        currentWorkspaceId={currentWorkspaceId}
        videoId={videoId}
        currentFolderName={currentFolderName}
        onSuccess={onClose}
      />
    </Modal>
  );
};

export default CardMenu;
