/*
  Warnings:

  - You are about to drop the column `Description` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "Description",
ADD COLUMN     "description" TEXT;
