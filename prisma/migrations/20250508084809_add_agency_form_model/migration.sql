/*
  Warnings:

  - You are about to drop the column `agencyType` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `businessLicenseId` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `companyPhone` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `companyPhoneCode` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `contactPerson` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `designation` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `gstNumber` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `gstRegistered` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `headquarters` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `landingPageColor` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `logoId` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `ownerName` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `panNumber` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `panType` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `phoneCountryCode` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `yearOfRegistration` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `yearsOfOperation` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `bucket` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `originalName` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `File` table. All the data in the column will be lost.
  - Added the required column `type` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Agency" DROP CONSTRAINT "Agency_businessLicenseId_fkey";

-- DropForeignKey
ALTER TABLE "Agency" DROP CONSTRAINT "Agency_logoId_fkey";

-- AlterTable
ALTER TABLE "Agency" DROP COLUMN "agencyType",
DROP COLUMN "businessLicenseId",
DROP COLUMN "companyPhone",
DROP COLUMN "companyPhoneCode",
DROP COLUMN "contactPerson",
DROP COLUMN "country",
DROP COLUMN "designation",
DROP COLUMN "email",
DROP COLUMN "gstNumber",
DROP COLUMN "gstRegistered",
DROP COLUMN "headquarters",
DROP COLUMN "landingPageColor",
DROP COLUMN "logoId",
DROP COLUMN "ownerName",
DROP COLUMN "panNumber",
DROP COLUMN "panType",
DROP COLUMN "phoneCountryCode",
DROP COLUMN "phoneNumber",
DROP COLUMN "website",
DROP COLUMN "yearOfRegistration",
DROP COLUMN "yearsOfOperation",
ALTER COLUMN "config" DROP DEFAULT;

-- AlterTable
ALTER TABLE "File" DROP COLUMN "bucket",
DROP COLUMN "mimeType",
DROP COLUMN "originalName",
DROP COLUMN "path",
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "agencyFormId" TEXT;

-- CreateTable
CREATE TABLE "AgencyForm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "contactPerson" TEXT,
    "agencyType" "AgencyType",
    "designation" TEXT,
    "phoneNumber" TEXT,
    "phoneCountryCode" TEXT DEFAULT '+91',
    "ownerName" TEXT,
    "email" TEXT,
    "companyPhone" TEXT,
    "companyPhoneCode" TEXT DEFAULT '+91',
    "website" TEXT,
    "landingPageColor" TEXT DEFAULT '#4ECDC4',
    "gstRegistered" BOOLEAN DEFAULT true,
    "gstNumber" TEXT,
    "yearOfRegistration" TEXT,
    "panNumber" TEXT,
    "panType" "PanType",
    "headquarters" TEXT,
    "country" TEXT DEFAULT 'INDIA',
    "yearsOfOperation" TEXT,
    "logoId" TEXT,
    "businessLicenseId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgencyForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgencyForm_logoId_key" ON "AgencyForm"("logoId");

-- CreateIndex
CREATE UNIQUE INDEX "AgencyForm_businessLicenseId_key" ON "AgencyForm"("businessLicenseId");

-- CreateIndex
CREATE INDEX "AgencyForm_name_idx" ON "AgencyForm"("name");

-- CreateIndex
CREATE INDEX "AgencyForm_email_idx" ON "AgencyForm"("email");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_agencyFormId_fkey" FOREIGN KEY ("agencyFormId") REFERENCES "AgencyForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyForm" ADD CONSTRAINT "AgencyForm_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyForm" ADD CONSTRAINT "AgencyForm_businessLicenseId_fkey" FOREIGN KEY ("businessLicenseId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
