"use server";

import { currentUser } from "@clerk/nextjs/server";

type AuthResponse = 
  | { status: 200; user: any }
  | { status: 403 }
  | { status: 500 };

export const onAuthenticateUser = async (): Promise<AuthResponse> => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }

    return { status: 200, user };
  } catch (error) {
    console.error("[Authentication Error]:", error instanceof Error ? error.message : error);
    return { status: 500 };
  }
};
