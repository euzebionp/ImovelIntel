import { CrmService } from './crm.service';
export declare class CrmController {
    private readonly crmService;
    constructor(crmService: CrmService);
    create(createLeadDto: any, req: any): Promise<{
        email: string | null;
        name: string;
        phone: string | null;
        budget: import("@prisma/client/runtime/library").Decimal | null;
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        source: string | null;
        stageId: string;
    }>;
    findAll(): Promise<({
        stage: {
            name: string;
            id: string;
            order: number;
            type: string;
            color: string | null;
        };
        interactions: {
            id: string;
            createdAt: Date;
            type: string;
            leadId: string;
            content: string;
        }[];
    } & {
        email: string | null;
        name: string;
        phone: string | null;
        budget: import("@prisma/client/runtime/library").Decimal | null;
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        source: string | null;
        stageId: string;
    })[]>;
    findOne(id: string): Promise<{
        stage: {
            name: string;
            id: string;
            order: number;
            type: string;
            color: string | null;
        };
        interactions: {
            id: string;
            createdAt: Date;
            type: string;
            leadId: string;
            content: string;
        }[];
        interests: ({
            property: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                type: string | null;
                status: string;
                addressFull: string;
                zipCode: string;
                city: string | null;
                state: string | null;
                inscricaoMunicipal: string | null;
                matricula: string | null;
                cartorioName: string | null;
                latitude: import("@prisma/client/runtime/library").Decimal | null;
                longitude: import("@prisma/client/runtime/library").Decimal | null;
                lastEnrichedAt: Date | null;
                subType: string | null;
                price: import("@prisma/client/runtime/library").Decimal | null;
                priceCondo: import("@prisma/client/runtime/library").Decimal | null;
                priceIptu: import("@prisma/client/runtime/library").Decimal | null;
                areaUsable: import("@prisma/client/runtime/library").Decimal | null;
                areaTotal: import("@prisma/client/runtime/library").Decimal | null;
                bedrooms: number | null;
                bathrooms: number | null;
                parkingSpaces: number | null;
                description: string | null;
                images: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string | null;
            propertyId: string;
            leadId: string;
            notes: string | null;
        })[];
    } & {
        email: string | null;
        name: string;
        phone: string | null;
        budget: import("@prisma/client/runtime/library").Decimal | null;
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        source: string | null;
        stageId: string;
    }>;
    updateStage(id: string, stageId: string): Promise<{
        email: string | null;
        name: string;
        phone: string | null;
        budget: import("@prisma/client/runtime/library").Decimal | null;
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        source: string | null;
        stageId: string;
    }>;
    update(id: string, updateLeadDto: any): Promise<{
        email: string | null;
        name: string;
        phone: string | null;
        budget: import("@prisma/client/runtime/library").Decimal | null;
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        source: string | null;
        stageId: string;
    }>;
    remove(id: string): Promise<{
        email: string | null;
        name: string;
        phone: string | null;
        budget: import("@prisma/client/runtime/library").Decimal | null;
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        source: string | null;
        stageId: string;
    }>;
}
