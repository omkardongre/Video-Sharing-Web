import { TabsContent } from "@/components/ui/tabs";
import Chatbot from "./Chatbot";

type Props = {
  videoId: string;
};

const AiToolsPro = ({ videoId }: Props) => {
  return (
    <TabsContent value="Ai tools">
      <Chatbot videoId={videoId} />
    </TabsContent>
  );
};

export default AiToolsPro;
