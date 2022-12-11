/*
  Warnings:

  - You are about to alter the column `expires_at` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.

*/
-- CreateEnum
CREATE TYPE "Content" AS ENUM ('VIDEO', 'IMAGE');

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "expires_at" SET DATA TYPE INT4;

-- CreateTable
CREATE TABLE "Post" (
    "id" STRING NOT NULL,
    "type" "Content" NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
    "before" STRING NOT NULL,
    "after" STRING NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
