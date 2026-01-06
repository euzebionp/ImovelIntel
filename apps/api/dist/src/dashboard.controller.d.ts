export declare class DashboardController {
    getStats(): {
        totalSearches: number;
        propertiesFound: number;
        creditsAvailable: number;
        newClients: number;
        searchesChange: string;
        propertiesChange: string;
        creditsChange: string;
        clientsChange: string;
    };
    getRecentActivity(): {
        id: number;
        address: string;
        time: string;
        city: string;
        status: string;
    }[];
}
