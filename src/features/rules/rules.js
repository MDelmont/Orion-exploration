/**
 * Module des règles - Livre interactif 3D avec zoom intégré
 * Le zoom fonctionne directement sur le livre (comme la carte du ciel)
 */

import { elements } from "../../state/appState.js";
import { clamp } from "../../utils/dom.js";

// Configuration des pages du livre
const rulesPages = [
  { name: 'Couverture', file: 'images/regles/couverture.svg' },
  { name: 'Page 1', file: 'images/regles/page-1.svg' },
  { name: 'Page 2', file: 'images/regles/page-2.svg' }
];

// État du livre
let currentRulesPage = 0;
let rulesInitialized = false;

// Éléments DOM du livre
let rulesElements = {
  bookSpine: null,
  rightSide: null,
  bookArea: null,
  bookStage: null,
  bookWrapper: null,
  prevBtn: null,
  nextBtn: null,
  pageIndicator: null,
  thumbnails: null,
  // Contrôles de zoom intégrés
  zoomInBtn: null,
  zoomOutBtn: null,
  resetZoomBtn: null,
  zoomDisplay: null,
  fullscreenBtn: null,
  fullscreenExitBtn: null
};

// État du zoom intégré sur le livre
const bookZoomState = {
  scale: 1,
  translateX: 0,
  translateY: 0,
  isPanning: false,
  startX: 0,
  startY: 0,
  hasMoved: false,
  minScale: 1,
  maxScale: 5,
  isFullscreen: false
};

// État tactile
const touchState = {
  pinchStartDistance: 0,
  pinchStartScale: 1,
  lastTouchX: 0,
  lastTouchY: 0
};

/**
 * Cache les éléments DOM des règles
 */
export function cacheRulesElements() {
  elements.rulesSection = document.getElementById("rules-section");
  elements.rulesContainer = document.getElementById("rules-container");
}

/**
 * Cache les éléments du livre
 */
function cacheBookElements() {
  rulesElements.bookSpine = document.getElementById('rulesBookSpine');
  rulesElements.rightSide = document.getElementById('rulesRightSide');
  rulesElements.bookArea = document.getElementById('rulesBookArea');
  rulesElements.bookStage = document.getElementById('rulesBookStage');
  rulesElements.bookWrapper = document.getElementById('rulesBookWrapper');
  rulesElements.prevBtn = document.getElementById('rulesPrevBtn');
  rulesElements.nextBtn = document.getElementById('rulesNextBtn');
  rulesElements.pageIndicator = document.getElementById('rulesPageIndicator');
  rulesElements.thumbnails = document.querySelectorAll('.rules-thumbnail');
  
  // Contrôles de zoom intégrés
  rulesElements.zoomInBtn = document.getElementById('rulesZoomIn');
  rulesElements.zoomOutBtn = document.getElementById('rulesZoomOut');
  rulesElements.resetZoomBtn = document.getElementById('rulesZoomReset');
  rulesElements.zoomDisplay = document.getElementById('rulesZoomDisplay');
  rulesElements.fullscreenBtn = document.getElementById('rulesFullscreenToggle');
  rulesElements.fullscreenExitBtn = document.getElementById('rulesFullscreenExit');
}

/**
 * Navigue vers une page spécifique
 */
function goToPage(pageIndex) {
  if (pageIndex < 0 || pageIndex >= rulesPages.length) return;

  const pageElements = document.querySelectorAll('.rules-page');
  
  // Retourner les pages
  pageElements.forEach((page, index) => {
    if (index < pageIndex) {
      page.classList.add('flipped');
    } else {
      page.classList.remove('flipped');
    }
  });

  // Gestion du mode couverture
  if (pageIndex === 0) {
    rulesElements.bookSpine?.classList.add('hidden');
    rulesElements.rightSide?.classList.add('cover-mode');
  } else {
    rulesElements.bookSpine?.classList.remove('hidden');
    rulesElements.rightSide?.classList.remove('cover-mode');
  }

  currentRulesPage = pageIndex;
  
  // Quand on change de page, on garde le zoom mais on recentre la position
  centerBookPan();
  updateControls();
}

