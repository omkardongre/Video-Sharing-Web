"use client";

import VideoRecorderIcon from "@/components/icons/video-recorder";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { UploadIcon } from "lucide-react";
import Modal from "../modal";
import { FileUploadContent } from "../file-upload";
import { useModal } from "@/hooks/use-modal";
import { useState } from "react";
import { RecordingPanel } from "../recording-panel";
import { SearchBar } from "../search-bar";

const InfoBar = ({
  userId,
  plan,
}: {
  userId: string;
  plan: "FREE" | "PRO";
}) => {
  const { isOpen, closeModal, setModalOpen } = useModal();
  const [isRecordOpen, setIsRecordOpen] = useState(false);

  return (
    <>
      <header className="sticky p-4 flex items-center justify-between gap-4 w-full bg-background">
        <SearchBar />

        <div className="flex items-center gap-4 flex-shrink-0">
          <Modal
            trigger={
              <Button className="bg-primary text-primary-foreground flex items-center gap-2">
                <UploadIcon size={20} />
                <span>Upload</span>
              </Button>
            }
            title=""
            description=""
            isOpen={isOpen}
            setIsOpen={setModalOpen}
          >
            <FileUploadContent
              onClose={closeModal}
              userId={userId}
              plan={plan}
            />
          </Modal>

          <Button
            className="bg-primary text-primary-foreground flex items-center gap-2"
            onClick={() => setIsRecordOpen(!isRecordOpen)}
          >
            <VideoRecorderIcon />
            <span>Record</span>
          </Button>

          <UserButton />
        </div>
      </header>

      <RecordingPanel
        isOpen={isRecordOpen}
        onClose={() => setIsRecordOpen(false)}
        userId={userId}
      />
    </>
  );
};

export default InfoBar;
