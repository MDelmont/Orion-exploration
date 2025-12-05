/**
 * Module de la page d'accueil
 */

import { state } from "../../state/appState.js";
import { isAppStarted, setAppStarted, getLastCategory, saveCategory, clearSession } from "../../utils/storage.js";

let renderAllCallback = null;

/**
 * Définit le callback de rendu global
 */
export function setRenderCallback(callback) {
  renderAllCallback = callback;
}

/**
 * Configure et initialise la page d'accueil
 * @returns {string|null} La dernière catégorie visitée si l'app était déjà démarrée
 */
export function setupHomePage() {
  const startButton = document.getElementById("start-button");

  // Vérifier si l'app était déjà démarrée
  const appStarted = isAppStarted();
  const lastCategory = getLastCategory();

  if (appStarted) {
    // Sauter la page d'accueil, afficher directement l'app
    document.body.classList.add("app-started");
    setupBrandingClickHandler();
    return lastCategory || null;
  } else {
    document.body.classList.remove("app-started");
  }

  // Gérer le clic sur le bouton démarrer
  if (startButton) {
    startButton.addEventListener("click", () => {
      document.body.classList.add("app-started");
      setAppStarted(true);
      saveCategory("regles");

      setupBrandingClickHandler();

      // Déclencher l'événement de démarrage
      window.dispatchEvent(new CustomEvent("home-start", { detail: { category: "regles" } }));
    });
  }

  return null;
}

/**
 * Configure le gestionnaire de clic sur le titre pour retourner à l'accueil
 */
export function setupBrandingClickHandler() {
  setTimeout(() => {
    const brandingTitle = document.querySelector(".branding h1");
    if (brandingTitle && !brandingTitle.dataset.homeClickSetup) {
      brandingTitle.style.cursor = "pointer";
      brandingTitle.dataset.homeClickSetup = "true";
      brandingTitle.addEventListener("click", () => {
        // Retirer la classe app-started pour afficher la page d'accueil
        document.body.classList.remove("app-started");
        // Effacer les données de session
        clearSession();

        // Réinitialiser le bouton de démarrage
        const startButton = document.getElementById("start-button");
        if (startButton) {
          const newButton = startButton.cloneNode(true);
          startButton.parentNode.replaceChild(newButton, startButton);

          newButton.addEventListener("click", () => {
            document.body.classList.add("app-started");
            setAppStarted(true);
            saveCategory("regles");
            state.currentCategory = "regles";
            if (renderAllCallback) {
              renderAllCallback();
            }
          });
        }
      });
    }
  }, 100);
}
