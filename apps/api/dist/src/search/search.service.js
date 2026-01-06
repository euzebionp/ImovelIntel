"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const client_1 = require("@prisma/client");
const rxjs_1 = require("rxjs");
const prisma = new client_1.PrismaClient();
let SearchService = class SearchService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async initiateSearch(data) {
        let user = await prisma.user.findFirst();
        if (!user) {
            user = await prisma.user.create({
                data: { email: 'demo@imovelintel.com', passwordHash: 'demo', fullName: 'Demo User' }
            });
        }
        const search = await prisma.searchHistory.create({
            data: {
                userId: user.id,
                searchTerm: data.address,
                status: 'QUEUED',
            },
        });
        this.callWorker(search.id, data);
        return { searchId: search.id, status: 'QUEUED' };
    }
    async getSearchStatus(id) {
        return prisma.searchHistory.findUnique({
            where: { id },
        });
    }
    async callWorker(searchId, data) {
        try {
            console.log(`[SearchService] Calling worker for search ${searchId}`);
            await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:8000/scrape', Object.assign({ searchId }, data)));
        }
        catch (error) {
            console.error('[SearchService] Failed to call worker:', error.message);
            await prisma.searchHistory.update({
                where: { id: searchId },
                data: { status: 'FAILED' },
            });
        }
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], SearchService);
//# sourceMappingURL=search.service.js.map