from abc import ABC, abstractmethod
import httpx
import logging
import random
import json

logger = logging.getLogger("scraper-worker")

class SearchProvider(ABC):
    @abstractmethod
    async def search(self, address: str) -> dict:
        pass

class NominatimProvider(SearchProvider):
    """
    OpenStreetMap Nominatim API Provider for Geocoding and Address Data.
    Free to use (with usage limits).
    """
    def __init__(self):
        self.base_url = "https://nominatim.openstreetmap.org/search"
        self.client = httpx.AsyncClient(headers={'User-Agent': 'ImovelIntel-Worker/1.0'})

    async def search(self, address: str) -> dict:
        try:
            logger.info(f"Nominatim: Searching for {address}")
            response = await self.client.get(
                self.base_url,
                params={
                    'q': address,
                    'format': 'json',
                    'addressdetails': 1,
                    'limit': 1,
                    'countrycodes': 'br'
                }
            )
            response.raise_for_status()
            data = response.json()

            if not data:
                return {}

            result = data[0]
            addr = result.get('address', {})
            
            return {
                "source": "Nominatim (OpenStreetMap)",
                "data": {
                    "display_name": result.get('display_name'),
                    "lat": result.get('lat'),
                    "lon": result.get('lon'),
                    "type": result.get('type'),
                    "importance": result.get('importance'),
                    "address_components": {
                        "road": addr.get('road'),
                        "suburb": addr.get('suburb'),
                        "city": addr.get('city') or addr.get('town') or addr.get('municipality'),
                        "state": addr.get('state'),
                        "postcode": addr.get('postcode')
                    }
                }
            }
        except Exception as e:
            logger.error(f"Nominatim Error: {e}")
            return {"error": str(e)}

class BureauProvider(SearchProvider):
    """
    Simulated Bureau Provider (e.g. DataZap, Urbit, Gov APIs).
    Since we don't have real keys, we simulate enrichment based on input.
    """
    async def search(self, address: str) -> dict:
        # Simulate API latency
        import asyncio
        await asyncio.sleep(2)
        
        # Deterministic mock based on address
        mock_names = ["Carlos Silva", "Ana Oliveira", "Roberto Santos", "Fernanda Lima", "Paulo Souza"]
        mock_name = mock_names[len(address) % len(mock_names)]
        
        return {
            "source": "Simulated Bureau (DataZap/Urbit API)",
            "data": {
                "inscricao_municipal": f"{random.randint(10000,99999)}.{random.randint(10,99)}-{random.randint(0,9)}",
                "area_total": f"{random.randint(50, 500)} m²",
                "valor_venal": f"R$ {random.randint(200, 2000)}.{random.randint(0,999)},00",
                "owner": {
                    "name": mock_name,
                    "cpf_masked": f"***.{random.randint(100,999)}.{random.randint(100,999)}-**",
                    "status": "Regular"
                }
            }
        }
