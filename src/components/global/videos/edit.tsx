import EditVideoForm from "@/components/forms/edit-video";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Modal from "../modal";
import { useModal } from "@/hooks/use-modal";

type Props = { title: string; description: string; videoId: string };

const EditVideo = ({ description, title, videoId }: Props) => {
  const { isOpen, closeModal, setModalOpen } = useModal();

  return (
    <Modal
      title="Edit video details"
      description="You can update your video details here!"
      isOpen={isOpen}
      setIsOpen={setModalOpen}
      trigger={
        <Button variant={"ghost"}>
          <Edit className="text-[#6c6c6c]" />
        </Button>
      }
    >
      <EditVideoForm
        videoId={videoId}
        title={title}
        description={description}
        onSuccess={closeModal}
      />
    </Modal>
  );
};

export default EditVideo;
