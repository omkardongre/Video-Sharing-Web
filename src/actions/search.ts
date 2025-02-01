"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const searchContent = async (query: string) => {
  if (!query?.trim()) {
    return { status: 200, data: null };
  }

  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403, data: null };
    }

    const videos = await client.video.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
        User: {
          clerkId: user.id,
        },
      },
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      take: 5,
    });

    const folders = await client.folder.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
        WorkSpace: {
          User: {
            clerkId: user.id,
          },
        },
      },
      take: 5,
    });

    const workspaces = await client.workSpace.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
        User: {
          clerkId: user.id,
        },
      },
      take: 5,
    });

    return {
      status: 200,
      data: {
        videos,
        folders,
        workspaces,
      },
    };
  } catch (error) {
    console.error("[SEARCH_ERROR]", error);
    return { status: 500, data: null };
  }
};
