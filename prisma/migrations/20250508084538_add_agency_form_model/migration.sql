/*
  Warnings:

  - You are about to drop the column `type` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `agencyFormId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the `AgencyForm` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `mimeType` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AgencyForm" DROP CONSTRAINT "AgencyForm_businessLicenseId_fkey";

-- DropForeignKey
ALTER TABLE "AgencyForm" DROP CONSTRAINT "AgencyForm_logoId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_agencyFormId_fkey";

-- AlterTable
ALTER TABLE "Agency" ADD COLUMN     "agencyType" "AgencyType",
ADD COLUMN     "businessLicenseId" TEXT,
ADD COLUMN     "companyPhone" TEXT,
ADD COLUMN     "companyPhoneCode" TEXT DEFAULT '+91',
ADD COLUMN     "contactPerson" TEXT,
ADD COLUMN     "country" TEXT DEFAULT 'INDIA',
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "gstNumber" TEXT,
ADD COLUMN     "gstRegistered" BOOLEAN DEFAULT true,
ADD COLUMN     "headquarters" TEXT,
ADD COLUMN     "landingPageColor" TEXT DEFAULT '#4ECDC4',
ADD COLUMN     "logoId" TEXT,
ADD COLUMN     "ownerName" TEXT,
ADD COLUMN     "panNumber" TEXT,
ADD COLUMN     "panType" "PanType",
ADD COLUMN     "phoneCountryCode" TEXT DEFAULT '+91',
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "yearOfRegistration" TEXT,
ADD COLUMN     "yearsOfOperation" TEXT,
ALTER COLUMN "config" SET DEFAULT '{}';

-- AlterTable
ALTER TABLE "File" DROP COLUMN "type",
DROP COLUMN "updatedAt",
ADD COLUMN     "bucket" TEXT DEFAULT 'local',
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "agencyFormId";

-- DropTable
DROP TABLE "AgencyForm";

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_businessLicenseId_fkey" FOREIGN KEY ("businessLicenseId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
