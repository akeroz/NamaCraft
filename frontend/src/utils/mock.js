// Mock data pour la génération de noms
// Simule l'IA qui génère des noms modernes comme clarq, sage, emma, sonnie, cluely

const namePatterns = {
  // Noms courts et modernes
  short: [
    'Qlix', 'Vexo', 'Zura', 'Kliq', 'Nexu', 'Ryze', 'Flux', 'Onyx', 
    'Apex', 'Prox', 'Zeal', 'Vibe', 'Echo', 'Nova', 'Luma', 'Koda',
    'Fixa', 'Valo', 'Mira', 'Trix', 'Lyra', 'Axel', 'Vera', 'Zeta'
  ],
  
  // Noms avec suffixes modernes
  suffixed: [
    'Clariq', 'Sagely', 'Emmix', 'Sonify', 'Cluety', 'Veraly', 'Nexify',
    'Fluxly', 'Vixely', 'Rythmly', 'Prestly', 'Questly', 'Swiftly', 'Craftly',
    'Brightli', 'Smartli', 'Quickli', 'Sleekly', 'Freshli', 'Cleanli'
  ],

  // Noms inspirés des apps actuelles
  modern: [
    'Clarix', 'Sagex', 'Emmly', 'Sonnix', 'Cluex', 'Verax', 'Nexar',
    'Fluxr', 'Vixly', 'Rythr', 'Presto', 'Questo', 'Swiftr', 'Craftr',
    'Brightr', 'Smartr', 'Quickr', 'Sleekr', 'Freshr', 'Cleanr'
  ],

  // Noms créatifs avec voyelles modifiées
  creative: [
    'Claroq', 'Sageo', 'Emmax', 'Sonniq', 'Cluexa', 'Veralo', 'Nexaro',
    'Fluxeo', 'Vixaro', 'Rythmo', 'Prestiq', 'Questax', 'Swiftex', 'Craftex',
    'Brightex', 'Smartex', 'Quickex', 'Sleekex', 'Freshex', 'Cleanex'
  ]
};

const industryKeywords = {
  tech: ['Tech', 'Code', 'Data', 'Cloud', 'Dev', 'Digital', 'Cyber', 'AI', 'Logic', 'Pixel'],
  finance: ['Pay', 'Coin', 'Vault', 'Cash', 'Fund', 'Invest', 'Crypto', 'Bank', 'Wallet', 'Trade'],
  healthcare: ['Care', 'Health', 'Med', 'Vita', 'Cure', 'Heal', 'Bio', 'Life', 'Pulse', 'Wellness'],
  education: ['Learn', 'Study', 'Edu', 'Mind', 'Brain', 'Know', 'Skill', 'Course', 'Class', 'Academy'],
  ecommerce: ['Shop', 'Cart', 'Buy', 'Sell', 'Store', 'Market', 'Commerce', 'Trade', 'Retail', 'Purchase'],
  marketing: ['Brand', 'Promo', 'Campaign', 'Ads', 'Social', 'Content', 'Influence', 'Reach', 'Engage', 'Convert'],
  productivity: ['Task', 'Flow', 'Boost', 'Focus', 'Sync', 'Organize', 'Plan', 'Schedule', 'Manage', 'Optimize'],
  creative: ['Design', 'Art', 'Create', 'Studio', 'Canvas', 'Craft', 'Make', 'Build', 'Draw', 'Sketch']
};

const styleModifiers = {
  modern: (name) => name,
  minimalist: (name) => name.toLowerCase(),
  playful: (name) => name + (Math.random() > 0.5 ? 'o' : 'y'),
  professional: (name) => name + (Math.random() > 0.5 ? 'Pro' : 'Hub'),
  creative: (name) => name.replace(/[aeiou]/g, (match) => {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return vowels[Math.floor(Math.random() * vowels.length)];
  }),
  tech: (name) => name + (Math.random() > 0.5 ? 'X' : 'Z')
};

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateContextualNames(description, industry, count = 4) {
  const names = [];
  const keywords = industry ? industryKeywords[industry] || [] : [];
  
  // Génère des noms basés sur les mots-clés de l'industrie
  if (keywords.length > 0) {
    const selectedKeywords = getRandomItems(keywords, Math.min(count, keywords.length));
    selectedKeywords.forEach(keyword => {
      const suffixes = ['ly', 'ify', 'x', 'r', 'o', 'a', 'i'];
      const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      names.push(keyword + randomSuffix);
    });
  }
  
  return names;
}

export function getMockNames(description, industry, style) {
  const allPatterns = Object.values(namePatterns).flat();
  let selectedNames = getRandomItems(allPatterns, 8);
  
  // Ajouter des noms contextuels basés sur l'industrie
  if (industry) {
    const contextualNames = generateContextualNames(description, industry, 4);
    selectedNames = [...selectedNames.slice(0, 6), ...contextualNames];
  }
  
  // Appliquer le modificateur de style
  if (style && styleModifiers[style]) {
    selectedNames = selectedNames.map(name => styleModifiers[style](name));
  }
  
  // Mélanger et retourner 12 noms uniques
  return [...new Set(selectedNames)].slice(0, 12);
}