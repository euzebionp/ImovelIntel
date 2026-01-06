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
exports.FeedService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const xmlbuilder2_1 = require("xmlbuilder2");
let FeedService = class FeedService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateZapFeed() {
        var _a, _b, _c, _d, _e;
        const properties = await this.prisma.property.findMany({
            where: { status: 'PUBLISHED' },
            include: {
                owners: true
            }
        });
        const root = (0, xmlbuilder2_1.create)({ version: '1.0', encoding: 'UTF-8' })
            .ele('ListingDataFeed', {
            xmlns: 'http://www.vivareal.com/schemas/1.0/VRSync',
            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            'xsi:schemaLocation': 'http://www.vivareal.com/schemas/1.0/VRSync  http://xml.vivareal.com/vrsync.xsd'
        })
            .ele('Header')
            .ele('Provider').txt('ImovelIntel SaaS').up()
            .ele('Email').txt('contato@imovelintel.com').up()
            .ele('ContactName').txt('Suporte').up()
            .up()
            .ele('Listings');
        for (const prop of properties) {
            const listing = root.ele('Listing');
            listing.ele('ListingID').txt(prop.id).up();
            listing.ele('TransactionType').txt('Sale').up();
            listing.ele('Title').txt(prop.description || 'Imóvel à Venda').up();
            const details = listing.ele('Details');
            details.ele('PropertyType').txt(prop.type || 'Residential').up();
            details.ele('ListPrice', { currency: 'BRL' }).txt(((_a = prop.price) === null || _a === void 0 ? void 0 : _a.toString()) || '0').up();
            details.ele('LivingArea', { unit: 'square metres' }).txt(((_b = prop.areaUsable) === null || _b === void 0 ? void 0 : _b.toString()) || '0').up();
            details.ele('Bedrooms').txt(((_c = prop.bedrooms) === null || _c === void 0 ? void 0 : _c.toString()) || '0').up();
            details.ele('Bathrooms').txt(((_d = prop.bathrooms) === null || _d === void 0 ? void 0 : _d.toString()) || '0').up();
            details.ele('Garage', { type: 'Parking Space' }).txt(((_e = prop.parkingSpaces) === null || _e === void 0 ? void 0 : _e.toString()) || '0').up();
            const location = listing.ele('Location');
            location.ele('Country', { abbreviation: 'BR' }).txt('Brasil').up();
            location.ele('State', { abbreviation: prop.state || 'SP' }).txt(prop.state || 'São Paulo').up();
            location.ele('City').txt(prop.city || 'São Paulo').up();
            location.ele('PostalCode').txt(prop.zipCode).up();
            location.ele('Address').txt(prop.addressFull).up();
            listing.ele('ContactInfo');
        }
        return root.end({ prettyPrint: true });
    }
};
exports.FeedService = FeedService;
exports.FeedService = FeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeedService);
//# sourceMappingURL=feed.service.js.map