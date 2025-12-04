// Script pour générer automatiquement la configuration des cartes indices
import fs from 'fs';
import path from 'path';

const indicesDir = './images/cartes/indices';
const files = fs.readdirSync(indicesDir);

// Filtrer uniquement les fichiers recto (I_R_*.svg)
const rectoFiles = files.filter(f => f.startsWith('I_R_') && f.endsWith('.svg'));

// Extraire les noms de cartes uniques
const cardNames = new Set();
rectoFiles.forEach(file => {
  // Extraire le nom de la carte (ex: "15-S" de "I_R_15-S.svg")
  const match = file.match(/I_R_(.+)\.svg/);
  if (match) {
    cardNames.add(match[1]);
  }
});

// Trier les noms de cartes
const sortedCardNames = Array.from(cardNames).sort((a, b) => {
  // Extraire les parties numériques et textuelles pour un tri intelligent
  const parseCardName = (name) => {
    const match = name.match(/^(\d+|T)-(.+)$/);
    if (match) {
      const num = match[1] === 'T' ? 999 : parseInt(match[1]);
      return [num, match[2]];
    }
    return [0, name];
  };
  
  const [numA, suffixA] = parseCardName(a);
  const [numB, suffixB] = parseCardName(b);
  
  if (numA !== numB) return numA - numB;
  return suffixA.localeCompare(suffixB);
});

// Générer la configuration
const indicesCards = sortedCardNames.map((cardName, index) => {
  const rectoFile = `I_R_${cardName}.svg`;
  const versoFile = `I_V_${cardName}.svg`;
  
  // Vérifier que le verso existe
  const versoPath = path.join(indicesDir, versoFile);
  if (!fs.existsSync(versoPath)) {
    console.warn(`⚠️  Attention: Le verso n'existe pas pour ${cardName}`);
  }
  
  return {
    id: 100 + index, // Commencer à 100 pour éviter les conflits avec les autres cartes
    category: "indice",
    title: `Indice ${cardName}`,
    typeCode: "I",
    rectoFile: `indices/${rectoFile}`,
    versoFile: `indices/${versoFile}`,
    number: null
  };
});

console.log(`✓ ${indicesCards.length} cartes indices trouvées`);
console.log('\nConfiguration générée:\n');
console.log('const indicesCards = ' + JSON.stringify(indicesCards, null, 2) + ';\n');
console.log('export default indicesCards;');
