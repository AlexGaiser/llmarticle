/*
  Warnings:

  - You are about to drop the `UserReview` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserReview" DROP CONSTRAINT "UserReview_author_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN "username" TEXT;

-- Data Migration: Copy email to username
UPDATE "users" SET "username" = "email" WHERE "username" IS NULL;

-- Make username NOT NULL
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;

-- AlterTable (email changes)
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "UserReview";

-- CreateTable
CREATE TABLE "user_reviews" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review_link" TEXT,
    "private" BOOLEAN NOT NULL DEFAULT true,
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "user_reviews" ADD CONSTRAINT "user_reviews_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
