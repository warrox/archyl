/*
  Warnings:

  - You are about to drop the column `tagId` on the `UserTag` table. All the data in the column will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `UserTag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserTag" DROP CONSTRAINT "UserTag_tagId_fkey";

-- DropIndex
DROP INDEX "UserTag_userId_tagId_key";

-- AlterTable
ALTER TABLE "UserTag" DROP COLUMN "tagId",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "Tag";
