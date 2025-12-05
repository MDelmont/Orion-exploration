/**
 * Gestion de l'état global de l'application
 */

import cardsConfig, { cardDisplaySettings } from "../../cardsConfig.js";

// État global de l'application
export const state = {
  currentCategory: "histoire",
  pinned: new Set(),
  faceMap: new Map(),
  inspectedCardId: null,
};

// Map des cartes par ID pour accès rapide
export const cardsById = new Map(cardsConfig.map((card) => [card.id, card]));

// Cache des éléments DOM
export const elements = {};

// État de la vue d'inspection
export const inspectionViewState = {
  rotationX: -6,
  rotationY: 0,
  scale: 1,
  minScale: 0.65,
  maxScale: 2.4,
  pointerPositions: new Map(),
  pinchDistance: 0,
  isDragging: false,
  lastPointerX: 0,
  lastPointerY: 0,
};

// Set des sources d'images préchargées
export const preloadedSources = new Set();

// Réexporter pour faciliter l'accès
export { cardsConfig, cardDisplaySettings };

/**
 * Met à jour la catégorie courante
 */
export function setCurrentCategory(category) {
  state.currentCategory = category;
}

/**
 * Définit l'ID de la carte inspectée
 */
export function setInspectedCardId(cardId) {
  state.inspectedCardId = cardId;
}

/**
 * Récupère une carte par son ID
 */
export function getCardById(cardId) {
  return cardsById.get(cardId);
}

/**
 * Vérifie si une carte est épinglée
 */
export function isPinned(cardId) {
  return state.pinned.has(cardId);
}

/**
 * Ajoute ou retire une carte des épinglées
 */
export function togglePinned(cardId) {
  if (state.pinned.has(cardId)) {
    state.pinned.delete(cardId);
    return false;
  } else {
    state.pinned.add(cardId);
    return true;
  }
}

/**
 * Récupère la face visible d'une carte
 */
export function getCardFace(cardId) {
  return state.faceMap.get(cardId) || "verso";
}

/**
 * Définit la face visible d'une carte
 */
export function setCardFace(cardId, face) {
  state.faceMap.set(cardId, face);
}

/**
 * Cache un élément DOM dans le cache global
 */
export function cacheElement(key, element) {
  elements[key] = element;
}
