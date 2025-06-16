/*
  Warnings:

  - Changed the type of `category` on the `JobListing` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "JobCategory" AS ENUM ('ELECTRICIAN', 'PLUMBER', 'PAINTER', 'CARPENTER', 'HVAC_TECHNICIAN', 'APPLIANCE_REPAIR', 'GENERAL_CONTRACTOR', 'ARCHITECT', 'INTERIOR_DESIGNER', 'LANDSCAPER', 'MASON', 'ROOFER', 'FLOORING_SPECIALIST', 'SECURITY_SYSTEM_INSTALLER', 'HOME_INSPECTOR', 'CLEANING_SERVICE', 'PEST_CONTROL', 'POOL_MAINTENANCE', 'SOLAR_INSTALLER', 'SMART_HOME_TECHNICIAN');

-- AlterTable
ALTER TABLE "JobListing" DROP COLUMN "category",
ADD COLUMN     "category" "JobCategory" NOT NULL;
