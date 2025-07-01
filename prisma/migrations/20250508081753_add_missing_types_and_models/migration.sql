-- CreateEnum
CREATE TYPE "AgencyType" AS ENUM ('PRIVATE_LIMITED', 'PROPRIETORSHIP', 'PARTNERSHIP', 'PUBLIC_LIMITED', 'LLP');

-- CreateEnum
CREATE TYPE "PanType" AS ENUM ('COMPANY', 'INDIVIDUAL');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "agencyFormId" TEXT;

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "_AgencyFormToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AgencyFormToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgencyForm_logoId_key" ON "AgencyForm"("logoId");

-- CreateIndex
CREATE UNIQUE INDEX "AgencyForm_businessLicenseId_key" ON "AgencyForm"("businessLicenseId");

-- CreateIndex
CREATE INDEX "AgencyForm_name_idx" ON "AgencyForm"("name");

-- CreateIndex
CREATE INDEX "AgencyForm_email_idx" ON "AgencyForm"("email");

-- CreateIndex
CREATE INDEX "_AgencyFormToUser_B_index" ON "_AgencyFormToUser"("B");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_agencyFormId_fkey" FOREIGN KEY ("agencyFormId") REFERENCES "AgencyForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyForm" ADD CONSTRAINT "AgencyForm_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyForm" ADD CONSTRAINT "AgencyForm_businessLicenseId_fkey" FOREIGN KEY ("businessLicenseId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgencyFormToUser" ADD CONSTRAINT "_AgencyFormToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "AgencyForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgencyFormToUser" ADD CONSTRAINT "_AgencyFormToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
