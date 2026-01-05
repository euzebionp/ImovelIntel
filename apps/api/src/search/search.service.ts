import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaClient } from '@prisma/client';
import { firstValueFrom } from 'rxjs';

const prisma = new PrismaClient(); // In a real app, use PrismaService

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) {}

  async initiateSearch(data: { address: string; zipCode?: string }) {
    // 1. Create Record (QUEUED)
    // NOTE: Using a fixed dummy user ID for MVP demo since we don't have auth yet
    // In production, this comes from JWT
    let user = await prisma.user.findFirst();
    if (!user) {
        user = await prisma.user.create({
            data: { email: 'demo@imovelintel.com', passwordHash: 'demo', fullName: 'Demo User' }
        });
    }

    const search = await prisma.searchHistory.create({
      data: {
        userId: user.id,
        searchTerm: data.address,
        status: 'QUEUED',
      },
    });

    // 2. Call Worker via HTTP (Fire and Forget or Async)
    // We don't await the result because scraping takes time
    this.callWorker(search.id, data);

    return { searchId: search.id, status: 'QUEUED' };
  }

  async getSearchStatus(id: string) {
    return prisma.searchHistory.findUnique({
      where: { id },
    });
  }

  private async callWorker(searchId: string, data: any) {
    try {
      console.log(`[SearchService] Calling worker for search ${searchId}`);
      await firstValueFrom(
        this.httpService.post('http://localhost:8000/scrape', {
          searchId,
          ...data,
        })
      );
    } catch (error) {
      console.error('[SearchService] Failed to call worker:', error.message);
      await prisma.searchHistory.update({
        where: { id: searchId },
        data: { status: 'FAILED' },
      });
    }
  }
}
