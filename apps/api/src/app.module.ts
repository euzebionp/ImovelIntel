import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { SearchModule } from './search/search.module';

import { CrmModule } from './crm/crm.module';
import { FeedModule } from './feed/feed.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

import { UsersModule } from './users/users.module';

import { AppController } from './app.controller';

@Module({
  imports: [PrismaModule, SearchModule, CrmModule, FeedModule, AuthModule, UsersModule],
  controllers: [DashboardController, AppController],
  providers: [],
})
export class AppModule {}
