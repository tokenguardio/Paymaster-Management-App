/*
  Warnings:

  - Added the required column `rpc_env_var` to the `chains` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "core"."chains" ADD COLUMN     "rpc_env_var" VARCHAR(256);

-- AlterTable
ALTER TABLE "core"."user_operations" ADD COLUMN     "block_number" BIGINT,
ADD COLUMN     "bundler_address" VARCHAR(42),
ADD COLUMN     "gas_price_wei" BIGINT,
ADD COLUMN     "gas_used_wei" BIGINT;

-- CreateTable
CREATE TABLE "core"."reconciliation_jobs" (
    "id" BIGSERIAL NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "start_time" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMPTZ(6),
    "last_heartbeat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_ops_total" INTEGER NOT NULL DEFAULT 0,
    "user_ops_processed" INTEGER NOT NULL DEFAULT 0,
    "user_ops_failed" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "reconciliation_jobs_pkey" PRIMARY KEY ("id")
);
