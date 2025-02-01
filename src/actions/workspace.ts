"use server";

import { client } from "@/lib/prisma";
import {
  WorkspaceFoldersResponse,
  WorkspaceVideosResponse,
} from "@/types/index.type";
import { currentUser } from "@clerk/nextjs/server";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { items } from "@wix/data";

import axios from "axios";
import { sendEmail } from "./user";

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

export const getAllUserVideos = async (
  workSpaceId: string
): Promise<WorkspaceVideosResponse> => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404, data: [] };
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

    return { status: 404, data: [] };
  } catch {
    return { status: 400, data: [] };
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
  workSpaceId: string,
  name: string
): Promise<{ status: number; message: string }> => {
  try {
    const existingFolder = await client.folder.findFirst({
      where: {
        workSpaceId,
        name,
      },
    });

    if (existingFolder) {
      return {
        status: 400,
        message: `Folder "${name}" already exists`,
      };
    }

    return {
      status: 200,
      message: "Folder name is available",
    };
  } catch {
    return {
      status: 500,
      message: "Failed to check folder existence",
    };
  }
};

export const createFolder = async (
  workSpaceId: string,
  name: string
): Promise<{ status: number; message: string }> => {
  try {
    // First check if folder exists
    const existCheck = await checkFolderExists(workSpaceId, name);
    if (existCheck.status !== 200) {
      return existCheck;
    }

    // Create new folder
    const newFolder = await client.folder.create({
      data: {
        name,
        workSpaceId,
      },
    });

    if (!newFolder) {
      return {
        status: 400,
        message: "Failed to create folder",
      };
    }

    return {
      status: 200,
      message: `Folder "${name}" created successfully`,
    };
  } catch {
    return {
      status: 500,
      message: "Failed to create folder",
    };
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

export const getWixContent = async () => {
  try {
    const myWixClient = createClient({
      modules: { items },
      auth: OAuthStrategy({
        clientId: process.env.WIX_OAUTH_KEY as string,
      }),
    });

    const results = await myWixClient.items.query("video-sharing").find();

    if (results.items.length === 0) {
      return { status: 404 };
    }

    const videoIds: string[] = results.items.map((v) => v.id);

    const videos = await client.video.findMany({
      where: {
        id: {
          in: videoIds,
        },
      },
      select: {
        id: true,
        createdAt: true,
        title: true,
        source: true,
        processing: true,
        workSpaceId: true,
        User: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
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

export const howToPost = async () => {
  try {
    const response = await axios.get(process.env.CLOUD_WAYS_POST as string);
    if (response.data) {
      return {
        title: response.data[0].title.rendered,
        content: response.data[0].content.rendered,
      };
    }
  } catch {
    return { status: 400 };
  }
};

export const getPreviewVideo = async (videoId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404, data: null, author: false };
    const video = await client.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        createdAt: true,
        source: true,
        description: true,
        processing: true,
        views: true,
        summary: true,
        User: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
            clerkId: true,
            trial: true,
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    });
    if (video) {
      return {
        status: 200,
        data: video,
        author: user.id === video.User?.clerkId ? true : false,
      };
    }

    return { status: 404, data: null, author: false };
  } catch {
    return { status: 400, data: null, author: false };
  }
};

export const sendEmailForFirstView = async (videoId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const userFirstViewSetting = await client.user.findUnique({
      where: { clerkId: user.id },
      select: {
        firstView: true,
      },
    });

    if (!userFirstViewSetting) {
      return { status: 404, data: "User not found" };
    }

    if (!userFirstViewSetting.firstView)
      return { status: 200, data: "First view notification disabled" };

    const video = await client.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        views: true,
        User: {
          select: {
            email: true,
          },
        },
      },
    });

    if (video && video.views === 0) {
      await client.video.update({
        where: {
          id: videoId,
        },
        data: {
          views: video.views + 1,
        },
      });

      const { transporter, mailOptions } = await sendEmail(
        video.User.email,
        "You got a viewer",
        `Your video ${video.title} just got its first viewer`
      );

      transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          console.log(error.message);
        } else {
          const notification = await client.user.update({
            where: { clerkId: user.id },
            data: {
              notification: {
                create: {
                  content: mailOptions.text,
                },
              },
            },
          });
          if (notification) {
            return { status: 200, data: "Email sent successfully" };
          }
        }
      });
    }
  } catch {
    return { status: 400, data: "Oops! something went wrong" };
  }
};

export const editVideoInfo = async (
  videoId: string,
  title: string,
  description: string
) => {
  try {
    const video = await client.video.update({
      where: { id: videoId },
      data: {
        title,
        description,
      },
    });
    if (video) return { status: 200, data: "Video successfully updated" };
    return { status: 404, data: "Video not found" };
  } catch {
    return { status: 400, data: "Oops! something went wrong" };
  }
};

export const getFolderInfo = async (folderId: string) => {
  try {
    const folder = await client.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        name: true,
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });
    if (folder)
      return {
        status: 200,
        data: folder,
      };
    return {
      status: 400,
      data: null,
    };
  } catch {
    return {
      status: 500,
      data: null,
    };
  }
};
