-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AgencyType" ADD VALUE 'TOUR_OPERATOR';
ALTER TYPE "AgencyType" ADD VALUE 'TRAVEL_AGENT';
ALTER TYPE "AgencyType" ADD VALUE 'DMC';
ALTER TYPE "AgencyType" ADD VALUE 'OTHER';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PanType" ADD VALUE 'TRUST';
ALTER TYPE "PanType" ADD VALUE 'OTHER';
