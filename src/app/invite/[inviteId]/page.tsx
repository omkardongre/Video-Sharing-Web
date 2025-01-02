import { acceptInvite } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ inviteId: string }>;
};

const Page = async ({ params }: Props) => {
  const { inviteId } = await params;

  const invite = await acceptInvite(inviteId);

  if (invite.status === 404) {
    redirect("/auth/sign-in");
  }

  if (invite?.status === 401) {
    return (
      <div className="h-screen container flex items-center justify-center">
        <Card className="w-[350px] bg-white text-black">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Not Authorized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              You are not authorized to accept this invite.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (invite.status === 200 || invite.status === 409) {
    return (
      <div className="h-screen container flex items-center justify-center">
        <Card className="w-[350px] bg-white text-black">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Invitation Accepted!
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-center">
              You are now a member of the workspace.
            </p>
            <Button disabled className="bg-gray-500 text-white">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting...
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen container flex items-center justify-center">
      <Card className="w-[350px] bg-white text-black">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">
            An unexpected error occurred. Please try again later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