/**
 * Met à jour les contrôles
 */
function updateControls() {
  if (!rulesElements.prevBtn || !rulesElements.nextBtn) return;
  
  rulesElements.prevBtn.disabled = currentRulesPage === 0;
  rulesElements.nextBtn.disabled = currentRulesPage === rulesPages.length - 1;
  
  if (rulesElements.pageIndicator) {
    rulesElements.pageIndicator.textContent = rulesPages[currentRulesPage].name;
  }

  rulesElements.thumbnails?.forEach((thumb, index) => {
    thumb.classList.toggle('active', index === currentRulesPage);
  });
}

/**
 * Page suivante
 */
function nextPage() {
  if (currentRulesPage < rulesPages.length - 1) {
    goToPage(currentRulesPage + 1);
  }
}

/**
 * Page précédente
 */
function prevPage() {
  if (currentRulesPage > 0) {
    goToPage(currentRulesPage - 1);
  }
}

// ==================== ZOOM INTÉGRÉ SUR LE LIVRE ====================

/**
 * Limite le déplacement (pan) pour éviter de sortir des limites
 * Utilise le stage comme référence (comme la skymap)
 */
function clampBookPan() {
  const stage = rulesElements.bookStage;
  if (!stage) return;
  
  const rect = stage.getBoundingClientRect();
  const overflowX = Math.max(0, (rect.width * bookZoomState.scale - rect.width) / 2);
  const overflowY = Math.max(0, (rect.height * bookZoomState.scale - rect.height) / 2);
  
  bookZoomState.translateX = clamp(bookZoomState.translateX, -overflowX, overflowX);
  bookZoomState.translateY = clamp(bookZoomState.translateY, -overflowY, overflowY);
}

/**
 * Met à jour la transformation du livre (zoom + pan)
 */
function updateBookTransform() {
  if (!rulesElements.bookWrapper) return;
  
  clampBookPan();
  rulesElements.bookWrapper.style.transform = `translate(${bookZoomState.translateX}px, ${bookZoomState.translateY}px) scale(${bookZoomState.scale})`;
  
  // Mettre à jour l'affichage du pourcentage
  if (rulesElements.zoomDisplay) {
    rulesElements.zoomDisplay.textContent = Math.round(bookZoomState.scale * 100) + '%';
  }
  
  // Mettre à jour le curseur
  if (rulesElements.bookWrapper) {
    rulesElements.bookWrapper.style.cursor = bookZoomState.scale > 1 ? 'grab' : 'default';
  }
}

/**
 * Zoom avant sur le livre
 */
function zoomInBook(delta = 0.25) {
  bookZoomState.scale = clamp(bookZoomState.scale + delta, bookZoomState.minScale, bookZoomState.maxScale);
  updateBookTransform();
}

/**
 * Zoom arrière sur le livre
 */
function zoomOutBook(delta = 0.25) {
  bookZoomState.scale = clamp(bookZoomState.scale - delta, bookZoomState.minScale, bookZoomState.maxScale);
  
  // Si on revient à l'échelle normale, réinitialiser la position
  if (bookZoomState.scale <= 1) {
    bookZoomState.translateX = 0;
    bookZoomState.translateY = 0;
  }
  updateBookTransform();
}

/**
 * Recentre la position sans changer le zoom
 */
function centerBookPan() {
  bookZoomState.translateX = 0;
  bookZoomState.translateY = 0;
  updateBookTransform();
}

/**
 * Réinitialise le zoom du livre
 */
function resetBookZoom() {
  bookZoomState.scale = 1;
  bookZoomState.translateX = 0;
  bookZoomState.translateY = 0;
  updateBookTransform();
}

/**
 * Démarre le pan (glissement)
 */
function beginBookPan(clientX, clientY, { skipCursor = false } = {}) {
  if (bookZoomState.scale <= 1) return; // Pas de pan si pas zoomé
  
  bookZoomState.isPanning = true;
  bookZoomState.hasMoved = false;
  bookZoomState.startX = clientX - bookZoomState.translateX;
  bookZoomState.startY = clientY - bookZoomState.translateY;
  
  if (!skipCursor && rulesElements.bookWrapper) {
    rulesElements.bookWrapper.style.cursor = 'grabbing';
  }
}

