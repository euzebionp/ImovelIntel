import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { SearchModule } from './search/search.module';

import { CrmModule } from './crm/crm.module';
import { FeedModule } from './feed/feed.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, SearchModule, CrmModule, FeedModule],
  controllers: [DashboardController],
  providers: [],
})
export class AppModule {}
