from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
import asyncio
import logging
from sqlalchemy import create_engine, text
import os

import logging
import sys

# Configure logging to file
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("worker.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("scraper-worker")

app = FastAPI()

# Database Setup
# FIX: Use absolute path to ensure we hit the same DB as the API
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Navigate up to apps/api/dev.db
DB_PATH = os.path.join(BASE_DIR, "..", "api", "dev.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

logging.info(f"Connecting to database at: {DATABASE_URL}")
engine = create_engine(DATABASE_URL)

class SearchRequest(BaseModel):
    searchId: str
    address: str
    zipCode: str = None

async def run_scraper(search_id: str, address: str):
    logger.info(f"Starting scrape for {address} (ID: {search_id})")
    
    import json
    from providers import NominatimProvider, BureauProvider
    
    result_data = {
        "message": "Processamento concluído.",
        "details": []
    }

    try:
        # 1. Geo Search (Nominatim)
        geo_provider = NominatimProvider()
        geo_result = await geo_provider.search(address)
        
        # 2. Enrichment (Bureau)
        bureau_provider = BureauProvider()
        bureau_result = await bureau_provider.search(address)
        
        # Merge Results
        full_address = geo_result.get('data', {}).get('display_name', address)
        owner_data = bureau_result.get('data', {}).get('owner', {})
        inscricao = bureau_result.get('data', {}).get('inscricao_municipal')
        
        # Structure for Frontend
        result_data = {
            "message": f"Imóvel localizado via {geo_result.get('source')}",
            "inscricao": inscricao,
            "address_full": full_address,
            "owner": {
                "name": owner_data.get('name', 'Desconhecido'),
                "cpf": owner_data.get('cpf_masked', '***')
            },
            "details": {
                "geo": geo_result.get('data'),
                "bureau": bureau_result.get('data')
            }
        }
        
    except Exception as e:
        logger.error(f"Orchestration Error: {e}", exc_info=True)
        result_data = {
            "message": "Erro no processamento dos dados.",
            "error": str(e)
        }

    # Update DB
    try:
        with engine.connect() as conn:
            # Update status to COMPLETED and save result
            conn.execute(
                text("UPDATE search_history SET status = 'COMPLETED', resultSummary = :summary WHERE id = :id"),
                {"summary": json.dumps(result_data), "id": search_id}
            )
            conn.commit()
        logger.info(f"Scrape completed for {search_id}")
    except Exception as e:
        logger.error(f"Failed to update DB: {e}", exc_info=True)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "scraper-worker"}

@app.post("/scrape")
async def scrape_endpoint(request: SearchRequest, background_tasks: BackgroundTasks):
    # Update status to PROCESSING immediately
    try:
        with engine.connect() as conn:
            conn.execute(
                text("UPDATE search_history SET status = 'PROCESSING' WHERE id = :id"),
                {"id": request.searchId}
            )
            conn.commit()
    except Exception as e:
        logger.error(f"Failed to set PROCESSING: {e}")
        return {"status": "error", "message": str(e)}

    # Run scraping in background
    background_tasks.add_task(run_scraper, request.searchId, request.address)
    
    return {"status": "accepted", "searchId": request.searchId}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
