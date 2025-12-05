/**
 * Module de la carte du ciel
 */

import { clamp } from "../../utils/dom.js";

/**
 * Configure et initialise la carte du ciel interactive
 */
export function setupSkyMap() {
  const stage = document.getElementById("sky-map-stage");
  const image = document.getElementById("sky-map-image");
  const zoomIn = document.getElementById("zoom-in");
  const zoomOut = document.getElementById("zoom-out");
  const zoomReset = document.getElementById("zoom-reset");
  const fullscreenToggle = document.getElementById("sky-fullscreen-toggle");
  const fullscreenExit = document.getElementById("sky-fullscreen-exit");

  if (!stage || !image) return;

  const skyState = {
    scale: 1,
    translateX: 0,
    translateY: 0,
    isPanning: false,
    startX: 0,
    startY: 0,
    minScale: 0.6,
    maxScale: 4,
    isFullscreen: false,
  };

  const resetView = () => {
    skyState.scale = 1;
    skyState.translateX = 0;
    skyState.translateY = 0;
    updateTransform();
  };

  const clampPan = () => {
    const rect = stage.getBoundingClientRect();
    const overflowX = Math.max(0, (rect.width * skyState.scale - rect.width) / 2);
    const overflowY = Math.max(0, (rect.height * skyState.scale - rect.height) / 2);
    skyState.translateX = clamp(skyState.translateX, -overflowX, overflowX);
    skyState.translateY = clamp(skyState.translateY, -overflowY, overflowY);
  };

  const updateTransform = () => {
    clampPan();
    image.style.transform = `translate(${skyState.translateX}px, ${skyState.translateY}px) scale(${skyState.scale})`;
  };

  const adjustZoom = (delta) => {
    skyState.scale = clamp(skyState.scale + delta, skyState.minScale, skyState.maxScale);
    updateTransform();
  };

  stage.addEventListener("wheel", (event) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.1 : -0.1;
    adjustZoom(delta);
  });

  const beginPan = (clientX, clientY, { skipCursor = false } = {}) => {
    skyState.isPanning = true;
    skyState.startX = clientX - skyState.translateX;
    skyState.startY = clientY - skyState.translateY;
    if (!skipCursor) {
      image.style.cursor = "grabbing";
    }
  };

  const movePan = (clientX, clientY) => {
    if (!skyState.isPanning) return;
    skyState.translateX = clientX - skyState.startX;
    skyState.translateY = clientY - skyState.startY;
    updateTransform();
  };

  const stopPan = ({ skipCursor = false } = {}) => {
    skyState.isPanning = false;
    if (!skipCursor) {
      image.style.cursor = "grab";
    }
  };

  const startPan = (event) => {
    event.preventDefault();
    beginPan(event.clientX, event.clientY);
  };

  const pan = (event) => {
    if (!skyState.isPanning) return;
    movePan(event.clientX, event.clientY);
  };

  const endPan = () => {
    stopPan();
  };

  const touchState = {
    pinchStartDistance: 0,
    pinchStartScale: 1,
  };

  const getTouchDistance = (touchList) => {
    if (!touchList || touchList.length < 2) return 0;
    const [a, b] = touchList;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  };

  const handleTouchStart = (event) => {
    if (event.touches.length === 1) {
      event.preventDefault();
      touchState.pinchStartDistance = 0;
      touchState.pinchStartScale = skyState.scale;
      const touch = event.touches[0];
      beginPan(touch.clientX, touch.clientY, { skipCursor: true });
    } else if (event.touches.length === 2) {
      event.preventDefault();
      touchState.pinchStartDistance = getTouchDistance(event.touches);
      touchState.pinchStartScale = skyState.scale;
      stopPan({ skipCursor: true });
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length === 2) {
      event.preventDefault();
      const distance = getTouchDistance(event.touches);
      if (!touchState.pinchStartDistance) {
        touchState.pinchStartDistance = distance;
        touchState.pinchStartScale = skyState.scale;
      }
      const scaleFactor = touchState.pinchStartDistance === 0 ? 1 : distance / touchState.pinchStartDistance;
      skyState.scale = clamp(touchState.pinchStartScale * scaleFactor, skyState.minScale, skyState.maxScale);
      updateTransform();
      return;
    }
    if (event.touches.length === 1 && skyState.isPanning) {
      event.preventDefault();
      const touch = event.touches[0];
      movePan(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (event) => {
    if (event.touches.length === 0) {
      touchState.pinchStartDistance = 0;
      touchState.pinchStartScale = skyState.scale;
      stopPan({ skipCursor: true });
      return;
    }
    if (event.touches.length === 1) {
      touchState.pinchStartDistance = 0;
      touchState.pinchStartScale = skyState.scale;
      const touch = event.touches[0];
      beginPan(touch.clientX, touch.clientY, { skipCursor: true });
    }
  };

  image.addEventListener("mousedown", startPan);
  window.addEventListener("mousemove", pan);
  window.addEventListener("mouseup", endPan);
  image.addEventListener("mouseleave", endPan);
  image.addEventListener("dblclick", (event) => {
    event.preventDefault();
    resetView();
  });
  stage.addEventListener("touchstart", handleTouchStart, { passive: false });
  stage.addEventListener("touchmove", handleTouchMove, { passive: false });
  stage.addEventListener("touchend", handleTouchEnd);
  stage.addEventListener("touchcancel", handleTouchEnd);

  zoomIn?.addEventListener("click", () => adjustZoom(0.15));
  zoomOut?.addEventListener("click", () => adjustZoom(-0.15));
  zoomReset?.addEventListener("click", resetView);

  const enterFullscreen = () => {
    if (skyState.isFullscreen) return;
    skyState.isFullscreen = true;
    document.body.classList.add("sky-fullscreen");
    fullscreenExit?.classList.remove("hidden");
  };

  const exitFullscreen = () => {
    if (!skyState.isFullscreen) return;
    skyState.isFullscreen = false;
    document.body.classList.remove("sky-fullscreen");
    fullscreenExit?.classList.add("hidden");
  };

  fullscreenToggle?.addEventListener("click", () => {
    if (skyState.isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  });

  fullscreenExit?.addEventListener("click", exitFullscreen);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      exitFullscreen();
    }
  });

  // Exposer la fonction de sortie du plein écran
  window.__skyExitFullscreen = exitFullscreen;
}
