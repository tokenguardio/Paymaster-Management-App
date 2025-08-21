import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  try {
    console.log('Creating policies...');

    const policies = [
      { id: 1, name: 'Data Privacy Policy' },
      { id: 2, name: 'Security Compliance Policy' },
      { id: 3, name: 'Code of Conduct Policy' },
    ];

    for (const policyData of policies) {
      await prisma.policy.upsert({
        where: { id: policyData.id },
        update: { name: policyData.name },
        create: { name: policyData.name },
      });
    }
  } catch (error) {
    console.error('Error creating policies:', error);
    throw error;
  }
}

main()
  .then(async () => {
    console.log('Closing database connection...');
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Fatal error:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
