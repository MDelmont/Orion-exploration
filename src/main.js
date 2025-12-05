/**
 * Point d'entrée principal de l'application
 * Le Voyage d'Orion - Visualiseur de cartes
 */

// State
import { state, elements } from "./state/appState.js";

// Utils
import { setHidden } from "./utils/dom.js";
import { loadCardState, saveCategory } from "./utils/storage.js";

// Features
import { setupHomePage, setRenderCallback as setHomeRenderCallback } from "./features/home/homePage.js";
import { 
  bindNavigation, 
  updateNavigationState, 
  updateLayoutForCategory, 
  cacheNavigationElements,
  setRenderCallback as setNavRenderCallback
} from "./features/navigation/navigation.js";
import { applyDisplaySettings, getCardsForCurrentCategory } from "./features/cards/cardBuilder.js";
import { setCardActionCallbacks, toggleFace, togglePin, focusCard } from "./features/cards/cardActions.js";
import { renderCards, cacheCardElements, setOpenInspectionCallback } from "./features/cards/cardRenderer.js";
import { 
  cacheInspectionElements, 
  initInspectionIcons, 
  bindInspectionControls, 
  setupInspectionViewer, 
  openInspection, 
  updateInspection, 
  snapInspectionToFace,
  setBackToTopCallback
} from "./features/inspection/inspection.js";
import { cacheSidebarElements, renderSidebar } from "./features/sidebar/sidebar.js";
import { setupSkyMap } from "./features/skymap/skymap.js";
import { cacheSolutionsElements, renderSolutions, setOpenInspectionCallback as setSolutionsInspectionCallback } from "./features/solutions/solutions.js";
import { cacheRulesElements, renderRules } from "./features/rules/rules.js";
import { setupSpaceBackground } from "./features/spaceBackground/spaceBackground.js";

/**
 * Rend l'ensemble de l'interface
 */
function renderAll() {
  updateLayoutForCategory();
  updateNavigationState();
  renderSidebar();
  renderMainArea();
}

/**
 * Rend la zone principale en fonction de la catégorie
 */
function renderMainArea() {
  // Carte du ciel
  if (state.currentCategory === "carte") {
    setHidden(elements.cardsSection, true);
    setHidden(elements.solutionsSection, true);
    setHidden(elements.rulesSection, true);
    setHidden(elements.skySection, false);
    return;
  }

  // Règles
  if (state.currentCategory === "regles") {
    setHidden(elements.cardsSection, true);
    setHidden(elements.skySection, true);
    setHidden(elements.solutionsSection, true);
    setHidden(elements.rulesSection, false);
    renderRules();
    return;
  }

  // Solutions
  if (state.currentCategory === "solutions") {
    setHidden(elements.cardsSection, true);
    setHidden(elements.skySection, true);
    setHidden(elements.solutionsSection, false);
    setHidden(elements.rulesSection, true);
    renderSolutions();
    return;
  }

  // Cartes (histoire, enigme, encyclopedie, indice, epinglees)
  setHidden(elements.cardsSection, false);
  setHidden(elements.solutionsSection, true);
  setHidden(elements.rulesSection, true);
  setHidden(elements.skySection, true);
  renderCards();
}

/**
 * Met à jour la visibilité du bouton back-to-top
 */
function updateCardsBackToTopVisibility() {
  const btn = elements.cardsBackToTop;
  if (!btn) return;

  const inSkyView = document.body.classList.contains("sky-view");
  const inInspectionMode = document.body.classList.contains("inspection-open");
  const shouldShow = !inSkyView && !inInspectionMode && window.scrollY > 180;
  btn.classList.toggle("hidden", !shouldShow);
}

/**
 * Configure le bouton back-to-top
 */
function setupCardsBackToTop() {
  const btn = elements.cardsBackToTop;
  if (!btn) return;

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", updateCardsBackToTopVisibility, { passive: true });
  window.addEventListener("resize", updateCardsBackToTopVisibility);
  updateCardsBackToTopVisibility();
}

/**
 * Cache tous les éléments DOM
 */
function cacheElements() {
  cacheNavigationElements();
  cacheSidebarElements();
  cacheCardElements();
  cacheInspectionElements();
  cacheSolutionsElements();
  cacheRulesElements();
  elements.skySection = document.getElementById("sky-map-section");
}

/**
 * Configure les callbacks entre modules
 */
function setupCallbacks() {
  // Définir les callbacks de rendu
  setHomeRenderCallback(renderAll);
  setNavRenderCallback(renderAll);
  
  // Callbacks d'inspection
  setOpenInspectionCallback(openInspection);
  setSolutionsInspectionCallback(openInspection);
  setBackToTopCallback(updateCardsBackToTopVisibility);
  
  // Callbacks des actions sur les cartes
  setCardActionCallbacks({
    updateInspection,
    renderSidebar,
    renderMainArea,
    snapInspectionToFace
  });
}

/**
 * Initialisation de l'application
 */
function init() {
  // Cache des éléments DOM
  cacheElements();
  
  // Configuration des callbacks
  setupCallbacks();
  
  // Initialisation des icônes et paramètres
  initInspectionIcons();
  applyDisplaySettings();
  
  // Liaison des événements
  bindNavigation();
  bindInspectionControls();
  
  // Configuration des fonctionnalités
  setupInspectionViewer();
  setupSkyMap();
  setupCardsBackToTop();
  setupSpaceBackground();

  // Configuration de la page d'accueil
  const lastCategory = setupHomePage();
  if (lastCategory && lastCategory !== state.currentCategory) {
    state.currentCategory = lastCategory;
  }

  // Écouter l'événement de démarrage
  window.addEventListener("home-start", (e) => {
    state.currentCategory = e.detail.category;
    renderAll();
  });

  // Charger l'état des cartes
  loadCardState();

  // Rendu initial
  renderAll();
}

// Démarrage de l'application
document.addEventListener("DOMContentLoaded", init);
