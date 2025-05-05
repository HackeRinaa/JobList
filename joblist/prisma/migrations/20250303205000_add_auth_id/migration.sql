-- AlterTable
ALTER TABLE "User" ADD COLUMN "authId" TEXT;
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "phone" TEXT,
                      ADD COLUMN "city" TEXT,
                      ADD COLUMN "postalCode" TEXT,
                      ADD COLUMN "preferences" TEXT[] DEFAULT ARRAY[]::TEXT[]; 