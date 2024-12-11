"use client";
import { getWorkSpaces } from "@/actions/workspace";

import WorkspaceForm from "@/components/forms/workspace-form";
import FolderPlusDuotine from "@/components/icons/folder-plus-duotone";
import { Button } from "@/components/ui/button";
import { useQueryData } from "@/hooks/useQueryData";

import {
  UserWorkspaceDetails,
  UserWorkspaceResponse,
} from "@/types/index.type";
import { useState } from "react";
import Modal from "../modal";

const CreateWorkspace = () => {
  const [open, setOpen] = useState(false);
  const { data: userWorkspaceResponse } = useQueryData(
    ["user-workspaces"],
    getWorkSpaces
  ) as { data: UserWorkspaceResponse };

  const userWorkspaceDetails: UserWorkspaceDetails = userWorkspaceResponse.data;

  if (userWorkspaceDetails.subscription?.plan === "FREE") {
    return <></>;
  }

  if (userWorkspaceDetails.subscription?.plan === "PRO")
    return (
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Create a Workspace"
        description=" Workspaces helps you collaborate with team members. You are assigned a default personal workspace where you can share videos in private with yourself."
        trigger={
          <Button className="bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl">
            <FolderPlusDuotine />
            Create Workspace
          </Button>
        }
      >
        <WorkspaceForm onSuccess={() => setOpen(false)} />
      </Modal>
    );
};

export default CreateWorkspace;
