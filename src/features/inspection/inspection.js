/**
 * Module d'inspection des cartes (vue 3D)
 */

import { state, elements, inspectionViewState, getCardFace, getCardById } from "../../state/appState.js";
import { ICONS, CATEGORY_ASPECT_DIMENSIONS, DEFAULT_ASPECT_DIMENSIONS } from "../../config/constants.js";
import { setImageSource, clamp } from "../../utils/dom.js";
import { buildImageSrc, setPinIcon } from "../cards/cardBuilder.js";
import { toggleFace, togglePin } from "../cards/cardActions.js";

let updateCardsBackToTopVisibilityCallback = null;

/**
 * Définit le callback de mise à jour du bouton back-to-top
 */
export function setBackToTopCallback(callback) {
  updateCardsBackToTopVisibilityCallback = callback;
}

/**
 * Cache les éléments DOM de l'inspection
 */
export function cacheInspectionElements() {
  elements.inspectionOverlay = document.getElementById("inspection-overlay");
  elements.inspectionStage = document.getElementById("inspection-stage");
  elements.inspectionCard = document.getElementById("inspection-card");
  elements.inspectionImageFront = document.getElementById("inspection-image-front");
  elements.inspectionImageBack = document.getElementById("inspection-image-back");
  elements.inspectionFlipBtn = document.getElementById("inspection-flip");
  elements.inspectionPinBtn = document.getElementById("inspection-pin");
  elements.closeInspectionBtn = document.getElementById("close-inspection");
}

/**
 * Initialise les icônes de l'inspection
 */
export function initInspectionIcons() {
  setPinIcon(elements.inspectionPinBtn, false);
  elements.inspectionFlipBtn.innerHTML = ICONS.flip;
}

/**
 * Lie les contrôles d'inspection
 */
export function bindInspectionControls() {
  elements.closeInspectionBtn.addEventListener("click", closeInspection);

  elements.inspectionFlipBtn.addEventListener("click", () => {
    if (state.inspectedCardId !== null) {
      toggleFace(state.inspectedCardId);
    }
  });

  elements.inspectionPinBtn.addEventListener("click", () => {
    if (state.inspectedCardId !== null) {
      togglePin(state.inspectedCardId);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeInspection();
    }
  });
}

/**
 * Ouvre la vue d'inspection pour une carte
 */
export function openInspection(cardId) {
  const card = getCardById(cardId);
  if (!card) return;
  
  state.inspectedCardId = cardId;
  resetInspectionAspectRatio();
  primeInspectionStage(card);
  document.body.classList.add("inspection-open");
  elements.inspectionOverlay.classList.remove("hidden");
  if (updateCardsBackToTopVisibilityCallback) {
    updateCardsBackToTopVisibilityCallback();
  }
  updateInspection();
  resetInspectionView({ alignToFace: true });
}

/**
 * Ferme la vue d'inspection
 */
export function closeInspection() {
  elements.inspectionOverlay.classList.add("hidden");
  state.inspectedCardId = null;
  resetInspectionAspectRatio();
  clearInspectionInteractionState();
  document.body.classList.remove("inspection-open");
  if (updateCardsBackToTopVisibilityCallback) {
    updateCardsBackToTopVisibilityCallback();
  }
}

/**
 * Met à jour la vue d'inspection
 */
export function updateInspection() {
  if (state.inspectedCardId === null) return;

  const card = getCardById(state.inspectedCardId);
  if (!card) return;

  updateInspectionStageMode(card);
  setImageSource(
    elements.inspectionImageFront,
    buildImageSrc(card, "recto"),
    `${card.title} (recto)`
  );
  setImageSource(
    elements.inspectionImageBack,
    buildImageSrc(card, "verso"),
    `${card.title} (verso)`
  );
  
  // Masquer le bouton épingler pour les indices
  if (card.category === "indice") {
    elements.inspectionPinBtn.style.display = "none";
  } else {
    elements.inspectionPinBtn.style.display = "";
    const isPinned = state.pinned.has(card.id);
    setPinIcon(elements.inspectionPinBtn, isPinned);
    const pinLabel = isPinned ? "Retirer des épinglées" : "Épingler cette carte";
    elements.inspectionPinBtn.setAttribute("aria-label", pinLabel);
    elements.inspectionPinBtn.title = pinLabel;
    elements.inspectionPinBtn.classList.toggle("pin-active", isPinned);
  }
  
  syncInspectionAspectRatio(card);
}

