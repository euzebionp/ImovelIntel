import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { SearchModule } from './search/search.module';

@Module({
  imports: [SearchModule],
  controllers: [DashboardController],
  providers: [],
})
export class AppModule {}
