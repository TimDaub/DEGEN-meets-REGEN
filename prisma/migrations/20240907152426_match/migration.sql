/*
  Warnings:

  - You are about to drop the column `matchedAt` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "matchedAt",
ADD COLUMN     "liked" BOOLEAN NOT NULL DEFAULT true;
