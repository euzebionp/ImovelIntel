import { PrismaService } from '../prisma/prisma.service';
export declare class FeedService {
    private prisma;
    constructor(prisma: PrismaService);
    generateZapFeed(): Promise<string>;
}
