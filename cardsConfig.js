// Import des configurations de cartes par thème
import encyclopedieCards from './config/encyclopedie.js';
import enigmeCards from './config/enigme.js';
import histoireCards from './config/histoire.js';
import indicesCards from './config/indice.js';

// Combinaison de toutes les cartes
const cardsConfig = [
  ...encyclopedieCards,
  ...enigmeCards,
  ...histoireCards,
  ...indicesCards
];

export const cardDisplaySettings = {
  cardHeight: 450,      // Hauteur de référence en pixels
  cardMaxWidth: 350,    // Largeur maximale pour éviter les cartes trop larges (ex: indices)
};

export default cardsConfig;
