
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && user.passwordHash) {
        const isMatch = await bcrypt.compare(pass, user.passwordHash);
        if (isMatch) {
            const { passwordHash, ...result } = user;
            return result;
        }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.fullName,
          mustChangePassword: user.mustChangePassword
      }
    };
  }

  async register(data: any, isAdminCreate: boolean = false) {
     const existing = await this.prisma.user.findUnique({ where: { email: data.email }});
     if (existing) {
         throw new ConflictException('User already exists');
     }

     const salt = 10;
     const hash = await bcrypt.hash(data.password, salt);
     const role = isAdminCreate && data.role === 'ADMIN' ? 'ADMIN' : 'USER';

     try {
       return await this.prisma.user.create({
           data: {
               email: data.email,
               passwordHash: hash,
               fullName: data.fullName,
               role: role,
               wallet: { create: { balance: 0 } }
           }
       });
     } catch (error) {
       console.error('Error creating user:', error);
       throw new Error('Failed to create user');
     }
  }
}
