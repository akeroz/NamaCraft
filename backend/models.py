from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class NameGenerationRequest(BaseModel):
    description: str = Field(..., min_length=1, max_length=1000, description="Description de l'app ou SaaS")
    industry: Optional[str] = Field(None, description="Industrie (optionnel)")
    style: Optional[str] = Field(None, description="Style des noms (optionnel)")
    count: int = Field(12, ge=1, le=20, description="Nombre de noms à générer")

class NameGenerationResponse(BaseModel):
    names: List[str] = Field(..., description="Liste des noms générés")
    generated_count: int = Field(..., description="Nombre de noms réellement générés")

class GenerationHistory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    description: str
    industry: Optional[str] = None
    style: Optional[str] = None
    generated_names: List[str]
    timestamp: datetime = Field(default_factory=datetime.utcnow)