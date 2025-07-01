/*
  Warnings:

  - The values [ADMIN] on the enum `BusinessType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BusinessType_new" AS ENUM ('AGENCY', 'DMCS', 'TEKKING_MYLES');
ALTER TABLE "User" ALTER COLUMN "businessType" TYPE "BusinessType_new" USING ("businessType"::text::"BusinessType_new");
ALTER TYPE "BusinessType" RENAME TO "BusinessType_old";
ALTER TYPE "BusinessType_new" RENAME TO "BusinessType";
DROP TYPE "BusinessType_old";
COMMIT;
