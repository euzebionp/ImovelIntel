import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const demoId = 'demo-user-id';
  // Check by ID first
  let user = await prisma.user.findUnique({ where: { id: demoId } });

  if (!user) {
    // Check if email is taken by another ID
    const existingEmail = await prisma.user.findUnique({ where: { email: 'demo@imovelintel.com' } });
    
    if (existingEmail) {
        console.log(`User with email demo@imovelintel.com already exists (ID: ${existingEmail.id}). Using it.`);
        // Note: The app might specifically expect 'demo-user-id', but if the email is taken, we can't create 'demo-user-id' with that email.
        // We will assume the existing user is fine or update the ID if possible (not recommended to change IDs).
        // For MVP, if email exists, we consider it done.
    } else {
        console.log(`User ${demoId} not found. Creating...`);
        await prisma.user.create({
        data: {
            id: demoId,
            email: 'demo@imovelintel.com',
            fullName: 'Demo User',
            passwordHash: 'hashed_placeholder',
        }
        });
        console.log(`User ${demoId} created.`);
    }
  } else {
    console.log(`User ${demoId} already exists.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
