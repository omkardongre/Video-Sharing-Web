"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET as string);

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      console.log("🔴 No user found");
      return { status: 403 };
    }

    const userExist = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      include: {
        workspace: true,
      },
    });

    if (userExist) {
      return { status: 200, user: userExist };
    }

    const newUser = await client.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        image: user.imageUrl || "",
        studio: {
          create: {},
        },
        subscription: {
          create: {},
        },
        workspace: {
          create: {
            name: `${user.firstName || "User"}'s Workspace`,
            type: "PERSONAL",
          },
        },
      },
      include: {
        workspace: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (newUser) {
      return { status: 201, user: newUser };
    }

    return { status: 400 };
  } catch (error) {
    console.error(
      "[Authentication Error]:",
      error instanceof Error ? error.message : error
    );
    return { status: 500 };
  }
};

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    to,
    subject,
    text,
    html,
  };
  return { transporter, mailOptions };
};

export const getNotifications = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const notifications = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        // TODO: check if notification also needed
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    });

    if (notifications && notifications.notification.length > 0)
      return { status: 200, data: notifications };
    return { status: 404, data: [] };
  } catch {
    return { status: 400, data: [] };
  }
};

export const searchUsers = async (query: string, workspaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404, data: [] };

    const users = await client.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query } },
          { email: { contains: query } },
          { lastName: { contains: query } },
        ],
        NOT: [
          { clerkId: user.id },
          {
            receiver: {
              some: {
                workSpaceId: workspaceId,
                status: "WAITING",
              },
            },
          },
          {
            members: {
              some: {
                workSpaceId: workspaceId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        firstName: true,
        lastName: true,
        image: true,
        email: true,
      },
    });

    if (users && users.length > 0) {
      return { status: 200, data: users };
    }

    return { status: 404, data: [] };
  } catch {
    return { status: 500, data: [] };
  }
};

export const inviteMembers = async (
  workspaceId: string,
  receiverId: string,
  receiverEmail: string
) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const senderInfo = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
    if (senderInfo?.id) {
      const workspace = await client.workSpace.findUnique({
        where: {
          id: workspaceId,
        },
        select: {
          name: true,
        },
      });
      if (workspace) {
        const invitation = await client.invite.create({
          data: {
            senderId: senderInfo.id,
            receiverId,
            workSpaceId: workspaceId,
            content: `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
          },
          select: {
            id: true,
          },
        });

        await client.user.update({
          where: {
            clerkId: user.id,
          },
          data: {
            notification: {
              create: {
                content: `${user.firstName} ${user.lastName} invited ${senderInfo.firstName} into ${workspace.name}`,
              },
            },
          },
        });
        if (invitation) {
          const { transporter, mailOptions } = await sendEmail(
            receiverEmail,
            `Join ${workspace.name} Workspace - Invitation`,
            `${user.firstName} has invited you to join ${workspace.name} Workspace`,
            `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; margin-bottom: 20px;">Workspace Invitation</h2>
              <p style="color: #666; margin-bottom: 20px;">
                ${user.firstName} has invited you to join <strong>${workspace.name}</strong> Workspace.
              </p>
              <div style="margin: 30px 0;">
                <a 
                  href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}"
                  style="
                    background-color: #0070f3;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 6px;
                    text-decoration: none;
                    display: inline-block;
                    font-weight: 500;
                  "
                >
                  Accept Invitation
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">
                If you're unable to click the button, copy and paste this URL into your browser:
                <br>
                ${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}
              </p>
            </div>
          `
          );
          transporter.sendMail(mailOptions, (error) => {
            if (error) {
              console.log("🔴", error.message);
            } else {
              console.log("✅ Email send");
            }
          });
          return { status: 200, data: "Invite sent" };
        }
        return { status: 400, data: "invitation failed" };
      }
      return { status: 404, data: "workspace not found" };
    }
    return { status: 404, data: "recipient not found" };
  } catch {
    return { status: 400, data: "Oops! something went wrong" };
  }
};

export const getPaymentInfo = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    const payment = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: { plan: true },
        },
      },
    });
    if (payment) {
      return { status: 200, data: payment };
    }
  } catch {
    return { status: 400 };
  }
};
export const completeSubscription = async (session_id: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session) {
      const customer = await client.user.update({
        where: {
          clerkId: user.id,
        },
        data: {
          subscription: {
            update: {
              data: {
                customerId: session.customer as string,
                plan: "PRO",
              },
            },
          },
        },
      });
      if (customer) {
        return { status: 200 };
      }
    }
    return { status: 404 };
  } catch {
    return { status: 400 };
  }
};

export const enableFirstView = async (state: boolean) => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404, data: "User not found" };

    const view = await client.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        firstView: state,
      },
    });

    if (view) {
      return { status: 200, data: "Setting updated" };
    }
  } catch {
    return { status: 400, data: "Failed to update" };
  }
};

export const getFirstView = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404, data: false };
    const userData = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        firstView: true,
      },
    });
    if (userData) {
      return { status: 200, data: userData.firstView };
    }
    return { status: 400, data: false };
  } catch {
    return { status: 400, data: false };
  }
};
export const acceptInvite = async (inviteId: string) => {
  try {
    const user = await currentUser();
    if (!user)
      return {
        status: 404,
      };
    const invitation = await client.invite.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        workSpaceId: true,
        receiver: {
          select: {
            clerkId: true,
          },
        },
        status: true,
      },
    });

    if (!invitation) {
      return { status: 404 };
    }

    if (user.id !== invitation.receiver?.clerkId) return { status: 401 };

    if (invitation.status === "ACCEPTED") {
      return { status: 409, message: "Invitation already accepted" };
    }

    const acceptInvite = client.invite.update({
      where: {
        id: inviteId,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    const updateMember = client.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        members: {
          create: {
            workSpaceId: invitation.workSpaceId,
          },
        },
      },
    });

    const membersTransaction = await client.$transaction([
      acceptInvite,
      updateMember,
    ]);

    if (membersTransaction) {
      return { status: 200 };
    }
    return { status: 400 };
  } catch {
    return { status: 400 };
  }
};

export const getUserProfile = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404, data: null };
    const profileIdAndImage = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        image: true,
        id: true,
      },
    });

    if (profileIdAndImage) return { status: 200, data: profileIdAndImage };
  } catch {
    return { status: 400, data: null };
  }
};

export const getVideoComments = async (videoId: string) => {
  try {
    const comments = await client.comment.findMany({
      where: {
        videoId: videoId,
        parentComment: null,
      },
      include: {
        replies: {
          include: {
            User: true,
          },
        },
        User: true,
      },
    });

    return { status: 200, data: comments };
  } catch {
    return { status: 400, data: [] };
  }
};

export const createCommentAndReply = async (
  userId: string,
  content: string,
  videoId: string,
  commentId?: string | undefined
) => {
  try {
    if (commentId) {
      const reply = await client.comment.update({
        where: {
          id: commentId,
        },
        data: {
          replies: {
            create: {
              content,
              userId,
              videoId,
            },
          },
        },
      });
      if (reply) {
        return { status: 200, data: "Reply posted" };
      }
    }

    const newComment = await client.comment.create({
      data: {
        content,
        userId,
        videoId,
      },
    });
    if (newComment) return { status: 200, data: "New comment added" };
  } catch {
    return { status: 400 };
  }
};
