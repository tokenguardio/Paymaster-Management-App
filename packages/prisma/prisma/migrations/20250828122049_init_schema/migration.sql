-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "core";

-- CreateTable
CREATE TABLE "core"."policies" (
    "id" BIGSERIAL NOT NULL,
    "paymaster_address" VARCHAR(42) NOT NULL,
    "chain_id" BIGINT NOT NULL,
    "status_id" VARCHAR(40) NOT NULL,
    "max_budget_wei" DECIMAL(65,30) NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "whitelisted_addresses" TEXT[],
    "valid_from" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_to" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."policy_rules" (
    "id" BIGSERIAL NOT NULL,
    "policy_id" BIGINT NOT NULL,
    "metric_id" VARCHAR(40) NOT NULL,
    "comparator_id" VARCHAR(40) NOT NULL,
    "interval_id" VARCHAR(40) NOT NULL,
    "scope_id" VARCHAR(40) NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "token_address" VARCHAR(42),
    "valid_from" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_to" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "policy_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."user_operations" (
    "id" BIGSERIAL NOT NULL,
    "policy_id" BIGINT NOT NULL,
    "hash" VARCHAR(66) NOT NULL,
    "sender_address" VARCHAR(42) NOT NULL,
    "status_id" VARCHAR(40) NOT NULL,
    "status_note" TEXT,
    "payload" JSONB NOT NULL,
    "signature" TEXT,
    "actual_gas_cost_wei" DECIMAL(65,30),
    "max_gas_cost_wei" DECIMAL(65,30) NOT NULL,
    "transaction_hash" VARCHAR(66),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."chains" (
    "id" BIGINT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "chains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."policy_statuses" (
    "id" VARCHAR(40) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "description" TEXT,

    CONSTRAINT "policy_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."user_operation_statuses" (
    "id" VARCHAR(40) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "description" TEXT,

    CONSTRAINT "user_operation_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."policy_rule_metrics" (
    "id" VARCHAR(40) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "description" TEXT,

    CONSTRAINT "policy_rule_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."policy_rule_comparators" (
    "id" VARCHAR(40) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "description" TEXT,

    CONSTRAINT "policy_rule_comparators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."policy_rule_scopes" (
    "id" VARCHAR(40) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "description" TEXT,

    CONSTRAINT "policy_rule_scopes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."policy_rule_intervals" (
    "id" VARCHAR(40) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "description" TEXT,

    CONSTRAINT "policy_rule_intervals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."policies_log" (
    "id" BIGSERIAL NOT NULL,
    "policy_id" BIGINT NOT NULL,
    "field_changed" VARCHAR(40) NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "policies_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."user_operations_log" (
    "id" BIGSERIAL NOT NULL,
    "user_operation_id" BIGINT NOT NULL,
    "field_changed" VARCHAR(40) NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_operations_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_operations_hash_key" ON "core"."user_operations"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "chains_name_key" ON "core"."chains"("name");

-- CreateIndex
CREATE UNIQUE INDEX "policy_statuses_name_key" ON "core"."policy_statuses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_operation_statuses_name_key" ON "core"."user_operation_statuses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "policy_rule_metrics_name_key" ON "core"."policy_rule_metrics"("name");

-- CreateIndex
CREATE UNIQUE INDEX "policy_rule_comparators_name_key" ON "core"."policy_rule_comparators"("name");

-- CreateIndex
CREATE UNIQUE INDEX "policy_rule_scopes_name_key" ON "core"."policy_rule_scopes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "policy_rule_intervals_name_key" ON "core"."policy_rule_intervals"("name");

-- AddForeignKey
ALTER TABLE "core"."policies" ADD CONSTRAINT "policies_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "core"."chains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."policies" ADD CONSTRAINT "policies_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "core"."policy_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."policy_rules" ADD CONSTRAINT "policy_rules_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "core"."policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."policy_rules" ADD CONSTRAINT "policy_rules_metric_id_fkey" FOREIGN KEY ("metric_id") REFERENCES "core"."policy_rule_metrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."policy_rules" ADD CONSTRAINT "policy_rules_comparator_id_fkey" FOREIGN KEY ("comparator_id") REFERENCES "core"."policy_rule_comparators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."policy_rules" ADD CONSTRAINT "policy_rules_interval_id_fkey" FOREIGN KEY ("interval_id") REFERENCES "core"."policy_rule_intervals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."policy_rules" ADD CONSTRAINT "policy_rules_scope_id_fkey" FOREIGN KEY ("scope_id") REFERENCES "core"."policy_rule_scopes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."user_operations" ADD CONSTRAINT "user_operations_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "core"."policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."user_operations" ADD CONSTRAINT "user_operations_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "core"."user_operation_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."policies_log" ADD CONSTRAINT "policies_log_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "core"."policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."user_operations_log" ADD CONSTRAINT "user_operations_log_user_operation_id_fkey" FOREIGN KEY ("user_operation_id") REFERENCES "core"."user_operations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Manually added GIN index for efficient JSONB payload querying
CREATE INDEX "idx_user_ops_payload" ON "core"."user_operations" USING GIN ("payload");
