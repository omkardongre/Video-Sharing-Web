import AiToolsFree from "./AiToolsFree";
import AiToolsPro from "./AiToolsPro";

type Props = {
  plan: "PRO" | "FREE";
  trial: boolean;
  videoId: string;
};

const AiTools = ({ plan, trial, videoId }: Props) => {
  return plan === "PRO" ? (
    <AiToolsPro videoId={videoId} />
  ) : (
    <AiToolsFree trial={trial} videoId={videoId} />
  );
};

export default AiTools;
