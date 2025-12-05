/**
 * Utilitaires DOM
 */

/**
 * Affiche ou masque un élément avec la classe "hidden"
 */
export function setHidden(element, hidden) {
  if (!element) {
    return;
  }
  element.classList.toggle("hidden", hidden);
}

/**
 * Désactive la sélection de texte sur un élément
 */
export function disableSelection(element) {
  if (!element) {
    return;
  }
  element.addEventListener("selectstart", (event) => {
    event.preventDefault();
  });
}

/**
 * Limite une valeur entre un minimum et un maximum
 */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Précharge une image en mémoire
 */
const preloadedSources = new Set();

export function preloadSrc(src) {
  if (!src || preloadedSources.has(src)) {
    return;
  }
  const img = new Image();
  img.src = src;
  preloadedSources.add(src);
}

/**
 * Définit la source d'une image avec préchargement
 */
export function setImageSource(img, src, alt) {
  if (!img) {
    return;
  }
  if (img.dataset.currentSrc === src) {
    img.alt = alt;
    return;
  }
  const preloader = new Image();
  preloader.onload = () => {
    img.src = src;
    img.alt = alt;
    img.dataset.currentSrc = src;
  };
  preloader.src = src;
}
