/*
  Warnings:

  - You are about to drop the column `accepted` on the `Invite` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('WAITING', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "accepted",
ADD COLUMN     "status" "InviteStatus" NOT NULL DEFAULT 'WAITING';
