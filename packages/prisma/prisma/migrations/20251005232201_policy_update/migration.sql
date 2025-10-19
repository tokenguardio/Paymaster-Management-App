/*
  Warnings:

  - Added the required column `name` to the `policies` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "core"."idx_user_ops_payload";

-- AlterTable
ALTER TABLE "core"."policies" ADD COLUMN     "name" VARCHAR(32) NOT NULL;
