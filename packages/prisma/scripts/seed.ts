import {
  CHAINS,
  POLICY_RULE_COMPARATOR,
  POLICY_RULE_INTERVAL,
  POLICY_RULE_METRIC,
  POLICY_RULE_SCOPE,
  POLICY_STATUS,
  USER_OPERATION_STATUS,
} from '../../../apps/backend/src/config/constants';

import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Seeding tables...');

  // Seed Chains
  for (const chain of Object.values(CHAINS)) {
    await prisma.chain.upsert({
      where: { id: chain.id },
      update: { name: chain.name },
      create: { id: chain.id, name: chain.name },
    });
  }

  // Seed Policy Statuses
  for (const status of Object.values(POLICY_STATUS)) {
    await prisma.policyStatus.upsert({
      where: { id: status.id },
      update: { name: status.name, description: status.description },
      create: { id: status.id, name: status.name, description: status.description },
    });
  }

  // Seed User Operation Statuses
  for (const status of Object.values(USER_OPERATION_STATUS)) {
    await prisma.userOperationStatus.upsert({
      where: { id: status.id },
      update: { name: status.name, description: status.description },
      create: { id: status.id, name: status.name, description: status.description },
    });
  }

  // Seed Policy Rule Metrics
  for (const metric of Object.values(POLICY_RULE_METRIC)) {
    await prisma.policyRuleMetric.upsert({
      where: { id: metric.id },
      update: { name: metric.name, description: metric.description },
      create: { id: metric.id, name: metric.name, description: metric.description },
    });
  }

  // Seed Policy Rule Comparators
  for (const comparator of Object.values(POLICY_RULE_COMPARATOR)) {
    await prisma.policyRuleComparator.upsert({
      where: { id: comparator.id },
      update: { name: comparator.name, description: comparator.description },
      create: { id: comparator.id, name: comparator.name, description: comparator.description },
    });
  }

  // Seed Policy Rule Scopes
  for (const scope of Object.values(POLICY_RULE_SCOPE)) {
    await prisma.policyRuleScope.upsert({
      where: { id: scope.id },
      update: { name: scope.name, description: scope.description },
      create: { id: scope.id, name: scope.name, description: scope.description },
    });
  }

  // Seed Policy Rule Intervals
  for (const interval of Object.values(POLICY_RULE_INTERVAL)) {
    await prisma.policyRuleInterval.upsert({
      where: { id: interval.id },
      update: { name: interval.name, description: interval.description },
      create: { id: interval.id, name: interval.name, description: interval.description },
    });
  }

  console.log('Tables seeded successfully.');
}

main()
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
