"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CrmService = class CrmService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createLead(data) {
        let stageId = data.stageId;
        if (!stageId) {
            const firstStage = await this.prisma.pipelineStage.findFirst({ orderBy: { order: 'asc' } });
            if (firstStage) {
                stageId = firstStage.id;
            }
            else {
                const newStage = await this.prisma.pipelineStage.create({
                    data: {
                        name: 'Novo',
                        order: 0,
                        type: 'OPEN',
                        color: '#3b82f6'
                    }
                });
                stageId = newStage.id;
            }
        }
        let userId = data.userId;
        if (!userId) {
            throw new Error('User ID is required for Lead creation.');
        }
        if (data.email === 'infoservicos@imovelintel.com' && !userId) {
        }
        console.log('--- DEBUG CREATE LEAD ---');
        console.log('Incoming Data:', JSON.stringify(data));
        console.log('Resolved StageID:', stageId);
        console.log('Resolved UserID:', userId);
        try {
            const lead = await this.prisma.lead.create({
                data: {
                    userId: userId,
                    stageId: stageId,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    budget: data.budget,
                    source: data.source || 'MANUAL',
                },
            });
            console.log('Lead created:', lead);
            return lead;
        }
        catch (error) {
            console.error('Error creating lead:', error);
            throw error;
        }
    }
    async findAllLeads() {
        return this.prisma.lead.findMany({
            include: {
                stage: true,
                interactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findLead(id) {
        return this.prisma.lead.findUnique({
            where: { id },
            include: {
                stage: true,
                interactions: { orderBy: { createdAt: 'desc' } },
                interests: { include: { property: true } }
            }
        });
    }
    async updateLeadStage(id, stageId) {
        return this.prisma.lead.update({
            where: { id },
            data: { stageId }
        });
    }
    async updateLead(id, data) {
        return this.prisma.lead.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                budget: data.budget,
            }
        });
    }
    async deleteLead(id) {
        return this.prisma.lead.delete({
            where: { id }
        });
    }
};
exports.CrmService = CrmService;
exports.CrmService = CrmService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CrmService);
//# sourceMappingURL=crm.service.js.map