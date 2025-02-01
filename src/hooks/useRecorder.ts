import { useRef, useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import Deque from "double-ended-queue";
import { toast } from "sonner";
import { VideoChunk } from "@/components/global/record-video/types";

interface UseRecorderProps {
  userId: string;
  mediaStreamRef: React.RefObject<MediaStream | undefined>;
  socketRef: React.MutableRefObject<Socket | null>;
  filenameRef: React.MutableRefObject<string>;
  chunkBuffer: React.RefObject<Deque<VideoChunk>>;
  isPermanentlyDisconnected: React.RefObject<boolean>;
  initializeCamera: () => Promise<void>;
  isCameraOn: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  processChunkQueue: () => void;
  initializeSocket: () => Promise<boolean>;
}

export const useRecorder = ({
  userId,
  mediaStreamRef,
  socketRef,
  filenameRef,
  chunkBuffer,
  isPermanentlyDisconnected,
  initializeCamera,
  isCameraOn,
  startTimer,
  stopTimer,
  processChunkQueue,
  initializeSocket,
}: UseRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const socketConnected = await initializeSocket();

      if (!socketConnected) {
        toast.error("Connection Error", {
          description:
            "Could not establish server connection. Please try again.",
        });
        return;
      }

      if (!isCameraOn) {
        await initializeCamera();
      }

      const stream = mediaStreamRef.current;
      if (!stream) {
        toast.error("Recording Error", {
          description: "Please enable camera before recording",
        });
        return;
      }

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      const filename = `${userId}-${Date.now()}.webm`;
      filenameRef.current = filename;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0 && filenameRef.current && chunkBuffer.current) {
          if (!isPermanentlyDisconnected.current) {
            chunkBuffer.current.push({
              data: event.data,
              filename: filenameRef.current,
            });
            processChunkQueue();
          }
        }
      };

      recorder.onstop = () => {
        setTimeout(() => {
          if (socketRef.current?.connected) {
            socketRef.current.emit("process-video", {
              filename: filenameRef.current,
              userId,
            });
            socketRef.current?.disconnect();
            socketRef.current = null;
          }
        }, 5000);
      };

      recorder.start(1000);
      setIsRecording(true);
      startTimer();
    } catch (err) {
      toast("Recording Error", { description: "Error starting recording" });
      console.error("Recording error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();

      toast.success("Recording completed", {
        description:
          "Your video is being processed. This will take a few moments.",
      });
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
};
