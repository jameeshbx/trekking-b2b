/*
  Warnings:

  - Added the required column `businessType` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('AGENCY', 'DMCS', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "businessType" "BusinessType" NOT NULL,
ADD COLUMN     "companyName" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;
