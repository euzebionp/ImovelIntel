"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const stages = [
        { name: 'Novo', order: 1, color: '#3b82f6', type: 'OPEN' },
        { name: 'Contato Feito', order: 2, color: '#f59e0b', type: 'OPEN' },
        { name: 'Visita Agendada', order: 3, color: '#8b5cf6', type: 'OPEN' },
        { name: 'Proposta', order: 4, color: '#ec4899', type: 'OPEN' },
        { name: 'Fechado/Ganho', order: 5, color: '#10b981', type: 'WON' },
        { name: 'Perdido', order: 6, color: '#ef4444', type: 'LOST' },
    ];
    for (const stage of stages) {
        const exists = await prisma.pipelineStage.findFirst({ where: { name: stage.name } });
        if (!exists) {
            await prisma.pipelineStage.create({ data: stage });
            console.log(`Created stage: ${stage.name}`);
        }
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
//# sourceMappingURL=seed.js.map