import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        email: string;
        fullName: string;
        role: string;
        id: string;
        mustChangePassword: boolean;
        createdAt: Date;
    }[]>;
    remove(id: string): Promise<{
        email: string;
        fullName: string | null;
        role: string;
        id: string;
        passwordHash: string;
        isActive: boolean;
        mustChangePassword: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateRole(id: string, role: string): Promise<{
        email: string;
        role: string;
        id: string;
        mustChangePassword: boolean;
    }>;
    adminResetUserPassword(adminId: string, adminPassword: string, targetUserId: string, newPassword: string): Promise<{
        email: string;
        fullName: string | null;
        role: string;
        id: string;
        passwordHash: string;
        isActive: boolean;
        mustChangePassword: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    resetPassword(id: string, newPassword: string): Promise<{
        email: string;
        fullName: string | null;
        role: string;
        id: string;
        passwordHash: string;
        isActive: boolean;
        mustChangePassword: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(id: string, newPassword: string): Promise<{
        email: string;
        fullName: string | null;
        role: string;
        id: string;
        passwordHash: string;
        isActive: boolean;
        mustChangePassword: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
