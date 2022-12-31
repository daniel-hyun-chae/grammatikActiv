/*
  Warnings:

  - You are about to drop the column `number` on the `Unit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "unitsIdList" TEXT[];

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "number",
ALTER COLUMN "subTitle" DROP NOT NULL;
