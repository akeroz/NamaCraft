import os
import asyncio
import json
from typing import List, Optional
from emergentintegrations.llm.chat import LlmChat, UserMessage
from dotenv import load_dotenv

load_dotenv()

class NameGeneratorService:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not self.api_key:
            raise ValueError("EMERGENT_LLM_KEY not found in environment variables")
    
    def _build_prompt(self, description: str, industry: Optional[str] = None, style: Optional[str] = None, count: int = 12) -> str:
        """Construit un prompt optimisé pour générer des noms modernes d'apps/SaaS"""
        
        # Exemples de référence de noms modernes
        example_names = ["clarq", "sage", "emma", "sonnie", "cluely", "notion", "slack", "figma", "vercel", "linear"]
        
        prompt = f"""Tu es un expert en création de noms de marques modernes pour apps et SaaS.

MISSION: Génère {count} noms uniques et modernes pour cette app/SaaS:
"{description}"

CARACTÉRISTIQUES REQUISES:
- Noms courts (4-8 lettres idéalement)  
- Sonorité moderne et mémorable
- Facile à prononcer et épeler
- Style contemporain comme: {', '.join(example_names[:7])}
- Éviter les mots génériques ou trop descriptifs
- Créer des noms inventés mais naturels
- Mélange de consonnes/voyelles harmonieux

"""
        
        if industry:
            industry_hints = {
                'tech': 'avec une connotation technologique subtile',
                'finance': 'évoquant la confiance et la modernité financière', 
                'healthcare': 'avec une touche de bien-être et soin',
                'education': 'suggérant l\'apprentissage et la croissance',
                'ecommerce': 'évoquant le commerce et l\'échange',
                'marketing': 'avec une connotation créative et impactante',
                'productivity': 'suggérant l\'efficacité et l\'optimisation',
                'creative': 'avec une touche artistique et innovante'
            }
            prompt += f"CONTEXTE INDUSTRIE: {industry_hints.get(industry, '')}\\n"
        
        if style:
            style_hints = {
                'modern': 'privilégier les terminaisons en -ly, -x, -r, -q',
                'minimalist': 'noms ultra-courts et épurés (4-5 lettres)',
                'playful': 'avec des sonorités ludiques et enjouées', 
                'professional': 'évoquant sérieux et expertise',
                'creative': 'noms inventifs avec des combinaisons inattendues',
                'tech': 'avec des consonnes fortes et terminaisons tech'
            }
            prompt += f"STYLE: {style_hints.get(style, '')}\\n"
        
        prompt += f"""
FORMAT RÉPONSE: Réponds uniquement avec une liste JSON de {count} noms, sans autre texte:
["nom1", "nom2", "nom3", ...]

EXEMPLES D'INSPIRATION: clarq, sage, emma, sonnie, cluely, ryze, flux, qlix, vexo, nexu"""
        
        return prompt
    
    async def generate_names(
        self, 
        description: str, 
        industry: Optional[str] = None, 
        style: Optional[str] = None, 
        count: int = 12
    ) -> List[str]:
        """Génère des noms d'apps/SaaS via IA"""
        
        try:
            # Initialiser le chat IA
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"name-gen-{asyncio.get_event_loop().time()}",
                system_message="Tu es un expert en naming créatif pour apps et SaaS modernes."
            ).with_model("openai", "gpt-4o-mini")
            
            # Créer le prompt personnalisé
            prompt = self._build_prompt(description, industry, style, count)
            
            # Envoyer la requête à l'IA
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            # Parser la réponse JSON
            try:
                names_list = json.loads(response.strip())
                if isinstance(names_list, list):
                    # Filtrer et nettoyer les noms
                    clean_names = []
                    for name in names_list:
                        if isinstance(name, str) and len(name.strip()) > 0:
                            clean_name = name.strip().lower()
                            # Capitaliser première lettre
                            clean_name = clean_name[0].upper() + clean_name[1:] if len(clean_name) > 1 else clean_name.upper()
                            if clean_name not in clean_names:  # Éviter doublons
                                clean_names.append(clean_name)
                    
                    return clean_names[:count]  # S'assurer du nombre demandé
                else:
                    raise ValueError("Response is not a list")
                    
            except (json.JSONDecodeError, ValueError) as e:
                # Fallback: extraire les noms du texte si JSON échoue
                return self._extract_names_from_text(response, count)
                
        except Exception as e:
            # En cas d'erreur IA, retourner des noms de fallback
            return self._generate_fallback_names(description, count)
    
    def _extract_names_from_text(self, text: str, count: int) -> List[str]:
        """Extrait les noms depuis du texte si le parsing JSON échoue"""
        import re
        
        # Chercher des mots courts qui ressemblent à des noms d'apps
        words = re.findall(r'\b[A-Za-z]{3,8}\b', text)
        names = []
        
        for word in words:
            if len(word) >= 3 and word.lower() not in ['the', 'and', 'for', 'app', 'saas', 'name', 'brand']:
                formatted_name = word[0].upper() + word[1:].lower()
                if formatted_name not in names:
                    names.append(formatted_name)
                if len(names) >= count:
                    break
        
        # Si pas assez de noms trouvés, compléter avec fallback
        if len(names) < count:
            names.extend(self._generate_fallback_names("", count - len(names)))
        
        return names[:count]
    
    def _generate_fallback_names(self, description: str, count: int) -> List[str]:
        """Génère des noms de fallback si l'IA échoue"""
        fallback_patterns = [
            "Qlix", "Vexo", "Nexu", "Ryze", "Flux", "Zura", "Kliq", "Onyx",
            "Apex", "Prox", "Zeal", "Vibe", "Echo", "Nova", "Luma", "Koda",
            "Fixa", "Valo", "Mira", "Trix", "Lyra", "Axel", "Vera", "Zeta"
        ]
        
        # Prendre des noms aléatoires du pattern de fallback
        import random
        selected = random.sample(fallback_patterns, min(count, len(fallback_patterns)))
        
        # Si besoin de plus de noms, en générer avec variations
        if count > len(selected):
            base_names = ["Qlix", "Vexo", "Nexu", "Ryze", "Flux"]
            suffixes = ["ly", "x", "r", "o", "a"]
            
            for i in range(count - len(selected)):
                base = random.choice(base_names)
                suffix = random.choice(suffixes)
                new_name = base[:-1] + suffix
                selected.append(new_name.capitalize())
        
        return selected[:count]