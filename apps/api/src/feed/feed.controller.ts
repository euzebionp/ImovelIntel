import { Controller, Get, Header } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('zap.xml')
  @Header('Content-Type', 'application/xml')
  async getZapFeed() {
    return this.feedService.generateZapFeed();
  }
}
