/**
 * Gestion du localStorage
 */

import { state } from "../state/appState.js";

const STORAGE_KEYS = {
  APP_STARTED: "orion-app-started",
  LAST_CATEGORY: "orion-last-category",
  PINNED_CARDS: "orion-pinned-cards",
  CARD_FACES: "orion-card-faces",
};

/**
 * Vérifie si l'application a déjà été démarrée
 */
export function isAppStarted() {
  return localStorage.getItem(STORAGE_KEYS.APP_STARTED) === "true";
}

/**
 * Marque l'application comme démarrée
 */
export function setAppStarted(started = true) {
  if (started) {
    localStorage.setItem(STORAGE_KEYS.APP_STARTED, "true");
  } else {
    localStorage.removeItem(STORAGE_KEYS.APP_STARTED);
  }
}

/**
 * Récupère la dernière catégorie visitée
 */
export function getLastCategory() {
  return localStorage.getItem(STORAGE_KEYS.LAST_CATEGORY);
}

/**
 * Sauvegarde la catégorie courante
 */
export function saveCategory(category) {
  if (category) {
    localStorage.setItem(STORAGE_KEYS.LAST_CATEGORY, category);
  }
}

/**
 * Efface les données de session (retour à l'accueil)
 */
export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.APP_STARTED);
  localStorage.removeItem(STORAGE_KEYS.LAST_CATEGORY);
}

/**
 * Charge l'état des cartes depuis le localStorage
 */
export function loadCardState() {
  try {
    // Charger les cartes épinglées
    const pinnedData = localStorage.getItem(STORAGE_KEYS.PINNED_CARDS);
    if (pinnedData) {
      const pinnedArray = JSON.parse(pinnedData);
      state.pinned = new Set(pinnedArray);
    }

    // Charger les faces des cartes
    const facesData = localStorage.getItem(STORAGE_KEYS.CARD_FACES);
    if (facesData) {
      const facesObject = JSON.parse(facesData);
      state.faceMap = new Map(Object.entries(facesObject).map(([k, v]) => [Number(k), v]));
    }
  } catch (error) {
    console.error("Erreur lors du chargement de l'état des cartes:", error);
  }
}

/**
 * Sauvegarde l'état des cartes dans le localStorage
 */
export function saveCardState() {
  try {
    // Sauvegarder les cartes épinglées
    const pinnedArray = Array.from(state.pinned);
    localStorage.setItem(STORAGE_KEYS.PINNED_CARDS, JSON.stringify(pinnedArray));

    // Sauvegarder les faces des cartes
    const facesObject = {};
    state.faceMap.forEach((face, cardId) => {
      facesObject[cardId] = face;
    });
    localStorage.setItem(STORAGE_KEYS.CARD_FACES, JSON.stringify(facesObject));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'état des cartes:", error);
  }
}
