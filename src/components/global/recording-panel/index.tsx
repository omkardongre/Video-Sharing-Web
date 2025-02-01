import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { RecordVideo } from "../record-video";
import { DraggableCameraView } from "../draggable-camera-view";
import { useState } from "react";

interface RecordingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const RecordingPanel = ({
  isOpen,
  onClose,
  userId,
}: RecordingPanelProps) => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  const handleStreamReady = (stream: MediaStream | null) => {
    setVideoStream(stream);
  };

  return (
    <>
      <DraggableCameraView
        videoStream={videoStream}
        isVisible={isOpen && videoStream !== null}
      />

      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] bg-background border rounded-t-lg shadow-lg transition-transform duration-300 z-50 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-4 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="h-[50px] overflow-y-auto">
            <RecordVideo userId={userId} onStreamReady={handleStreamReady} />
          </div>
        </div>
      </div>
    </>
  );
};
