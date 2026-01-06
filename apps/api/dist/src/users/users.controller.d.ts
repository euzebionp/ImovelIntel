import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    resetPassword(id: string, newPassword: string, adminPassword: string, req: any): Promise<{
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
    changePassword(req: any, newPassword: string): Promise<{
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
