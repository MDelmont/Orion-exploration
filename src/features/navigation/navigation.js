/**
 * Module de navigation
 */

import { state, elements } from "../../state/appState.js";
import { CATEGORY_LABELS } from "../../config/constants.js";
import { disableSelection } from "../../utils/dom.js";
import { saveCategory } from "../../utils/storage.js";

let renderAllCallback = null;

/**
 * Définit le callback de rendu global
 */
export function setRenderCallback(callback) {
  renderAllCallback = callback;
}

/**
 * Lie les événements de navigation
 */
export function bindNavigation() {
  elements.navButtons.forEach((button) => {
    disableSelection(button);
    button.addEventListener("click", () => {
      const nextCategory = button.dataset.category;
      if (nextCategory && nextCategory !== state.currentCategory) {
        if (typeof window.__skyExitFullscreen === "function") {
          window.__skyExitFullscreen();
        }
        state.currentCategory = nextCategory;
        state.inspectedCardId = null;
        saveCategory(nextCategory);
        if (renderAllCallback) {
          renderAllCallback();
        }
      }
    });
  });
}

/**
 * Met à jour l'état visuel des boutons de navigation
 */
export function updateNavigationState() {
  elements.navButtons.forEach((button) => {
    const isActive = button.dataset.category === state.currentCategory;
    button.classList.toggle("active", isActive);
  });
}

/**
 * Met à jour le layout en fonction de la catégorie
 */
export function updateLayoutForCategory() {
  const isSkyView = state.currentCategory === "carte";
  document.body.classList.toggle("sky-view", isSkyView);
  if (!isSkyView && typeof window.__skyExitFullscreen === "function") {
    window.__skyExitFullscreen();
  }
}

/**
 * Cache les éléments DOM nécessaires à la navigation
 */
export function cacheNavigationElements() {
  elements.navButtons = Array.from(
    document.querySelectorAll(".nav-button[data-category]")
  );
}