/**
 * Réinitialise le ratio d'aspect de l'inspection
 */
function resetInspectionAspectRatio() {
  if (elements.inspectionStage) {
    elements.inspectionStage.style.removeProperty("--inspection-aspect");
    elements.inspectionStage.classList.remove("is-dynamic");
  }
}

/**
 * Synchronise le ratio d'aspect avec l'image
 */
function syncInspectionAspectRatio(card) {
  const stage = elements.inspectionStage;
  if (!stage) return;
  
  const front = elements.inspectionImageFront;
  const back = elements.inspectionImageBack;
  const targetFrontSrc = buildImageSrc(card, "recto");
  const targetBackSrc = buildImageSrc(card, "verso");

  const applyAspectRatio = (width, height) => {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return false;
    }
    stage.style.setProperty("--inspection-aspect", `${width} / ${height}`);
    return true;
  };

  const tryFromImage = (img, expectedSrc) => {
    if (!img || img.dataset.currentSrc !== expectedSrc || !img.complete || !img.naturalWidth || !img.naturalHeight) {
      return false;
    }
    return applyAspectRatio(img.naturalWidth, img.naturalHeight);
  };

  if (tryFromImage(front, targetFrontSrc) || tryFromImage(back, targetBackSrc)) {
    return;
  }

  const fallbackDimensions = (card && CATEGORY_ASPECT_DIMENSIONS[card.category]) || DEFAULT_ASPECT_DIMENSIONS;
  applyAspectRatio(fallbackDimensions.width, fallbackDimensions.height);

  let detached = false;
  const cleanup = () => {
    if (detached) return;
    detached = true;
    front?.removeEventListener("load", handleLoad);
    back?.removeEventListener("load", handleLoad);
    front?.removeEventListener("error", handleError);
    back?.removeEventListener("error", handleError);
  };

  const handleLoad = (event) => {
    if (tryFromImage(event.currentTarget, targetFrontSrc) || tryFromImage(event.currentTarget, targetBackSrc)) {
      cleanup();
    }
  };

  const handleError = () => cleanup();

  front?.addEventListener("load", handleLoad);
  front?.addEventListener("error", handleError);
  back?.addEventListener("load", handleLoad);
  back?.addEventListener("error", handleError);
}

/**
 * Met à jour le mode d'affichage de l'inspection
 */
function updateInspectionStageMode(card) {
  const stage = elements.inspectionStage;
  if (!stage) return;
  const useDynamicSizing = card?.category === "enigme";
  stage.classList.toggle("is-dynamic", useDynamicSizing);
}

/**
 * Prépare le stage d'inspection pour une carte
 */
function primeInspectionStage(card) {
  const stage = elements.inspectionStage;
  if (!stage) return;
  const fallbackDimensions = (card && CATEGORY_ASPECT_DIMENSIONS[card.category]) || DEFAULT_ASPECT_DIMENSIONS;
  stage.classList.toggle("is-dynamic", card?.category === "enigme");
  stage.style.setProperty("--inspection-aspect", `${fallbackDimensions.width} / ${fallbackDimensions.height}`);
}

/**
 * Configure le visualiseur d'inspection (zoom, rotation, etc.)
 */
