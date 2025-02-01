"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchResultType } from "@/types/search";
import { FolderIcon, Video, Briefcase } from "lucide-react";
import Link from "next/link";

interface SearchResultProps {
  results: SearchResultType | null;
  isLoading: boolean;
}

export const SearchResults = ({ results, isLoading }: SearchResultProps) => {
  if (isLoading) {
    return (
      <div className="absolute top-full left-0 w-full bg-background border rounded-md shadow-lg mt-2 p-2 z-50">
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const hasResults =
    results.videos.length > 0 ||
    results.folders.length > 0 ||
    results.workspaces.length > 0;

  if (!hasResults) {
    return (
      <div className="absolute top-full left-0 w-full bg-background border rounded-md shadow-lg mt-2 p-4 z-50">
        <p className="text-sm text-muted-foreground text-center">
          No results found
        </p>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 w-full bg-background border rounded-md shadow-lg mt-2 z-50">
      <ScrollArea className="max-h-[300px]">
        {results.videos.length > 0 && (
          <div className="p-2">
            <h3 className="text-sm font-semibold mb-2">Videos</h3>
            {results.videos.map((video) => (
              <Link
                href={`/dashboard/${video.workSpaceId}/video/${video.id}`}
                key={video.id}
                className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
              >
                <Video size={16} />
                <div>
                  <p className="text-sm">{video.title}</p>
                  <p className="text-xs text-muted-foreground">
                    By {video.User.firstName} {video.User.lastName}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {results.folders.length > 0 && (
          <div className="p-2">
            <h3 className="text-sm font-semibold mb-2">Folders</h3>
            {results.folders.map((folder) => (
              <Link
                href={`/dashboard/${folder.workSpaceId}/folder/${folder.id}`}
                key={folder.id}
                className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
              >
                <FolderIcon size={16} />
                <p className="text-sm">{folder.name}</p>
              </Link>
            ))}
          </div>
        )}

        {results.workspaces.length > 0 && (
          <div className="p-2">
            <h3 className="text-sm font-semibold mb-2">Workspaces</h3>
            {results.workspaces.map((workspace) => (
              <Link
                href={`/dashboard/${workspace.id}`}
                key={workspace.id}
                className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
              >
                <Briefcase size={16} />
                <p className="text-sm">{workspace.name}</p>
              </Link>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
