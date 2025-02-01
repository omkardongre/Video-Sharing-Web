import { client } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Props) {
  console.log("Endpoint hit ✅");

  try {
    const { id } = await params;
    const userProfile = await client.user.findUnique({
      where: {
        clerkId: id,
      },
      include: {
        studio: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    if (userProfile)
      return NextResponse.json({ status: 200, user: userProfile });

    const clerkUserInstance = await (await clerkClient()).users.getUser(id);

    const createUser = await client.user.create({
      data: {
        clerkId: id,
        email: clerkUserInstance.emailAddresses[0].emailAddress,
        firstName: clerkUserInstance.firstName || "",
        lastName: clerkUserInstance.lastName || "",
        studio: {
          create: {},
        },
        workspace: {
          create: {
            name: `${clerkUserInstance.firstName}'s Workspace`,
            type: "PERSONAL",
          },
        },
        subscription: {
          create: {},
        },
      },
      include: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (createUser) return NextResponse.json({ status: 201, user: createUser });

    return NextResponse.json({ status: 400 });
  } catch (error) {
    console.log("ERROR", error);
  }
}
