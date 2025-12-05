/**
 * Module de rendu des cartes
 */

import { state, elements } from "../../state/appState.js";
import { setHidden } from "../../utils/dom.js";
import { getCardsForCurrentCategory, buildCardElement } from "./cardBuilder.js";
import { toggleFace, togglePin } from "./cardActions.js";

let openInspectionCallback = null;

/**
 * Définit le callback d'ouverture de l'inspection
 */
export function setOpenInspectionCallback(callback) {
  openInspectionCallback = callback;
}

/**
 * Rend la zone principale avec les cartes
 */
export function renderCards() {
  const cards = getCardsForCurrentCategory();
  elements.cardsContainer.innerHTML = "";

  if (!cards.length) {
    setHidden(elements.cardsEmpty, false);
    return;
  }

  setHidden(elements.cardsEmpty, true);
  
  cards.forEach((card) => {
    const cardElement = buildCardElement(card, {
      onFlip: toggleFace,
      onPin: togglePin,
      onInspect: openInspectionCallback
    });
    elements.cardsContainer.appendChild(cardElement);
  });
}

/**
 * Cache les éléments DOM des cartes
 */
export function cacheCardElements() {
  elements.cardsSection = document.getElementById("cards-section");
  elements.cardsContainer = document.getElementById("cards-container");
  elements.cardsEmpty = document.getElementById("cards-empty");
  elements.cardsBackToTop = document.getElementById("cards-back-to-top");
}