export function setupInspectionViewer() {
  const stage = elements.inspectionStage;
  const card = elements.inspectionCard;
  const overlay = elements.inspectionOverlay;
  if (!stage || !card) return;

  const handleOverlayWheel = (event) => {
    if (state.inspectedCardId === null) return;
    event.preventDefault();
    event.stopPropagation();
    const delta = event.deltaY < 0 ? 0.1 : -0.1;
    setInspectionScale(inspectionViewState.scale + delta);
  };

  const handlePointerDown = (event) => {
    event.preventDefault();
    stage.setPointerCapture?.(event.pointerId);
    inspectionViewState.pointerPositions.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    if (inspectionViewState.pointerPositions.size === 1) {
      inspectionViewState.isDragging = true;
      inspectionViewState.lastPointerX = event.clientX;
      inspectionViewState.lastPointerY = event.clientY;
    } else if (inspectionViewState.pointerPositions.size === 2) {
      inspectionViewState.isDragging = false;
      inspectionViewState.pinchDistance = getInspectionPointerDistance();
    }
  };

  const handlePointerMove = (event) => {
    if (!inspectionViewState.pointerPositions.has(event.pointerId)) return;
    inspectionViewState.pointerPositions.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (inspectionViewState.pointerPositions.size === 1 && inspectionViewState.isDragging) {
      const dx = event.clientX - inspectionViewState.lastPointerX;
      const dy = event.clientY - inspectionViewState.lastPointerY;
      inspectionViewState.rotationY += dx * 0.25;
      inspectionViewState.rotationX = clamp(inspectionViewState.rotationX - dy * 0.25, -80, 80);
      inspectionViewState.lastPointerX = event.clientX;
      inspectionViewState.lastPointerY = event.clientY;
      applyInspectionTransform();
      return;
    }

    if (inspectionViewState.pointerPositions.size >= 2) {
      const distance = getInspectionPointerDistance();
      if (inspectionViewState.pinchDistance > 0 && distance > 0) {
        const ratio = distance / inspectionViewState.pinchDistance;
        setInspectionScale(inspectionViewState.scale * ratio);
      }
      inspectionViewState.pinchDistance = distance;
    }
  };

  const handlePointerUp = (event) => {
    stage.releasePointerCapture?.(event.pointerId);
    inspectionViewState.pointerPositions.delete(event.pointerId);
    if (!inspectionViewState.pointerPositions.size) {
      inspectionViewState.isDragging = false;
      inspectionViewState.pinchDistance = 0;
      return;
    }
    if (inspectionViewState.pointerPositions.size === 1) {
      const [remaining] = inspectionViewState.pointerPositions.values();
      inspectionViewState.lastPointerX = remaining.x;
      inspectionViewState.lastPointerY = remaining.y;
      inspectionViewState.isDragging = true;
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.1 : -0.1;
    setInspectionScale(inspectionViewState.scale + delta);
  };

  stage.addEventListener("pointerdown", handlePointerDown);
  stage.addEventListener("pointermove", handlePointerMove);
  stage.addEventListener("pointerup", handlePointerUp);
  stage.addEventListener("pointercancel", handlePointerUp);
  
  try {
    stage.addEventListener("wheel", handleWheel, { passive: false });
  } catch (error) {
    stage.addEventListener("wheel", handleWheel);
  }
  
  try {
    overlay?.addEventListener("wheel", handleOverlayWheel, { passive: false, capture: true });
  } catch (error) {
    overlay?.addEventListener("wheel", handleOverlayWheel, true);
  }
  
  stage.addEventListener("dblclick", (event) => {
    event.preventDefault();
    resetInspectionView({ alignToFace: true });
  });

  card.addEventListener("dblclick", (event) => {
    event.stopPropagation();
    if (state.inspectedCardId !== null) {
      toggleFace(state.inspectedCardId);
    }
  });

  applyInspectionTransform();
}

/**
 * Réinitialise la vue d'inspection
 */
export function resetInspectionView({ alignToFace = false } = {}) {
  inspectionViewState.rotationX = -6;
  if (alignToFace && state.inspectedCardId !== null) {
    const face = getCardFace(state.inspectedCardId);
    inspectionViewState.rotationY = face === "recto" ? 0 : 180;
  } else {
    inspectionViewState.rotationY = 0;
  }
  inspectionViewState.scale = 1;
  clearInspectionInteractionState();
  applyInspectionTransform();
}

/**
 * Aligne l'inspection sur une face
 */
export function snapInspectionToFace(face) {
  inspectionViewState.rotationX = -6;
  inspectionViewState.rotationY = face === "recto" ? 0 : 180;
  applyInspectionTransform();
}

/**
 * Définit l'échelle de l'inspection
 */
function setInspectionScale(nextScale) {
  inspectionViewState.scale = clamp(nextScale, inspectionViewState.minScale, inspectionViewState.maxScale);
  applyInspectionTransform();
}

/**
 * Applique la transformation à la carte
 */
function applyInspectionTransform() {
  if (!elements.inspectionCard) return;
  const { rotationX, rotationY, scale } = inspectionViewState;
  elements.inspectionCard.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${scale})`;
}

/**
 * Calcule la distance entre les pointeurs
 */
function getInspectionPointerDistance() {
  const positions = Array.from(inspectionViewState.pointerPositions.values());
  if (positions.length < 2) return 0;
  const [a, b] = positions;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Réinitialise l'état d'interaction
 */
function clearInspectionInteractionState() {
  inspectionViewState.pointerPositions.clear();
  inspectionViewState.pinchDistance = 0;
  inspectionViewState.isDragging = false;
  inspectionViewState.lastPointerX = 0;
  inspectionViewState.lastPointerY = 0;
}
