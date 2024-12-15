"use server";

import { client } from "@/lib/prisma";
import { WorkspaceFoldersResponse } from "@/types/index.type";
import { currentUser } from "@clerk/nextjs/server";

export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 403 };

    const isUserInWorkspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            User: {
              clerkId: user.id,
            },
          },
          {
            members: {
              // TODO : Use of this every is doubtful, remove if needed
              every: {
                User: {
                  clerkId: user.id,
                },
              },
            },
          },
        ],
      },
    });
    return {
      status: 200,
      data: { workspace: isUserInWorkspace },
    };
  } catch {
    return {
      status: 403,
      data: { workspace: null },
    };
  }
};

export const getWorkSpaces = async () => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404 };

    const workspaces = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            WorkSpace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (workspaces) {
      return { status: 200, data: workspaces };
    }
  } catch {
    return { status: 400 };
  }
};

export const getAllUserVideos = async (workSpaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const videos = await client.video.findMany({
      where: {
        // TODO: Check if this condition folderId: workSpaceId is needed
        OR: [{ workSpaceId }, { folderId: workSpaceId }],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
        User: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (videos && videos.length > 0) {
      return { status: 200, data: videos };
    }

    return { status: 404 };
  } catch {
    return { status: 400 };
  }
};

export const getWorkspaceFolders = async (
  workSpaceId: string
): Promise<WorkspaceFoldersResponse> => {
  try {
    const isFolders = await client.folder.findMany({
      where: {
        workSpaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });
    if (isFolders && isFolders.length > 0) {
      return { status: 200, data: isFolders };
    }
    return { status: 404, data: [] };
  } catch {
    return { status: 403, data: [] };
  }
};

export const checkWorkspaceExists = async (
  name: string
): Promise<{ status: number; message: string }> => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404, message: "User not found" };

    const existingWorkspace = await client.workSpace.findFirst({
      where: {
        name,
        User: {
          clerkId: user.id,
        },
      },
    });

    if (existingWorkspace) {
      return {
        status: 400,
        message: "Workspace with this name already exists",
      };
    } else {
      return {
        status: 200,
        message: "Workspace name is available",
      };
    }
  } catch {
    return { status: 500, message: "Oops something went wrong" };
  }
};

export const createWorkspace = async (
  name: string
): Promise<{ status: number; message: string }> => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404, message: "User not found" };

    const authorized = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (authorized?.subscription?.plan === "PRO") {
      const checkResult = await checkWorkspaceExists(name);
      if (checkResult.status === 400) {
        return checkResult;
      }

      const workspace = await client.user.update({
        where: {
          clerkId: user.id,
        },
        data: {
          workspace: {
            create: {
              name,
              type: "PUBLIC",
            },
          },
        },
      });

      if (workspace) {
        return { status: 201, message: "Workspace Created" };
      } else {
        return { status: 400, message: "Workspace creation failed" };
      }
    }

    return {
      status: 401,
      message: "You are not authorized to create a workspace.",
    };
  } catch {
    return { status: 500, message: "Oops something went wrong" };
  }
};

export const moveVideoLocation = async (
  videoId: string,
  workSpaceId: string,
  folderId: string
) => {
  try {
    const location = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        folderId: folderId || null,
        workSpaceId,
      },
    });
    if (location) return { status: 200, data: "folder changed successfully" };
    return { status: 404, data: "workspace/folder not found" };
  } catch {
    return { status: 500, data: "Oops! something went wrong" };
  }
};

export const checkFolderExists = async (
  workspaceId: string,
  name: string
): Promise<{ status: number; message: string }> => {
  try {
    const workspace = await client.workSpace.findFirst({
      where: {
        id: workspaceId,
        folders: {
          some: {
            name: name,
          },
        },
      },
    });

    if (workspace) {
      return {
        status: 400,
        message: "Folder with this name already exists",
      };
    } else {
      return {
        status: 200,
        message: "Folder name is available",
      };
    }
  } catch {
    return { status: 500, message: "Oops something went wrong" };
  }
};

export const createFolder = async (
  workspaceId: string,
  name: string
): Promise<{ status: number; message: string }> => {
  try {
    const isNewFolder = await client.workSpace.update({
      where: {
        id: workspaceId,
      },
      data: {
        folders: {
          create: { name: name },
        },
      },
    });

    if (isNewFolder) {
      return { status: 200, message: "New Folder Created" };
    } else {
      return { status: 400, message: "Folder creation failed" };
    }
  } catch {
    return { status: 500, message: "Oops something went wrong" };
  }
};

export const renameFolders = async (folderId: string, name: string) => {
  try {
    const folder = await client.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
      },
    });
    if (folder) {
      return { status: 200, data: "Folder Renamed" };
    }
    return { status: 400, data: "Folder does not exist" };
  } catch {
    return { status: 500, data: "Opps! something went wrong" };
  }
};
