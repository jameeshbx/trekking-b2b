-- DropIndex
DROP INDEX "PasswordReset_userId_idx";

-- DropIndex
DROP INDEX "Admin_profileId_idx";

-- DropIndex
DROP INDEX "Admin_userId_idx";

-- RenameIndex
ALTER INDEX "Comment_authorId_idx" RENAME TO "comments_authorId_idx";

-- RenameIndex
ALTER INDEX "Comment_managerId_idx" RENAME TO "comments_managerId_idx";

-- RenameIndex
ALTER INDEX "UserForm_profileImageId_idx" RENAME TO "user_form_profileImageId_idx";
