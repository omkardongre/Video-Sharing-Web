import { getNotifications, onAuthenticateUser } from "@/actions/user";
import { getWorkSpaces, verifyAccessToWorkspace } from "@/actions/workspace";
import GlobalHeader from "@/components/global/global-header";
import InfoBar from "@/components/global/info-bar";
import Sidebar from "@/components/global/sidebar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
};

export default async function Layout({ children, params }: LayoutProps) {
  const { workspaceId } = await params;
  const auth = await onAuthenticateUser();

  if (!auth.user?.workspace) redirect("/auth/sign-in");
  if (!auth.user.workspace.length) redirect("/auth/sign-in");

  const hasAccess = await verifyAccessToWorkspace(workspaceId);

  if (hasAccess.status !== 200) {
    redirect(`/dashboard/${auth.user?.workspace[0].id}`);
  }

  if (!hasAccess.data?.workspace) return null;

  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["user-workspaces"],
    queryFn: () => getWorkSpaces(),
  });

  await query.prefetchQuery({
    queryKey: ["user-notifications"],
    queryFn: () => getNotifications(),
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <Sidebar activeWorkspaceId={workspaceId} />
        <div className="flex-1 flex flex-col">
          <InfoBar
            userId={auth.user?.id}
            plan={auth.user?.subscription?.plan || "FREE"}
          />
          <div className="flex-1 pt-8 p-6 overflow-y-auto">
            <GlobalHeader workspace={hasAccess.data.workspace} />
            <div className="mt-4">{children}</div>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
