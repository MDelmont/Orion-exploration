/**
 * Module des actions sur les cartes
 */

import { state, elements, getCardFace, setCardFace, getCardById } from "../../state/appState.js";
import { FLIP_ANIMATION_MS } from "../../config/constants.js";
import { setImageSource } from "../../utils/dom.js";
import { saveCardState } from "../../utils/storage.js";
import { buildImageSrc, setPinIcon } from "./cardBuilder.js";

let updateInspectionCallback = null;
let renderSidebarCallback = null;
let renderMainAreaCallback = null;
let snapInspectionToFaceCallback = null;

/**
 * Définit les callbacks nécessaires aux actions
 */
export function setCardActionCallbacks({
  updateInspection,
  renderSidebar,
  renderMainArea,
  snapInspectionToFace
}) {
  updateInspectionCallback = updateInspection;
  renderSidebarCallback = renderSidebar;
  renderMainAreaCallback = renderMainArea;
  snapInspectionToFaceCallback = snapInspectionToFace;
}

/**
 * Récupère les conteneurs de cartes
 */
function getCardContainer() {
  return state.currentCategory === "solutions"
    ? elements.solutionsContainer
    : elements.cardsContainer;
}

/**
 * Récupère l'élément DOM d'une carte
 */
export function getCardElement(cardId) {
  const container = getCardContainer();
  if (!container) {
    return null;
  }
  return container.querySelector(`.card[data-card-id="${cardId}"]`);
}

/**
 * Récupère l'élément image d'une carte
 */
export function getCardImageElement(cardId) {
  return getCardElement(cardId)?.querySelector("img") ?? null;
}

/**
 * Récupère tous les éléments d'une carte
 */
export function getCardElements(cardId) {
  const container = getCardContainer();
  if (!container) {
    return [];
  }
  return Array.from(container.querySelectorAll(`.card[data-card-id="${cardId}"]`));
}

/**
 * Récupère toutes les images d'une carte
 */
export function getCardImageElements(cardId) {
  return getCardElements(cardId)
    .map(el => el.querySelector("img"))
    .filter(img => img !== null);
}

/**
 * Retourne une carte (flip)
 */
export function toggleFace(cardId) {
  const currentFace = getCardFace(cardId);
  const nextFace = currentFace === "recto" ? "verso" : "recto";
  setCardFace(cardId, nextFace);
  
  const shouldSnapInspection = state.inspectedCardId === cardId;
  const images = getCardImageElements(cardId);

  const finalizeFaceUpdate = () => {
    updateCardFace(cardId);
    if (updateInspectionCallback) updateInspectionCallback();
    if (shouldSnapInspection && snapInspectionToFaceCallback) {
      snapInspectionToFaceCallback(nextFace);
    }
    if (renderSidebarCallback) renderSidebarCallback();
    saveCardState();
  };

  if (images.length > 0) {
    images.forEach(img => img.classList.add("is-flipping"));
    setTimeout(finalizeFaceUpdate, FLIP_ANIMATION_MS / 2);
    setTimeout(() => {
      images.forEach(img => img.classList.remove("is-flipping"));
    }, FLIP_ANIMATION_MS);
  } else {
    finalizeFaceUpdate();
  }
}

/**
 * Met à jour visuellement la face d'une carte
 */
export function updateCardFace(cardId) {
  const card = getCardById(cardId);
  if (!card) return;
  
  const cardElements = getCardElements(cardId);
  if (cardElements.length === 0) return;
  
  const face = getCardFace(cardId);

  cardElements.forEach(cardElement => {
    const img = cardElement.querySelector("img");
    if (img) {
      setImageSource(img, buildImageSrc(card, face), `${card.title} (${face})`);
    }
    const faceLabel = cardElement.querySelector(".card-meta span:last-child");
    if (faceLabel) {
      faceLabel.textContent = face === "recto" ? "Recto" : "Verso";
    }
  });
}

/**
 * Épingle ou désépingle une carte
 */
export function togglePin(cardId) {
  if (state.pinned.has(cardId)) {
    state.pinned.delete(cardId);
  } else {
    state.pinned.add(cardId);
  }

  if (state.currentCategory === "epinglees") {
    if (renderMainAreaCallback) renderMainAreaCallback();
  } else {
    updatePinButtons(cardId);
  }

  if (renderSidebarCallback) renderSidebarCallback();
  if (updateInspectionCallback) updateInspectionCallback();
  saveCardState();
}

/**
 * Met à jour les boutons d'épingle pour une carte
 */
export function updatePinButtons(cardId) {
  const container = getCardContainer();
  if (!container) return;

  const cardElements = container.querySelectorAll(`.card[data-card-id="${cardId}"]`);
  const isPinned = state.pinned.has(cardId);

  cardElements.forEach(cardElement => {
    const pinButton = cardElement.querySelector('button[data-action="pin"]');
    if (pinButton) {
      setPinIcon(pinButton, isPinned);
      pinButton.setAttribute(
        "aria-label",
        isPinned ? "Retirer des épinglées" : "Épingler cette carte"
      );
      pinButton.title = isPinned ? "Retirer des épinglées" : "Épingler";
      pinButton.classList.toggle("pin-active", isPinned);
    }
  });
}

/**
 * Fait défiler jusqu'à une carte et la met en surbrillance
 */
export function focusCard(cardId) {
  if (state.currentCategory === "carte") return;
  
  const target = elements.cardsContainer?.querySelector(
    `.card[data-card-id="${cardId}"]`
  );
  
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("active");
    setTimeout(() => target.classList.remove("active"), 1200);
  }
}
