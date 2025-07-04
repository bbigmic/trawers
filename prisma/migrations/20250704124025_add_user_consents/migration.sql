-- AlterTable
ALTER TABLE "User" ADD COLUMN     "consentDate" TIMESTAMP(3),
ADD COLUMN     "dataProcessingConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "marketingConsent" BOOLEAN NOT NULL DEFAULT false;
