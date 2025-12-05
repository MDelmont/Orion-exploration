/**
 * Module de construction des cartes
 */

import { state, getCardFace, cardsConfig, cardDisplaySettings } from "../../state/appState.js";
import { CATEGORY_LABELS, CATEGORY_FOLDERS, CATEGORY_ASPECT_DIMENSIONS, ICONS } from "../../config/constants.js";
import { disableSelection, preloadSrc } from "../../utils/dom.js";

/**
 * Formate le titre d'une carte
 */
export function formatCardTitle(card) {
  if (card.category === "encyclopedie" || card.category === "indice") {
    return card.title;
  }
  return `Carte ${card.category} n°${card.number}`;
}

/**
 * Construit le chemin de l'image d'une carte
 */
export function buildImageSrc(card, face) {
  const folder = CATEGORY_FOLDERS[card.category];
  if (!folder) {
    return "";
  }
  return `${folder}${face === "recto" ? card.rectoFile : card.versoFile}`;
}

/**
 * Précharge les images d'une carte (recto et verso)
 */
export function preloadCardImages(card) {
  preloadSrc(buildImageSrc(card, "recto"));
  preloadSrc(buildImageSrc(card, "verso"));
}

/**
 * Définit l'icône d'épingle sur un bouton
 */
export function setPinIcon(button, isPinned) {
  if (!button) {
    return;
  }
  button.innerHTML = isPinned ? ICONS.pinFilled : ICONS.pinOutline;
}

/**
 * Construit un élément de carte
 */
export function buildCardElement(card, { onFlip, onPin, onInspect }) {
  const face = getCardFace(card.id);
  const article = document.createElement("article");
  article.className = "card";
  article.dataset.cardId = card.id;
  disableSelection(article);

  const title = document.createElement("h3");
  title.textContent = formatCardTitle(card);
  article.appendChild(title);

  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.innerHTML = `<span>${CATEGORY_LABELS[card.category] || ""}</span><span>${face === "recto" ? "Recto" : "Verso"}</span>`;
  article.appendChild(meta);

  const image = document.createElement("img");
  image.src = buildImageSrc(card, face);
  image.alt = `${card.title} (${face})`;
  image.dataset.currentSrc = image.src;
  image.addEventListener("click", () => onFlip && onFlip(card.id));
  article.appendChild(image);
  preloadCardImages(card);

  const actions = document.createElement("div");
  actions.className = "card-actions";

  // Bouton retourner
  const flipButton = document.createElement("button");
  flipButton.type = "button";
  flipButton.innerHTML = ICONS.flip;
  flipButton.setAttribute("aria-label", "Retourner la carte");
  flipButton.title = "Retourner";
  flipButton.addEventListener("click", () => onFlip && onFlip(card.id));
  actions.appendChild(flipButton);

  // Bouton épingler (sauf pour les indices)
  if (card.category !== "indice") {
    const pinButton = document.createElement("button");
    pinButton.type = "button";
    pinButton.dataset.action = "pin";
    const isPinned = state.pinned.has(card.id);
    setPinIcon(pinButton, isPinned);
    pinButton.setAttribute(
      "aria-label",
      isPinned ? "Retirer des épinglées" : "Épingler cette carte"
    );
    pinButton.title = isPinned ? "Retirer des épinglées" : "Épingler";
    pinButton.classList.toggle("pin-active", isPinned);
    pinButton.addEventListener("click", () => onPin && onPin(card.id));
    actions.appendChild(pinButton);
  }

  // Bouton inspecter
  const inspectButton = document.createElement("button");
  inspectButton.type = "button";
  inspectButton.innerHTML = ICONS.inspect;
  inspectButton.setAttribute("aria-label", "Inspecter la carte");
  inspectButton.title = "Inspecter";
  inspectButton.addEventListener("click", () => onInspect && onInspect(card.id));
  actions.appendChild(inspectButton);

  article.appendChild(actions);
  return article;
}

/**
 * Applique les paramètres d'affichage des cartes
 */
export function applyDisplaySettings() {
  const height = cardDisplaySettings?.cardHeight || 420;
  const maxWidth = cardDisplaySettings?.cardMaxWidth || 350;
  
  document.documentElement.style.setProperty("--card-image-height", `${height}px`);
  document.documentElement.style.setProperty("--card-max-width", `${maxWidth}px`);
  
  Object.entries(CATEGORY_ASPECT_DIMENSIONS).forEach(([category, dims]) => {
    const aspectRatio = dims.width / dims.height;
    let calculatedWidth = height * aspectRatio;
    
    if (calculatedWidth > maxWidth) {
      calculatedWidth = maxWidth;
    }
    
    document.documentElement.style.setProperty(
      `--card-width-${category}`,
      `${Math.round(calculatedWidth)}px`
    );
  });
}

/**
 * Récupère les cartes pour la catégorie courante
 */
export function getCardsForCurrentCategory() {
  if (state.currentCategory === "carte") {
    return [];
  }

  if (state.currentCategory === "epinglees") {
    return cardsConfig.filter((card) => state.pinned.has(card.id));
  }

  return cardsConfig.filter(
    (card) => card.category === state.currentCategory
  );
}
