
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        mustChangePassword: true,
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.delete({ where: { id } });
  }

  async updateRole(id: string, role: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
        mustChangePassword: true,
      }
    });
  }

  async adminResetUserPassword(adminId: string, adminPassword: string, targetUserId: string, newPassword: string) {
      // 1. Verify Admin Password
      const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
      if (!admin || !admin.passwordHash) {
          throw new UnauthorizedException('Admin not found or invalid state');
      }

      const isMatch = await bcrypt.compare(adminPassword, admin.passwordHash);
      
      if (!isMatch) {
          throw new UnauthorizedException('Senha do administrador incorreta');
      }

      // 2. Update Target User Password
      return this.resetPassword(targetUserId, newPassword);
  }

  async resetPassword(id: string, newPassword: string) {
    const salt = 10;
    const hash = await bcrypt.hash(newPassword, salt);
    
    return this.prisma.user.update({
      where: { id },
      data: { 
        passwordHash: hash,
        mustChangePassword: true 
      }
    });
  }

  async changePassword(id: string, newPassword: string) {
     const salt = 10;
     const hash = await bcrypt.hash(newPassword, salt);

     return this.prisma.user.update({
       where: { id },
       data: {
         passwordHash: hash,
         mustChangePassword: false
       }
     });
  }
}
