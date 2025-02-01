"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RecordVideoProps } from "./types";
import { useMediaStream } from "@/hooks/useMediaStream";

import { useRecordingTimer } from "@/hooks/useRecordingTimer";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { useRecorder } from "@/hooks/useRecorder";

export const RecordVideo = ({ userId, onStreamReady }: RecordVideoProps) => {
  const {
    isCameraOn,
    isMicOn,
    mediaStreamRef,
    initializeCamera,
    toggleCamera,
    toggleMic,
  } = useMediaStream(onStreamReady);

  const { timer, timerInterval, startTimer, stopTimer } = useRecordingTimer();

  const {
    socketRef,
    chunkBuffer,
    isPermanentlyDisconnected,
    filenameRef,
    processChunkQueue,
    initializeSocket,
  } = useSocketConnection();

  const { isRecording, startRecording, stopRecording } = useRecorder({
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
  });

  useEffect(() => {
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-5 flex-wrap">
        <Button
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? stopRecording : startRecording}
          className="flex-shrink-0"
          disabled={!isCameraOn}
        >
          {isRecording ? "Stop" : "Start"} Recording
        </Button>

        <Button
          onClick={toggleCamera}
          variant="outline"
          disabled={isRecording}
          className="flex-shrink-0"
        >
          {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </Button>

        <Button
          onClick={toggleMic}
          variant="outline"
          className="flex-shrink-0"
          disabled={!isCameraOn}
        >
          {isMicOn ? "Mute Mic" : "Unmute Mic"}
        </Button>

        {(isRecording || timer > 0) && (
          <span className="text-sm text-gray-500 ml-2">
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </span>
        )}
      </div>
    </div>
  );
};
