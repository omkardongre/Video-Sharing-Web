import { Folder, Video, WorkSpace } from "@prisma/client";

export interface SearchResultType {
  videos: (Video & {
    User: {
      firstName: string;
      lastName: string;
    };
  })[];
  folders: Folder[];
  workspaces: WorkSpace[];
}
