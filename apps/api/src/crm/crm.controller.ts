import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CrmService } from './crm.service';

@Controller('crm/leads')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Post()
  create(@Body() createLeadDto: any) {
    return this.crmService.createLead(createLeadDto);
  }

  @Get()
  findAll() {
    return this.crmService.findAllLeads();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.crmService.findLead(id);
  }

  @Put(':id/stage')
  updateStage(@Param('id') id: string, @Body('stageId') stageId: string) {
    return this.crmService.updateLeadStage(id, stageId);
  }
}
