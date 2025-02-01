import { useState, useRef } from "react";
import { toast } from "sonner";

export const useMediaStream = (
  onStreamReady?: (stream: MediaStream | null) => void
) => {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const mediaStreamRef = useRef<MediaStream>();

  const initializeCamera = async () => {
    try {
      if (!cameraStream) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setCameraStream(stream);
        mediaStreamRef.current = stream;
        if (onStreamReady) onStreamReady(stream);
      }

      if (cameraStream) {
        cameraStream.getVideoTracks().forEach((track) => {
          track.enabled = true;
        });
      }

      setIsCameraOn(true);
    } catch (err) {
      toast("Camera Error", { description: "Failed to initialize camera" });
      console.error(err);
    }
  };

  const toggleCamera = () => {
    if (!isCameraOn) {
      initializeCamera();
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
        mediaStreamRef.current = undefined;
        if (onStreamReady) onStreamReady(null);
      }
      setIsCameraOn(false);
    }
  };

  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  return {
    cameraStream,
    isCameraOn,
    isMicOn,
    mediaStreamRef,
    initializeCamera,
    toggleCamera,
    toggleMic,
  };
};
