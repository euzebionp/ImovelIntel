import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  async createLead(data: any) {
    // Basic validation or default stage assignment could go here
    // For now, assume stageId might be passed or we default to the first one
    let stageId = data.stageId;
    if (!stageId) {
      const firstStage = await this.prisma.pipelineStage.findFirst({ orderBy: { order: 'asc' } });
      if (firstStage) {
        stageId = firstStage.id;
      } else {
        // Create a default stage if none exists
        const newStage = await this.prisma.pipelineStage.create({
          data: {
            name: 'Novo',
            order: 0,
            type: 'OPEN',
            color: '#3b82f6' // Blue
          }
        });
        stageId = newStage.id;
      }
    }

    let userId = data.userId;
    if (userId === 'demo-user-id') {
        // Fix for MVP: Frontend sends hardcoded ID, but DB might have a different one (UUID)
        const demoUser = await this.prisma.user.findFirst({ where: { email: 'demo@imovelintel.com' } });
        if (demoUser) {
            userId = demoUser.id;
        }
    }

    console.log('--- DEBUG CREATE LEAD ---');
    console.log('Incoming Data:', JSON.stringify(data));
    console.log('Resolved StageID:', stageId);
    console.log('Resolved UserID:', userId);

    try {
      const lead = await this.prisma.lead.create({
        data: {
          userId: userId, // In a real app, extract from JWT context
          stageId: stageId!, // Bang operator assumes we have at least one stage seed
          name: data.name,
          email: data.email,
          phone: data.phone,
          budget: data.budget,
          source: data.source || 'MANUAL',
        },
      });
      console.log('Lead created:', lead);
      return lead;
    } catch (error) {
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

  async findLead(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
      include: {
        stage: true,
        interactions: { orderBy: { createdAt: 'desc' } },
        interests: { include: { property: true } }
      }
    });
  }

  async updateLeadStage(id: string, stageId: string) {
    return this.prisma.lead.update({
      where: { id },
      data: { stageId }
    });
  }
}
