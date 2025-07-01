/*
  Warnings:

  - You are about to drop the `_AgencyFormToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AgencyFormToUser" DROP CONSTRAINT "_AgencyFormToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_AgencyFormToUser" DROP CONSTRAINT "_AgencyFormToUser_B_fkey";

-- DropTable
DROP TABLE "_AgencyFormToUser";
