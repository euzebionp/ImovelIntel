import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  async createLead(data: any) {
    // 1. Ensure Pipeline Stage
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

    // 2. Ensure Proper User
    // In authenticated context, userId comes from the JWT via the Controller.
    // If for some reason it's missing (e.g. legacy call), we might fall back or error.
    let userId = data.userId;

    // For now, we trust the Controller to pass the correct ID from req.user
    if (!userId) {
        throw new Error('User ID is required for Lead creation.');
    }
    
    // We can keep the admin auto-seeding logic if we want to ensure specific logic, 
    // but typically now we just rely on existing users. 
    // However, to keep the "Self-Healing" nature of the "infoservicos" admin for testing:
    if (data.email === 'infoservicos@imovelintel.com' && !userId) {
       // logic to find/create admin if needed (rare case now that we force login)
    }

    console.log('--- DEBUG CREATE LEAD ---');
    console.log('Incoming Data:', JSON.stringify(data));
    console.log('Resolved StageID:', stageId);
    console.log('Resolved UserID:', userId);

    try {
      const lead = await this.prisma.lead.create({
        data: {
          userId: userId,
          stageId: stageId!, 
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

  async updateLead(id: string, data: any) {
    return this.prisma.lead.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        budget: data.budget,
        // We generally don't update stage/userId here blindly, but for MVP it's fine to rely on what's passed or ignored
      }
    });
  }

  async deleteLead(id: string) {
    // Delete related records first if necessary (e.g. interactions), 
    // or rely on Cascade delete if configured in schema.
    // Assuming Cascade or no relations blocking:
    return this.prisma.lead.delete({
      where: { id }
    });
  }
}
