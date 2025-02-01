import { useRef } from "react";
import { io, Socket } from "socket.io-client";
import Deque from "double-ended-queue";
import { VideoChunk } from "@/components/global/record-video/types";

export const useSocketConnection = () => {
  const socketRef = useRef<Socket | null>(null);
  const chunkBuffer = useRef(new Deque<VideoChunk>());
  const isProcessingQueue = useRef(false);
  const isPermanentlyDisconnected = useRef(false);
  const filenameRef = useRef<string>("");

  const processChunkQueue = async () => {
    if (
      isProcessingQueue.current ||
      chunkBuffer.current.isEmpty() ||
      !socketRef.current?.connected
    )
      return;

    isProcessingQueue.current = true;
    const firstChunk = chunkBuffer.current.peekFront()!;

    try {
      await new Promise<void>((resolve, reject) => {
        socketRef.current!.timeout(5000).emit(
          "video-chunks",
          {
            chunks: firstChunk.data,
            filename: firstChunk.filename,
          },
          (err: Error | null, ack: boolean) => {
            if (err || !ack) {
              reject(err || new Error("No acknowledgment received"));
            } else {
              chunkBuffer.current.shift();
              resolve();
            }
          }
        );
      });
    } catch (error) {
      console.error("Failed to send chunk:", error);
    }

    isProcessingQueue.current = false;
    if (!chunkBuffer.current.isEmpty()) {
      setTimeout(processChunkQueue, 0);
    }
  };

  const initializeSocket = async (): Promise<boolean> => {
    if (socketRef.current?.connected) {
      return true;
    }

    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_RECORDER_HOST!, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ["websocket", "polling"],
      });
    }

    return new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false);
      }, 2000);

      socketRef.current!.on("connect", () => {
        clearTimeout(timeout);
        resolve(true);
      });

      socketRef.current!.on("disconnect", () => {
        console.warn("Disconnected from server");
      });

      socketRef.current!.io.on("reconnect_failed", () => {
        isPermanentlyDisconnected.current = true;
        socketRef.current?.disconnect();
        socketRef.current = null;
      });
    });
  };

  return {
    socketRef,
    chunkBuffer,
    isPermanentlyDisconnected,
    filenameRef,
    processChunkQueue,
    initializeSocket,
  };
};
