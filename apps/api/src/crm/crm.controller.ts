import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { CrmService } from './crm.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('crm/leads')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createLeadDto: any, @Req() req) {
    return this.crmService.createLead({ ...createLeadDto, userId: req.user.userId });
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
