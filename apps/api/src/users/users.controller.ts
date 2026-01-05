
import { Controller, Get, Delete, Param, Patch, Body, UseGuards, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Roles('ADMIN')
  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.updateRole(id, role);
  }

  @Roles('ADMIN')
  @Post(':id/reset-password')
  async resetPassword(
    @Param('id') id: string, 
    @Body('newPassword') newPassword: string,
    @Body('adminPassword') adminPassword: string,
    @Request() req
  ) {
    // 1. Validate Admin Password
    const adminUser = req.user; // From JWT
    
    return this.usersService.adminResetUserPassword(adminUser.userId, adminPassword, id, newPassword);
  }

  @Post('change-password')
  changePassword(@Request() req, @Body('newPassword') newPassword: string) {
      return this.usersService.changePassword(req.user.userId, newPassword);
  }
}
