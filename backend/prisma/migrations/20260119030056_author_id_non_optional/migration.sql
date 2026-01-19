/*
  Warnings:

  - Made the column `author_id` on table `user_articles` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "user_articles" DROP CONSTRAINT "user_articles_author_id_fkey";

-- AlterTable
ALTER TABLE "user_articles" ALTER COLUMN "author_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "user_articles" ADD CONSTRAINT "user_articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
