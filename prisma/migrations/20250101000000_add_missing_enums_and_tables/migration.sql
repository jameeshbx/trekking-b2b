-- CreateEnum
CREATE TYPE "AgencyType" AS ENUM ('PRIVATE_LIMITED', 'PROPRIETORSHIP', 'PARTNERSHIP', 'PUBLIC_LIMITED', 'LLP', 'TOUR_OPERATOR', 'TRAVEL_AGENT', 'DMC', 'OTHER');

-- CreateEnum
CREATE TYPE "PanType" AS ENUM ('INDIVIDUAL', 'COMPANY', 'TRUST', 'OTHER');

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
CREATE TABLE "DMCForm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "contactPerson" TEXT,
    "designation" TEXT,
    "phoneNumber" TEXT,
    "phoneCountryCode" TEXT DEFAULT '+91',
    "ownerName" TEXT,
    "email" TEXT,
    "ownerPhoneNumber" TEXT,
    "ownerPhoneCode" TEXT DEFAULT '+91',
    "website" TEXT,
    "primaryCountry" TEXT,
    "destinationsCovered" TEXT,
    "cities" TEXT,
    "gstRegistered" BOOLEAN DEFAULT true,
    "gstNumber" TEXT,
    "yearOfRegistration" TEXT,
    "panNumber" TEXT,
    "panType" "PanType",
    "headquarters" TEXT,
    "country" TEXT,
    "yearsOfExperience" TEXT,
    "registrationCertificateId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DMCForm_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "DMCForm_registrationCertificateId_key" ON "DMCForm"("registrationCertificateId");

-- CreateIndex
CREATE INDEX "DMCForm_name_idx" ON "DMCForm"("name");

-- CreateIndex
CREATE INDEX "DMCForm_email_idx" ON "DMCForm"("email");

-- AddForeignKey
ALTER TABLE "AgencyForm" ADD CONSTRAINT "AgencyForm_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyForm" ADD CONSTRAINT "AgencyForm_businessLicenseId_fkey" FOREIGN KEY ("businessLicenseId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DMCForm" ADD CONSTRAINT "DMCForm_registrationCertificateId_fkey" FOREIGN KEY ("registrationCertificateId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddColumn
ALTER TABLE "Subscription" ADD COLUMN "agencyFormId" TEXT;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_agencyFormId_fkey" FOREIGN KEY ("agencyFormId") REFERENCES "AgencyForm"("id") ON DELETE CASCADE ON UPDATE CASCADE; 