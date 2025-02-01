"use client";

import { WorkSpace } from "@prisma/client";
import { usePathname } from "next/navigation";

type Props = {
  workspace: WorkSpace;
};

const GlobalHeader = ({ workspace }: Props) => {
  const fullPath = usePathname();
  const currentPath = fullPath.split(`/dashboard/${workspace.id}`)[1];

  const getWorkspaceType = () => {
    if (currentPath.includes("video")) return "";
    return workspace.type.toLocaleUpperCase();
  };

  const getPageTitle = () => {
    // Video pages have no title
    if (currentPath.includes("video")) return "";

    // Folder pages show "My Library"
    if (currentPath.includes("folder")) return "My Library";

    // No additional path shows "My Library"
    if (!currentPath) return "My Library";

    // Other paths show capitalized path name
    const pathWithoutSlash = currentPath.slice(1);
    return (
      pathWithoutSlash.charAt(0).toUpperCase() +
      pathWithoutSlash.slice(1).toLowerCase()
    );
  };

  return (
    <article className="flex flex-col gap-2">
      <span className="text-[#707070] text-xs">{getWorkspaceType()}</span>
      <h1 className="text-4xl font-bold">{getPageTitle()}</h1>
    </article>
  );
};

export default GlobalHeader;
