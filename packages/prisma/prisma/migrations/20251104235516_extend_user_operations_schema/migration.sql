-- AlterTable
ALTER TABLE "core"."user_operations" ADD COLUMN     "valid_from" TIMESTAMPTZ(6),
ADD COLUMN     "valid_to" TIMESTAMPTZ(6);
