/*
  Warnings:

  - A unique constraint covering the columns `[name,workSpaceId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Folder_name_workSpaceId_key" ON "Folder"("name", "workSpaceId");
