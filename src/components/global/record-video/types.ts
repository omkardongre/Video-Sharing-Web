export interface RecordVideoProps {
  userId: string;
  onStreamReady?: (stream: MediaStream | null) => void;
}

export interface VideoChunk {
  data: Blob;
  filename: string;
}
