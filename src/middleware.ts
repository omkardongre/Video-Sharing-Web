import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

const isProtectedRoutes = createRouteMatcher([
  "/dashboard(.*)",
  "/payment(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Handle protected routes
  if (isProtectedRoutes(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
