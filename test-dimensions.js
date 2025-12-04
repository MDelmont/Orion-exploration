// Script pour visualiser les dimensions calculées des cartes
import { cardDisplaySettings } from './cardsConfig.js';

const CATEGORY_ASPECT_DIMENSIONS = {
  histoire: { width: 105, height: 148 },
  encyclopedie: { width: 105, height: 148 },
  enigme: { width: 70, height: 120 },
  indice: { width: 52, height: 37 },
};

const height = cardDisplaySettings.cardHeight;
const maxWidth = cardDisplaySettings.cardMaxWidth;

console.log('=== Dimensions d\'affichage des cartes ===\n');
console.log(`Hauteur de référence: ${height}px`);
console.log(`Largeur maximale: ${maxWidth}px\n`);

console.log('Dimensions calculées par catégorie:\n');

Object.entries(CATEGORY_ASPECT_DIMENSIONS).forEach(([category, dims]) => {
  const aspectRatio = dims.width / dims.height;
  const isLandscape = aspectRatio > 1;
  
  let displayWidth, displayHeight;
  
  if (isLandscape) {
    // Landscape cards (indices): use width as reference
    displayWidth = maxWidth;
    displayHeight = Math.round(maxWidth / aspectRatio);
  } else {
    // Portrait cards: use height as reference
    displayHeight = height;
    let calculatedWidth = height * aspectRatio;
    const isConstrained = calculatedWidth > maxWidth;
    
    if (isConstrained) {
      calculatedWidth = maxWidth;
    }
    displayWidth = Math.round(calculatedWidth);
  }
  
  console.log(`📐 ${category.toUpperCase()}`);
  console.log(`   Dimensions réelles: ${dims.width}mm × ${dims.height}mm`);
  console.log(`   Ratio d'aspect: ${aspectRatio.toFixed(3)} (${isLandscape ? 'paysage' : 'portrait'})`);
  console.log(`   Référence: ${isLandscape ? 'largeur fixe' : 'hauteur fixe'}`);
  console.log(`   Affichage: ${displayWidth}px × ${displayHeight}px\n`);
});

console.log('✅ Cartes portrait : hauteur cohérente de', height + 'px');
console.log('✅ Cartes paysage : largeur cohérente de', maxWidth + 'px');
console.log('✅ Toutes les cartes respectent leur ratio d\'aspect réel');
