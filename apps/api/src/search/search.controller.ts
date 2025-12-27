import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('address')
  async searchByAddress(@Body() body: { address: string; zipCode?: string }) {
    return this.searchService.initiateSearch(body);
  }

  @Get(':id')
  async getSearchStatus(@Param('id') id: string) {
    return this.searchService.getSearchStatus(id);
  }
}
