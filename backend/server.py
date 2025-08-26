from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

# Import our models and services
from models import NameGenerationRequest, NameGenerationResponse, GenerationHistory
from services.name_generator import NameGeneratorService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Initialize AI Name Generator Service
name_generator_service = NameGeneratorService()

# Legacy models for compatibility
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Legacy routes
@api_router.get("/")
async def root():
    return {"message": "NamaCraft API - Générateur de noms modernes pour apps et SaaS"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# NEW: Name Generation Routes
@api_router.post("/generate-names", response_model=NameGenerationResponse)
async def generate_names(request: NameGenerationRequest):
    """Génère des noms d'apps/SaaS modernes avec IA"""
    try:
        # Validation basique
        if not request.description.strip():
            raise HTTPException(status_code=400, detail="La description est requise")
        
        # Générer les noms avec l'IA
        generated_names = await name_generator_service.generate_names(
            description=request.description,
            industry=request.industry,
            style=request.style,
            count=request.count
        )
        
        # Sauvegarder l'historique en base
        history_record = GenerationHistory(
            description=request.description,
            industry=request.industry,
            style=request.style,
            generated_names=generated_names
        )
        
        try:
            await db.generation_history.insert_one(history_record.dict())
        except Exception as db_error:
            # Log l'erreur mais continue (pas critique)
            logging.error(f"Erreur sauvegarde historique: {db_error}")
        
        return NameGenerationResponse(
            names=generated_names,
            generated_count=len(generated_names)
        )
        
    except Exception as e:
        logging.error(f"Erreur génération noms: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Erreur lors de la génération des noms: {str(e)}"
        )

@api_router.get("/generation-history")
async def get_generation_history(limit: int = 10):
    """Récupère l'historique des générations récentes"""
    try:
        history = await db.generation_history.find().sort("timestamp", -1).limit(limit).to_list(limit)
        return [GenerationHistory(**record) for record in history]
    except Exception as e:
        logging.error(f"Erreur récupération historique: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur récupération historique")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()