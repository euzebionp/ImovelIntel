import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchByAddress(body: {
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
}
