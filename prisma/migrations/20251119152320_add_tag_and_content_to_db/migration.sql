/*
  Warnings:

  - You are about to drop the column `content` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "User" DROP COLUMN "content",
DROP COLUMN "tag",
ADD COLUMN     "tagGroupId" INTEGER,
ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');
ALTER SEQUENCE user_id_seq OWNED BY "User"."id";

-- CreateTable
CREATE TABLE "TagGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TagGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tagGroupId_fkey" FOREIGN KEY ("tagGroupId") REFERENCES "TagGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
