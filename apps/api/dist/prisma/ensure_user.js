"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const demoId = 'demo-user-id';
    let user = await prisma.user.findUnique({ where: { id: demoId } });
    if (!user) {
        const existingEmail = await prisma.user.findUnique({ where: { email: 'demo@imovelintel.com' } });
        if (existingEmail) {
            console.log(`User with email demo@imovelintel.com already exists (ID: ${existingEmail.id}). Using it.`);
        }
        else {
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
    }
    else {
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
//# sourceMappingURL=ensure_user.js.map