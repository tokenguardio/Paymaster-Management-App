-- DropForeignKey
ALTER TABLE "core"."policy_rules" DROP CONSTRAINT "policy_rules_scope_id_fkey";

-- AlterTable
ALTER TABLE "core"."policy_rules" ALTER COLUMN "scope_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "core"."policy_rules" ADD CONSTRAINT "policy_rules_scope_id_fkey" FOREIGN KEY ("scope_id") REFERENCES "core"."policy_rule_scopes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
