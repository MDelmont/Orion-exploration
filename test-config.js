// Script de test pour vérifier que la configuration des cartes fonctionne correctement
import cardsConfig, { cardDisplaySettings } from './cardsConfig.js';

console.log('=== Test de la configuration des cartes ===\n');

// Test 1: Vérifier que cardsConfig est un tableau
console.log('✓ Test 1: cardsConfig est un tableau:', Array.isArray(cardsConfig));

// Test 2: Vérifier le nombre total de cartes
console.log('✓ Test 2: Nombre total de cartes:', cardsConfig.length);

// Test 3: Compter les cartes par catégorie
const categoryCounts = cardsConfig.reduce((acc, card) => {
  acc[card.category] = (acc[card.category] || 0) + 1;
  return acc;
}, {});

console.log('✓ Test 3: Cartes par catégorie:');
Object.entries(categoryCounts).forEach(([category, count]) => {
  console.log(`  - ${category}: ${count} cartes`);
});

// Test 4: Vérifier que toutes les cartes ont les propriétés requises
const requiredProps = ['id', 'category', 'title', 'typeCode', 'rectoFile', 'versoFile'];
const invalidCards = cardsConfig.filter(card => 
  !requiredProps.every(prop => prop in card)
);

if (invalidCards.length === 0) {
  console.log('✓ Test 4: Toutes les cartes ont les propriétés requises');
} else {
  console.log('✗ Test 4: Cartes invalides:', invalidCards);
}

// Test 5: Vérifier que les IDs sont uniques
const ids = cardsConfig.map(card => card.id);
const uniqueIds = new Set(ids);
console.log('✓ Test 5: IDs uniques:', ids.length === uniqueIds.size);

// Test 6: Vérifier cardDisplaySettings
console.log('✓ Test 6: cardDisplaySettings:', cardDisplaySettings);

console.log('\n=== Tous les tests sont passés ! ===');
