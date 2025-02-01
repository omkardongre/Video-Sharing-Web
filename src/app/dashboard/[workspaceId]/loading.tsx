import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 min-h-screen w-screen overflow-x-hidden bg-background/50 backdrop-blur-sm z-50">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full bg-muted" /> {/* Logo */}
          <Skeleton className="h-8 w-16 bg-muted" />
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 mx-8">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Skeleton className="h-10 w-full max-w-2xl rounded-md bg-neutral-800" />
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-24" /> {/* Upload button */}
          <Skeleton className="h-9 w-24" /> {/* Record button */}
          <Skeleton className="h-8 w-8 rounded-full" /> {/* User avatar */}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-[250px] p-4 border-r border-border">
          {/* Menu Items */}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Folders Section */}
          <div className="mb-8 mt-20">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-24" /> {/* Folders heading */}
              <Skeleton className="h-6 w-16" /> {/* See all */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square">
                  <Skeleton className="h-full w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Videos Section */}
          <div>
            <Skeleton className="h-6 w-24 mb-4" /> {/* Videos heading */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-video rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
