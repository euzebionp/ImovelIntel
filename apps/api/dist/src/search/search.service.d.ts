import { HttpService } from '@nestjs/axios';
export declare class SearchService {
    private readonly httpService;
    constructor(httpService: HttpService);
    initiateSearch(data: {
        address: string;
        zipCode?: string;
    }): Promise<{
        searchId: string;
        status: string;
    }>;
    getSearchStatus(id: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        searchTerm: string | null;
        status: string;
        resultSummary: string | null;
        propertyId: string | null;
    }>;
    private callWorker;
}
