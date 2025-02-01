"use client";
import CreateFolderForm from "@/components/forms/create-folder";
import FolderPlusDuotine from "@/components/icons/folder-plus-duotone";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Modal from "../modal";

type Props = { workspaceId: string };

const CreateFolders = ({ workspaceId }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Create a Folder"
      description=""
      trigger={
        <Button className="bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl">
          <FolderPlusDuotine />
          Create Folder
        </Button>
      }
    >
      <CreateFolderForm
        workspaceId={workspaceId}
        onSuccess={() => setOpen(false)}
      />
    </Modal>
  );
};

export default CreateFolders;
