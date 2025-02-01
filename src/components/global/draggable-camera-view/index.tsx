"use client";

import { useEffect, useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";

interface DraggableCameraViewProps {
  videoStream: MediaStream | null;
  isVisible: boolean;
}

export const DraggableCameraView = ({
  videoStream,
  isVisible,
}: DraggableCameraViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [position, setPosition] = useState({
    x: window.innerWidth - 330,
    y: window.innerHeight - 200,
  });

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  useEffect(() => {
    const handleResize = () => {
      setPosition({
        x: window.innerWidth - 330,
        y: window.innerHeight - 200,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bind = useDrag(({ offset: [x, y] }) => {
    setPosition({ x, y });
  });

  if (!isVisible) return null;

  return (
    <div
      {...bind()}
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        zIndex: 100,
        cursor: "move",
      }}
      className="w-[300px] rounded-lg shadow-lg"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-[169px] bg-black rounded-lg object-contain"
      />
    </div>
  );
};
