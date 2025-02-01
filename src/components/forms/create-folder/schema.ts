import { z } from "zod";

export const folderSchema = z.object({
  name: z.string().min(1, { message: "folder name cannot be empty" }),
});

export type FolderSchema = z.infer<typeof folderSchema>;
