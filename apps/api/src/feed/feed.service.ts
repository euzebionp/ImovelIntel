import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { create } from 'xmlbuilder2';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async generateZapFeed() {
    const properties = await this.prisma.property.findMany({
      where: { status: 'PUBLISHED' }, // Assumption: only published properties
      include: {
        owners: true
      }
    });

    const root = create({ version: '1.0', encoding: 'UTF-8' })
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
      details.ele('ListPrice', { currency: 'BRL' }).txt(prop.price?.toString() || '0').up();
      details.ele('LivingArea', { unit: 'square metres' }).txt(prop.areaUsable?.toString() || '0').up();
      details.ele('Bedrooms').txt(prop.bedrooms?.toString() || '0').up();
      details.ele('Bathrooms').txt(prop.bathrooms?.toString() || '0').up();
      details.ele('Garage', { type: 'Parking Space' }).txt(prop.parkingSpaces?.toString() || '0').up();
      
      const location = listing.ele('Location');
      location.ele('Country', { abbreviation: 'BR' }).txt('Brasil').up();
      location.ele('State', { abbreviation: prop.state || 'SP' }).txt(prop.state || 'São Paulo').up();
      location.ele('City').txt(prop.city || 'São Paulo').up();
      location.ele('PostalCode').txt(prop.zipCode).up();
      location.ele('Address').txt(prop.addressFull).up();
      
      listing.ele('ContactInfo'); // Placeholder
    }

    return root.end({ prettyPrint: true });
  }
}
