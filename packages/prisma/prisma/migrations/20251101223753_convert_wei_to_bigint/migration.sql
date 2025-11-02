/*
  Warnings:

  - You are about to alter the column `max_budget_wei` on the `policies` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `BigInt`.
  - You are about to drop the column `signature` on the `user_operations` table. All the data in the column will be lost.
  - You are about to alter the column `actual_gas_cost_wei` on the `user_operations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `BigInt`.
  - You are about to alter the column `max_gas_cost_wei` on the `user_operations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `BigInt`.

*/
-- DropIndex
DROP INDEX "core"."user_operations_hash_key";

-- AlterTable
ALTER TABLE "core"."policies" ALTER COLUMN "max_budget_wei" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "core"."user_operations" DROP COLUMN "signature",
ALTER COLUMN "hash" DROP NOT NULL,
ALTER COLUMN "actual_gas_cost_wei" SET DATA TYPE BIGINT,
ALTER COLUMN "max_gas_cost_wei" SET DATA TYPE BIGINT;