/**
 * Déplace le pan
 */
function moveBookPan(clientX, clientY) {
  if (!bookZoomState.isPanning) return;
  
  const newX = clientX - bookZoomState.startX;
  const newY = clientY - bookZoomState.startY;

  // Si on bouge de plus de 5px, on considère que c'est un mouvement (pas un clic)
  if (Math.abs(newX - bookZoomState.translateX) > 5 || Math.abs(newY - bookZoomState.translateY) > 5) {
    bookZoomState.hasMoved = true;
  }
  
  bookZoomState.translateX = newX;
  bookZoomState.translateY = newY;
  updateBookTransform();
}

/**
 * Arrête le pan
 */
function stopBookPan({ skipCursor = false } = {}) {
  bookZoomState.isPanning = false;
  
  if (!skipCursor && rulesElements.bookWrapper && bookZoomState.scale > 1) {
    rulesElements.bookWrapper.style.cursor = 'grab';
  }
}

/**
 * Gère la distance entre deux doigts (pinch)
 */
function getTouchDistance(touchList) {
  if (!touchList || touchList.length < 2) return 0;
  const [a, b] = touchList;
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

// ==================== PLEIN ÉCRAN ====================

/**
 * Entre en mode plein écran
 */
function enterFullscreen() {
  if (bookZoomState.isFullscreen) return;
  
  bookZoomState.isFullscreen = true;
  document.body.classList.add('rules-fullscreen');
  rulesElements.fullscreenExitBtn?.classList.remove('hidden');
}

/**
 * Sort du mode plein écran
 */
function exitFullscreen() {
  if (!bookZoomState.isFullscreen) return;
  
  bookZoomState.isFullscreen = false;
  document.body.classList.remove('rules-fullscreen');
  rulesElements.fullscreenExitBtn?.classList.add('hidden');
  
  // Reset zoom en sortant du plein écran
  resetBookZoom();
}

// ==================== ÉVÉNEMENTS ====================

/**
 * Lie les événements du livre
 */
function bindBookEvents() {
  // Navigation principale
  rulesElements.prevBtn?.addEventListener('click', prevPage);
  rulesElements.nextBtn?.addEventListener('click', nextPage);

  // Miniatures
  rulesElements.thumbnails?.forEach((thumb, index) => {
    thumb.addEventListener('click', () => goToPage(index));
  });

  // Clics sur les pages pour navigation
  document.querySelectorAll('.rules-page').forEach(page => {
    page.addEventListener('click', (e) => {
      // Si zoomé ET qu'on a bougé (pan), on ne change pas de page
      if (bookZoomState.scale > 1 && bookZoomState.hasMoved) return;
      
      const rect = page.getBoundingClientRect();
      // En mode zoom, le rect peut être grand, mais le clic est relatif au viewport
      // On veut savoir si on a cliqué sur la moitié droite ou gauche de la page VISIBLE ou de la page réelle ?
      // La logique originale utilisait rect.left.
      // Avec le zoom, la page est transformée. getBoundingClientRect retourne les dimensions transformées.
      
      const clickX = e.clientX - rect.left;
      
      if (clickX > rect.width / 2) {
        nextPage();
      } else {
        prevPage();
      }
    });
  });
}

/**
 * Lie les événements de zoom sur le livre
 * Utilise le stage pour les événements (comme la skymap)
 */
function bindZoomEvents() {
  const stage = rulesElements.bookStage;
  const bookWrapper = rulesElements.bookWrapper;
  
  if (!stage || !bookWrapper) return;
  
  // Boutons de zoom
  rulesElements.zoomInBtn?.addEventListener('click', () => zoomInBook(0.25));
  rulesElements.zoomOutBtn?.addEventListener('click', () => zoomOutBook(0.25));
  rulesElements.resetZoomBtn?.addEventListener('click', resetBookZoom);
  
  // Plein écran
  rulesElements.fullscreenBtn?.addEventListener('click', () => {
    if (bookZoomState.isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  });
  rulesElements.fullscreenExitBtn?.addEventListener('click', exitFullscreen);
  
  // Zoom à la molette
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    
    if (delta > 0) {
      zoomInBook(delta);
    } else {
      zoomOutBook(-delta);
    }
  }, { passive: false });
  
  // Double-clic pour réinitialiser ou zoomer
  stage.addEventListener('dblclick', (e) => {
    e.preventDefault();
    if (bookZoomState.scale > 1) {
      resetBookZoom();
    } else {
      zoomInBook(1); // Zoom x2
    }
  });
  
  // Souris - Pan
  stage.addEventListener('mousedown', (e) => {
    if (bookZoomState.scale <= 1) return;
    e.preventDefault();
    beginBookPan(e.clientX, e.clientY);
  });
  
  window.addEventListener('mousemove', (e) => {
    if (!bookZoomState.isPanning) return;
    moveBookPan(e.clientX, e.clientY);
  });
  
  window.addEventListener('mouseup', () => {
    stopBookPan();
  });
  
  // Touch - Pan et Pinch
  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      if (bookZoomState.scale > 1) {
        e.preventDefault();
        touchState.pinchStartDistance = 0;
        touchState.pinchStartScale = bookZoomState.scale;
        const touch = e.touches[0];
        beginBookPan(touch.clientX, touch.clientY, { skipCursor: true });
      }
    } else if (e.touches.length === 2) {
      e.preventDefault();
      touchState.pinchStartDistance = getTouchDistance(e.touches);
      touchState.pinchStartScale = bookZoomState.scale;
      stopBookPan({ skipCursor: true });
    }
  }, { passive: false });
  
  stage.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      if (!touchState.pinchStartDistance) {
        touchState.pinchStartDistance = distance;
        touchState.pinchStartScale = bookZoomState.scale;
      }
      const scaleFactor = touchState.pinchStartDistance === 0 ? 1 : distance / touchState.pinchStartDistance;
      bookZoomState.scale = clamp(touchState.pinchStartScale * scaleFactor, bookZoomState.minScale, bookZoomState.maxScale);
      updateBookTransform();
      return;
    }
    if (e.touches.length === 1 && bookZoomState.isPanning) {
      e.preventDefault();
      const touch = e.touches[0];
      moveBookPan(touch.clientX, touch.clientY);
    }
  }, { passive: false });
  
  stage.addEventListener('touchend', (e) => {
    if (e.touches.length === 0) {
      touchState.pinchStartDistance = 0;
      touchState.pinchStartScale = bookZoomState.scale;
      stopBookPan({ skipCursor: true });
      return;
    }
    if (e.touches.length === 1) {
      touchState.pinchStartDistance = 0;
      touchState.pinchStartScale = bookZoomState.scale;
      if (bookZoomState.scale > 1) {
        const touch = e.touches[0];
        beginBookPan(touch.clientX, touch.clientY, { skipCursor: true });
      }
    }
  });
  
  stage.addEventListener('touchcancel', () => {
    stopBookPan({ skipCursor: true });
  });
  
  // Navigation clavier
  document.addEventListener('keydown', (e) => {
    // Vérifier qu'on est sur la section des règles
    if (elements.rulesSection?.classList.contains('hidden')) return;
    
    if (e.key === 'Escape') {
      if (bookZoomState.isFullscreen) {
        exitFullscreen();
      } else if (bookZoomState.scale > 1) {
        resetBookZoom();
      }
    }
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
    if (e.key === '+' || e.key === '=') zoomInBook(0.25);
    if (e.key === '-') zoomOutBook(0.25);
    if (e.key === '0') resetBookZoom();
  });
}

/**
 * Initialise le livre des règles
 */
function initRulesBook() {
  if (rulesInitialized) return;
  
  cacheBookElements();
  bindBookEvents();
  bindZoomEvents();
  updateControls();
  updateBookTransform();
  
  rulesInitialized = true;
}

/**
 * Rend la section des règles
 */
export function renderRules() {
  // Initialiser le livre si ce n'est pas déjà fait
  initRulesBook();
}

// Exposer la fonction de sortie du plein écran
window.__rulesExitFullscreen = exitFullscreen;
