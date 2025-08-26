# Contrats API - NamaCraft

## Vue d'ensemble
Remplacement des données mock par une vraie génération IA avec Emergent LLM pour créer des noms modernes et uniques.

## API Contracts

### POST /api/generate-names
**Description:** Génère des noms d'apps/SaaS avec IA

**Request Body:**
```json
{
  "description": "string (requis)",
  "industry": "string (optionnel)", 
  "style": "string (optionnel)",
  "count": "number (défaut: 12)"
}
```

**Response:**
```json
{
  "names": ["string[]"],
  "generated_count": "number"
}
```

## Données Mock actuelles à remplacer

### Fichier: `/app/frontend/src/utils/mock.js`
- **Fonction `getMockNames()`** → Sera remplacée par appel API réel
- **Patterns de noms** → Sera généré par IA basé sur description

### Composant: `/app/frontend/src/components/NameGenerator.jsx`
- **Ligne ~47-58** : `setTimeout(() => { const mockNames = getMockNames(...) })` 
- **Remplacer par** : Appel API réel vers `/api/generate-names`

## Backend Implementation Plan

1. **Intégration Emergent LLM**
   - Installer librairie emergentintegrations 
   - Configurer clé EMERGENT_LLM_KEY
   - Utiliser GPT-4 ou Claude pour génération créative

2. **Endpoint `/api/generate-names`**
   - Validation des inputs
   - Prompt engineering pour noms modernes
   - Génération via IA
   - Post-traitement des résultats

3. **Prompt Strategy**
   - Analyser style des noms modernes (clarq, sage, emma, sonnie, cluely)
   - Créer prompts contextuels basés sur description + industrie + style
   - Assurer unicité et modernité des noms générés

## Frontend Integration

### Modifications requises:
1. **NameGenerator.jsx** - Remplacer mock par fetch API
2. **Supprimer mock.js** après intégration
3. **Gestion d'erreurs** API dans le frontend
4. **Loading states** pendant génération IA

## Testing Plan
1. Test backend endpoint indépendamment
2. Test intégration frontend-backend  
3. Validation qualité des noms générés
4. Test des cas d'erreur