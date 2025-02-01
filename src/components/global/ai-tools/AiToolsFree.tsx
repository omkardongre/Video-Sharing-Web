import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import Loader from "../loader";
import Chatbot from "./Chatbot";

type Props = {
  trial: boolean;
  videoId: string;
};

const AiToolsFree = ({ trial, videoId }: Props) => {
  return (
    <TabsContent value="Ai tools">
      {trial ? (
        <div className="p-5 bg-[#1D1D1D] rounded-xl flex flex-col gap-y-6">
          <div className="flex items-center gap-4">
            <div className="w-full">
              <h2 className="text-3xl font-bold">Ai Tools</h2>
              <p className="text-[#BDBDBD]">
                Taking your video to the next step with the power of AI!
              </p>
            </div>
            <div className="flex gap-4 w-full justify-end">
              <Button className="mt-2 text-sm">
                <Loader state={false} color="#000">
                  Try now
                </Loader>
              </Button>
              <Button className="mt-2 text-sm" variant={"secondary"}>
                <Loader state={false} color="#000">
                  Pay Now
                </Loader>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Chatbot videoId={videoId} />
      )}
    </TabsContent>
  );
};

export default AiToolsFree;
