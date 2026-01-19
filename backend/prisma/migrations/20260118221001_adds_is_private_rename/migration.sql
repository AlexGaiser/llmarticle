/*
  Warnings:

  - You are about to drop the column `private` on the `user_reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_articles" ADD COLUMN     "is_private" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "user_reviews" DROP COLUMN "private",
ADD COLUMN     "is_private" BOOLEAN NOT NULL DEFAULT true;
