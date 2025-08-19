/*
  Warnings:

  - You are about to drop the column `StartDate` on the `Event` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "StartDate",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
