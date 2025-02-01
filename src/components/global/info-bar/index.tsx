"use client";

import VideoRecorderIcon from "@/components/icons/video-recorder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import { Search, UploadIcon } from "lucide-react";
import Modal from "../modal";
import { FileUploadContent } from "../file-upload";
import { useModal } from "@/hooks/use-modal";
import { useState } from "react";
import { RecordingPanel } from "../recording-panel";

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
      <header className="sticky p-4 flex items-center justify-between gap-4 w-full">
        <div className="flex gap-4 justify-center items-center border-2 rounded-full px-4 w-full max-w-lg">
          <Search size={25} className="text-[#707070]" />
          <Input
            className="bg-transparent border-none !placeholder-neutral-500"
            placeholder="Search for people, projects, tags & folders"
          />
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <Modal
            trigger={
              <Button className="bg-[#9D9D9D] flex items-center gap-2">
                <UploadIcon size={20} />
                <span className="flex items-center gap-2">Upload</span>
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
            className="bg-[#9D9D9D] flex items-center gap-2"
            onClick={() => setIsRecordOpen(!isRecordOpen)}
          >
            <VideoRecorderIcon />
            <span className="flex items-center gap-2">Record</span>
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
