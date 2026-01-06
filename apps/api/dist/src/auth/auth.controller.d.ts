import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
            name: any;
            mustChangePassword: any;
        };
    }>;
    register(createUserDto: any): Promise<{
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
    registerAdmin(createUserDto: any): Promise<{
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
    getProfile(req: any): any;
}
