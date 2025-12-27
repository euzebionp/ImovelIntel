import { Controller, Get } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController {
  @Get('stats')
  getStats() {
    return {
      totalSearches: 1284,
      propertiesFound: 856,
      creditsAvailable: 450.00,
      newClients: 24,
      searchesChange: "+12.5%",
      propertiesChange: "+8.2%",
      creditsChange: "-2.4%",
      clientsChange: "+4.1%"
    };
  }

  @Get('recent')
  getRecentActivity() {
    return [
      { id: 1, address: "Rua das Flores, 123 - Centro", time: "2 horas", city: "São Paulo, SP", status: "Encontrado" },
      { id: 2, address: "Av. Paulista, 1000", time: "4 horas", city: "São Paulo, SP", status: "Encontrado" },
      { id: 3, address: "Rua Oscar Freire, 500", time: "6 horas", city: "São Paulo, SP", status: "Encontrado" },
      { id: 4, address: "Alameda Santos, 200", time: "8 horas", city: "São Paulo, SP", status: "Encontrado" }
    ];
  }
}
