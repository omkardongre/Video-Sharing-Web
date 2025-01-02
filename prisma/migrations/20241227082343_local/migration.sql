/*
  Warnings:

  - You are about to drop the column `comment` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `summery` on the `Video` table. All the data in the column will be lost.
  - Added the required column `content` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "comment",
ADD COLUMN     "content" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "summery",
ADD COLUMN     "summary" TEXT;
