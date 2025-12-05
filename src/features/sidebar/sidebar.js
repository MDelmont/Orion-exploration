/**
 * Module de la barre latérale
 */

import { state, elements, cardsConfig, getCardFace } from "../../state/appState.js";
import { CATEGORY_LABELS } from "../../config/constants.js";
import { setHidden, disableSelection } from "../../utils/dom.js";
import solutions from "../../../solutionsConfig.js";
import { formatCardTitle, getCardsForCurrentCategory } from "../cards/cardBuilder.js";
import { focusCard } from "../cards/cardActions.js";

/**
 * Cache les éléments DOM de la sidebar
 */
export function cacheSidebarElements() {
  elements.sidebarList = document.getElementById("cards-list");
  elements.sidebarSubtitle = document.getElementById("sidebar-subtitle");
  elements.sidebarEmpty = document.getElementById("sidebar-empty");
}

/**
 * Rend la barre latérale
 */
export function renderSidebar() {
  const cards = getCardsForCurrentCategory();
  elements.sidebarList.innerHTML = "";

  // Vue carte du ciel
  if (state.currentCategory === "carte") {
    elements.sidebarSubtitle.textContent = "Vue dédiée à la carte du ciel";
    setHidden(elements.sidebarEmpty, true);
    return;
  }

  // Vue règles
  if (state.currentCategory === "regles") {
    elements.sidebarSubtitle.textContent = "Vue dédiée aux règles";
    setHidden(elements.sidebarEmpty, true);
    return;
  }

  // Vue solutions
  if (state.currentCategory === "solutions") {
    elements.sidebarSubtitle.textContent = "Accès rapide";
    setHidden(elements.sidebarEmpty, true);
    solutions.forEach((solution) => {
      const item = document.createElement("li");
      item.textContent = solution.title;
      item.addEventListener("click", () => {
        const el = document.getElementById(solution.id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
      elements.sidebarList.appendChild(item);
    });
    return;
  }

  // Pas de cartes
  if (!cards.length) {
    elements.sidebarSubtitle.textContent = "";
    setHidden(elements.sidebarEmpty, false);
    return;
  }

  // Liste des cartes
  setHidden(elements.sidebarEmpty, true);
  const label = CATEGORY_LABELS[state.currentCategory] || "Cartes";
  elements.sidebarSubtitle.textContent = `${cards.length} carte${cards.length > 1 ? "s" : ""} - ${label.toLowerCase()}`;

  cards.forEach((card) => {
    const item = document.createElement("li");
    item.dataset.cardId = card.id;
    
    if (card.category === "encyclopedie" || card.category === "indice") {
      item.textContent = card.title;
    } else {
      const wrapper = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = formatCardTitle(card);
      wrapper.appendChild(strong);
      item.appendChild(wrapper);
    }
    
    const faceLabel = document.createElement("span");
    faceLabel.textContent = getCardFace(card.id) === "recto" ? "Recto" : "Verso";
    item.append(" ");
    item.appendChild(faceLabel);
    item.addEventListener("click", () => focusCard(card.id));
    disableSelection(item);
    elements.sidebarList.appendChild(item);
  });
}
