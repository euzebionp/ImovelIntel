import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'infoservicos@imovelintel.com';
  const password = 'infoservicos';
  const salt = 10;
  const passwordHash = await bcrypt.hash(password, salt);

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    console.log(`User ${email} already exists. Updating password...`);
    await prisma.user.update({
      where: { email },
      data: { passwordHash, isActive: true, role: 'ADMIN' },
    });
    console.log(`User updated.`);
  } else {
    console.log(`Creating user ${email}...`);
    await prisma.user.create({
      data: {
        email,
        fullName: 'Admin Infoservicos',
        passwordHash,
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log(`User created.`);
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
