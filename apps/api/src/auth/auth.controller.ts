
import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() req) {
    const user = await this.authService.validateUser(req.email, req.password);
    if (!user) {
        throw new Error('Invalid credentials');
    }
    return this.authService.login(user); // Returns JWT
  }

  @Post('register')
  async register(@Body() createUserDto: any) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/register')
  async registerAdmin(@Body() createUserDto: any) {
      // Allows defining role via body if needed, but forced to ADMIN logic in service if desired
      // Here passing implicit trust that this endpoint creates admins
      return this.authService.register({ ...createUserDto, role: 'ADMIN' }, true);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
