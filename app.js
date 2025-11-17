import cardsConfig, { cardDisplaySettings } from "./cardsConfig.js";

const CATEGORY_LABELS = {
  histoire: "Histoires",
  enigme: "Énigmes",
  encyclopedie: "Encyclopédie",
  epinglees: "Épinglées",
  carte: "Carte du ciel",
};

const ICONS = {
  flip: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 2 7 7h4v2a5 5 0 1 0 5 5h-2a3 3 0 1 1-3-3h2V7h4z" />
  </svg>`,
  pinOutline: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linejoin="round"
      d="M10 2h4v3l2 3v6l2 2v1h-6v5h-2v-5H4v-1l2-2V8l2-3z"
    />
  </svg>`,
  pinFilled: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M10 2h4v3l2 3v6l2 2v1h-6v5h-2v-5H4v-1l2-2V8l2-3z"
    />
  </svg>`,
  inspect: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 5c5 0 9 4.5 10 6-1 1.5-5 6-10 6s-9-4.5-10-6c1-1.5 5-6 10-6zm0 2c-3.5 0-6.5 3-7.7 4C5.5 12 8.5 15 12 15s6.5-3 7.7-4C18.5 10 15.5 7 12 7zm0 2.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5z" />
  </svg>`,
};

const CATEGORY_FOLDERS = {
  histoire: "images/cartes/histoires/",
  enigme: "images/cartes/enigmes/",
  encyclopedie: "images/cartes/encyclopedies/",
};

const CATEGORY_ASPECT_DIMENSIONS = {
  histoire: { width: 298, height: 420 },
  encyclopedie: { width: 298, height: 420 },
  enigme: { width: 199, height: 341 },
};

const DEFAULT_ASPECT_DIMENSIONS = { width: 63, height: 88 };

const state = {
  currentCategory: "histoire",
  pinned: new Set(),
  faceMap: new Map(),
  inspectedCardId: null,
};

const cardsById = new Map(cardsConfig.map((card) => [card.id, card]));
const FLIP_ANIMATION_MS = 400;

const elements = {};
const inspectionViewState = {
  rotationX: -6,
  rotationY: 0,
  scale: 1,
  minScale: 0.65,
  maxScale: 2.4,
  pointerPositions: new Map(),
  pinchDistance: 0,
  isDragging: false,
  lastPointerX: 0,
  lastPointerY: 0,
};

const SPACE_BASE_PATH = "images/backgound";
const SPACE_GROUPS = {
  vaiseau: {
    motion: "thrust",
    scale: [0.32, 0.6],
    speed: [18, 30],
    files: [
      "vaiseau-1.svg",
      "vaiseau-2.svg",
      "vaiseau-3.svg",
      "vaiseau-4.svg",
      "vaiseau-5.svg",
      "vaiseau-6.svg",
      "vaiseau-7.svg",
      "vaiseau-8.svg",
      "vaiseau-9.svg",
      "vaiseau-10.svg",
      "vaiseau-11.svg",
      "vaiseau-12.svg",
    ],
  },
  "astoroide-fire": {
    motion: "thrust",
    scale: [0.28, 0.6],
    speed: [18, 30],
    files: [
      "astreroideFire-1.svg",
      "astreroideFire-2.svg",
      "astreroideFire-3.svg",
      "astreroideFire-4.svg",
      "astreroideFire-5.svg",
      "astreroideFire-6.svg",
      "astreroideFire-7.svg",
    ],
  },
  astronote: {
    motion: "float",
    scale: [0.35, 0.65],
    speed: [26, 44],
    files: [
      "astronote-1.svg",
      "astronote-2.svg",
      "astronote-3.svg",
      "astronote-4.svg",
      "astronote-5.svg",
      "astronote-6.svg",
      "astronote-7.svg",
      "astronote-8.svg",
      "astronote-9.svg",
      "astronote-10.svg",
      "astronote-11.svg",
      "astronote-12.svg",
      "astronote-13.svg",
      "astronote-14.svg",
      "astronote-15.svg",
      "astronote-16.svg",
      "astronote-17.svg",
      "astronote-18.svg",
      "astronote-19.svg",
      "astronote-20.svg",
    ],
  },
  satelitte: {
    motion: "side",
    scale: [0.32, 0.55],
    speed: [24, 40],
    baseRotation: -90,
    files: [
      "Satellite-1.svg",
      "Satellite-2.svg",
      "Satellite-3.svg",
      "Satellite-4.svg",
      "Satellite-5.svg",
      "Satellite-6.svg",
      "Satellite-7.svg",
    ],
  },
  asteroide: {
    motion: "drift",
    scale: [0.32, 0.55],
    speed: [26, 46],
    files: [
      "astreroide-1.svg",
      "astreroide-2.svg",
      "astreroide-3.svg",
      "astreroide-4.svg",
      "astreroide-5.svg",
    ],
  },
  planete: {
    motion: "drift",
    scale: [0.38, 0.65],
    speed: [30, 52],
    files: [
      "Planete-1.svg",
      "Planete-2.svg",
      "Planete-3.svg",
      "Planete-4.svg",
      "Planete-5.svg",
      "Planete-6.svg",
      "Planete-7.svg",
      "Planete-8.svg",
    ],
  },
  "trou-noir": {
    motion: "drift",
    scale: [0.32, 0.55],
    speed: [32, 56],
    files: [
      "TrouNoir-1.svg",
      "TrouNoir-2.svg",
      "TrouNoir-3.svg",
      "TrouNoir-4.svg",
      "TrouNoir-5.svg",
      "TrouNoir-6.svg",
      "TrouNoir-7.svg",
      "TrouNoir-8.svg",
    ],
  },
};

const MAIN_SPRITE_COUNT = 35;
const OVERLAY_SPRITE_COUNT = 35;

function randomSpaceDefinition() {
  const entries = Object.entries(SPACE_GROUPS);
  const [folder, config] = entries[Math.floor(Math.random() * entries.length)];
  const file = config.files[Math.floor(Math.random() * config.files.length)];
  return {
    src: `${SPACE_BASE_PATH}/${folder}/${file}`,
    motion: config.motion,
    scale: config.scale,
    baseRotation: config.baseRotation,
    speed: config.speed,
    folder,
  };
}

function resolveSpaceDefinition(definition) {
  const base = definition || randomSpaceDefinition();
  let folder = base.folder;
  if (!folder && typeof base.src === "string") {
    const match = base.src.match(/backgound\/([^/]+)\//i);
    folder = match ? match[1] : undefined;
  }
  const group = folder ? SPACE_GROUPS[folder] : null;
  return {
    src: base.src,
    folder,
    motion: base.motion || group?.motion || "drift",
    scale: base.scale || group?.scale || [0.35, 0.6],
    speed: base.speed || group?.speed || [22, 38],
    baseRotation:
      base.baseRotation !== undefined
        ? base.baseRotation
        : group?.baseRotation,
  };
}

function formatCardTitle(card) {
  if (card.category === "encyclopedie") {
    return card.title;
  }
  return `${card.number} - ${card.title}`;
}

function setPinIcon(button, isPinned) {
  if (!button) {
    return;
  }
  button.innerHTML = isPinned ? ICONS.pinFilled : ICONS.pinOutline;
}

function updateLayoutForCategory() {
  const isSkyView = state.currentCategory === "carte";
  document.body.classList.toggle("sky-view", isSkyView);
  if (!isSkyView && typeof window.__skyExitFullscreen === "function") {
    window.__skyExitFullscreen();
  }
}

function getCardElement(cardId) {
  if (!elements.cardsContainer) {
    return null;
  }
  return elements.cardsContainer.querySelector(
    `.card[data-card-id="${cardId}"]`
  );
}

function getCardImageElement(cardId) {
  return getCardElement(cardId)?.querySelector("img") ?? null;
}

const preloadedSources = new Set();

function preloadSrc(src) {
  if (!src || preloadedSources.has(src)) {
    return;
  }
  const img = new Image();
  img.src = src;
  preloadedSources.add(src);
}

function preloadCardImages(card) {
  preloadSrc(buildImageSrc(card, "recto"));
  preloadSrc(buildImageSrc(card, "verso"));
}

function setImageSource(img, src, alt) {
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

function disableSelection(element) {
  if (!element) {
    return;
  }
  element.addEventListener("selectstart", (event) => {
    event.preventDefault();
  });
}

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheElements();
  setPinIcon(elements.inspectionPinBtn, false);
  applyDisplaySettings();
  elements.inspectionFlipBtn.innerHTML = ICONS.flip;
  bindNavigation();
  bindInspectionControls();
  setupInspectionViewer();
  setupSkyMap();
  setupCardsBackToTop();
  setupSpaceBackground();
  renderAll();
}

function cacheElements() {
  elements.navButtons = Array.from(
    document.querySelectorAll(".nav-button[data-category]")
  );
  elements.sidebarList = document.getElementById("cards-list");
  elements.sidebarSubtitle = document.getElementById("sidebar-subtitle");
  elements.sidebarEmpty = document.getElementById("sidebar-empty");
  elements.cardsSection = document.getElementById("cards-section");
  elements.cardsContainer = document.getElementById("cards-container");
  elements.cardsEmpty = document.getElementById("cards-empty");
  elements.skySection = document.getElementById("sky-map-section");
  elements.skyBackToTop = document.getElementById("sky-back-to-top");
  elements.cardsBackToTop = document.getElementById("cards-back-to-top");
  elements.inspectionOverlay = document.getElementById("inspection-overlay");
  elements.inspectionStage = document.getElementById("inspection-stage");
  elements.inspectionCard = document.getElementById("inspection-card");
  elements.inspectionImageFront = document.getElementById("inspection-image-front");
  elements.inspectionImageBack = document.getElementById("inspection-image-back");
  elements.inspectionFlipBtn = document.getElementById("inspection-flip");
  elements.inspectionPinBtn = document.getElementById("inspection-pin");
  elements.closeInspectionBtn = document.getElementById("close-inspection");
}

function applyDisplaySettings() {
  if (
    cardDisplaySettings &&
    typeof cardDisplaySettings.cardHeight === "number" &&
    Number.isFinite(cardDisplaySettings.cardHeight) &&
    cardDisplaySettings.cardHeight > 0
  ) {
    document.documentElement.style.setProperty(
      "--card-image-height",
      `${cardDisplaySettings.cardHeight}px`
    );
  } else {
    document.documentElement.style.setProperty("--card-image-height", "auto");
  }
}

function bindNavigation() {
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
        renderAll();
      }
    });
  });
}

function bindInspectionControls() {
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

function renderAll() {
  updateLayoutForCategory();
  updateNavigationState();
  renderSidebar();
  renderMainArea();
}

function updateNavigationState() {
  elements.navButtons.forEach((button) => {
    const isActive = button.dataset.category === state.currentCategory;
    button.classList.toggle("active", isActive);
  });
}

function renderSidebar() {
  const cards = getCardsForCurrentCategory();
  elements.sidebarList.innerHTML = "";

  if (state.currentCategory === "carte") {
    elements.sidebarSubtitle.textContent = "Vue dediee a la carte du ciel";
    setHidden(elements.sidebarEmpty, true);
    return;
  }

  if (!cards.length) {
    elements.sidebarSubtitle.textContent = "";
    setHidden(elements.sidebarEmpty, false);
    return;
  }

  setHidden(elements.sidebarEmpty, true);
  const label = CATEGORY_LABELS[state.currentCategory] || "Cartes";
  elements.sidebarSubtitle.textContent = `${cards.length} carte${
    cards.length > 1 ? "s" : ""
  } - ${label.toLowerCase()}`;

  cards.forEach((card) => {
    const item = document.createElement("li");
    item.dataset.cardId = card.id;
    if (card.category === "encyclopedie") {
      item.textContent = card.title;
    } else {
      const wrapper = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = card.number ?? card.id;
      wrapper.appendChild(strong);
      wrapper.appendChild(document.createTextNode(` - ${card.title}`));
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


function renderMainArea() {
  if (state.currentCategory === "carte") {
    setHidden(elements.cardsSection, true);
    setHidden(elements.skySection, false);
    return;
  }

  setHidden(elements.cardsSection, false);
  setHidden(elements.skySection, true);
  const cards = getCardsForCurrentCategory();
  elements.cardsContainer.innerHTML = "";

  if (!cards.length) {
    setHidden(elements.cardsEmpty, false);
    return;
  }

  setHidden(elements.cardsEmpty, true);
  cards.forEach((card) => {
    const cardElement = buildCardElement(card);
    elements.cardsContainer.appendChild(cardElement);
  });
}

function getCardsForCurrentCategory() {
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

function buildCardElement(card) {
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
  meta.innerHTML = `<span>${CATEGORY_LABELS[card.category] || ""}</span><span>${
    face === "recto" ? "Recto" : "Verso"
  }</span>`;
  article.appendChild(meta);

  const image = document.createElement("img");
  image.src = buildImageSrc(card, face);
  image.alt = `${card.title} (${face})`;
  image.dataset.currentSrc = image.src;
  image.addEventListener("click", () => toggleFace(card.id));
  article.appendChild(image);
  preloadCardImages(card);

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const flipButton = document.createElement("button");
  flipButton.type = "button";
  flipButton.innerHTML = ICONS.flip;
  flipButton.setAttribute("aria-label", "Retourner la carte");
  flipButton.title = "Retourner";
  flipButton.addEventListener("click", () => toggleFace(card.id));
  actions.appendChild(flipButton);

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
  pinButton.addEventListener("click", () => togglePin(card.id));
  actions.appendChild(pinButton);

  const inspectButton = document.createElement("button");
  inspectButton.type = "button";
  inspectButton.innerHTML = ICONS.inspect;
  inspectButton.setAttribute("aria-label", "Inspecter la carte");
  inspectButton.title = "Inspecter";
  inspectButton.addEventListener("click", () => openInspection(card.id));
  actions.appendChild(inspectButton);

  article.appendChild(actions);
  return article;
}

function getCardFace(cardId) {
  return state.faceMap.get(cardId) || "verso";
}

function toggleFace(cardId) {
  const nextFace = getCardFace(cardId) === "recto" ? "verso" : "recto";
  state.faceMap.set(cardId, nextFace);
  const shouldSnapInspection = state.inspectedCardId === cardId;
  const image = getCardImageElement(cardId);
  const finalizeFaceUpdate = () => {
    updateCardFace(cardId);
    updateInspection();
    if (shouldSnapInspection) {
      snapInspectionToFace(nextFace);
    }
    renderSidebar();
  };
  if (image) {
    image.classList.add("is-flipping");
    setTimeout(finalizeFaceUpdate, FLIP_ANIMATION_MS / 2);
    setTimeout(() => {
      image.classList.remove("is-flipping");
    }, FLIP_ANIMATION_MS);
  } else {
    finalizeFaceUpdate();
  }
}

function updateCardFace(cardId) {
  const card = cardsById.get(cardId);
  if (!card) {
    return;
  }
  const cardElement = getCardElement(cardId);
  if (!cardElement) {
    return;
  }
  const face = getCardFace(cardId);
  const img = getCardImageElement(cardId);
  setImageSource(img, buildImageSrc(card, face), `${card.title} (${face})`);
  const faceLabel = cardElement.querySelector(".card-meta span:last-child");
  if (faceLabel) {
    faceLabel.textContent = face === "recto" ? "Recto" : "Verso";
  }
}

function togglePin(cardId) {
  if (state.pinned.has(cardId)) {
    state.pinned.delete(cardId);
  } else {
    state.pinned.add(cardId);
  }

  if (state.currentCategory === "epinglees") {
    renderMainArea();
  } else {
    // Only update buttons where necessary
    updatePinButtons(cardId);
  }

  renderSidebar();
  updateInspection();
}

function updatePinButtons(cardId) {
  const cardSelector = `.card[data-card-id="${cardId}"]`;
  const cardElement = elements.cardsContainer.querySelector(cardSelector);
  if (!cardElement) {
    return;
  }
  const pinButton = cardElement.querySelector('button[data-action="pin"]');
  if (!pinButton) {
    return;
  }
  const isPinned = state.pinned.has(cardId);
  setPinIcon(pinButton, isPinned);
  pinButton.setAttribute(
    "aria-label",
    isPinned ? "Retirer des épinglées" : "Épingler cette carte"
  );
  pinButton.title = isPinned ? "Retirer des épinglées" : "Épingler";
  pinButton.classList.toggle("pin-active", isPinned);
}

function buildImageSrc(card, face) {
  const folder = CATEGORY_FOLDERS[card.category];
  if (!folder) {
    return "";
  }
  return `${folder}${face === "recto" ? card.rectoFile : card.versoFile}`;
}

function openInspection(cardId) {
  const card = cardsById.get(cardId);
  if (!card) {
    return;
  }
  state.inspectedCardId = cardId;
  resetInspectionAspectRatio();
  primeInspectionStage(card);
  document.body.classList.add("inspection-open");
  elements.inspectionOverlay.classList.remove("hidden");
  updateInspection();
  resetInspectionView({ alignToFace: true });
}

function closeInspection() {
  elements.inspectionOverlay.classList.add("hidden");
  state.inspectedCardId = null;
  resetInspectionAspectRatio();
  clearInspectionInteractionState();
  document.body.classList.remove("inspection-open");
}

function updateInspection() {
  if (state.inspectedCardId === null) {
    return;
  }

  const card = cardsById.get(state.inspectedCardId);
  if (!card) {
    return;
  }

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
  const isPinned = state.pinned.has(card.id);
  setPinIcon(elements.inspectionPinBtn, isPinned);
  const pinLabel = isPinned
    ? "Retirer des epingles"
    : "Epingler cette carte";
  elements.inspectionPinBtn.setAttribute("aria-label", pinLabel);
  elements.inspectionPinBtn.title = pinLabel;
  elements.inspectionPinBtn.classList.toggle("pin-active", isPinned);
  syncInspectionAspectRatio(card);
}

function resetInspectionAspectRatio() {
  if (elements.inspectionStage) {
    elements.inspectionStage.style.removeProperty("--inspection-aspect");
    elements.inspectionStage.classList.remove("is-dynamic");
  }
}

function syncInspectionAspectRatio(card) {
  const stage = elements.inspectionStage;
  if (!stage) {
    return;
  }
  const front = elements.inspectionImageFront;
  const back = elements.inspectionImageBack;
  const targetFrontSrc = buildImageSrc(card, "recto");
  const targetBackSrc = buildImageSrc(card, "verso");

  const applyAspectRatio = (width, height) => {
    if (
      !Number.isFinite(width) ||
      !Number.isFinite(height) ||
      width <= 0 ||
      height <= 0
    ) {
      return false;
    }
    stage.style.setProperty("--inspection-aspect", `${width} / ${height}`);
    return true;
  };

  const tryFromImage = (img, expectedSrc) => {
    if (
      !img ||
      img.dataset.currentSrc !== expectedSrc ||
      !img.complete ||
      !img.naturalWidth ||
      !img.naturalHeight
    ) {
      return false;
    }
    return applyAspectRatio(img.naturalWidth, img.naturalHeight);
  };

  if (
    tryFromImage(front, targetFrontSrc) ||
    tryFromImage(back, targetBackSrc)
  ) {
    return;
  }

  const fallbackDimensions =
    (card && CATEGORY_ASPECT_DIMENSIONS[card.category]) ||
    DEFAULT_ASPECT_DIMENSIONS;
  applyAspectRatio(fallbackDimensions.width, fallbackDimensions.height);

  let detached = false;
  const cleanup = () => {
    if (detached) {
      return;
    }
    detached = true;
    front?.removeEventListener("load", handleLoad);
    back?.removeEventListener("load", handleLoad);
    front?.removeEventListener("error", handleError);
    back?.removeEventListener("error", handleError);
  };

  const handleLoad = (event) => {
    if (
      tryFromImage(event.currentTarget, targetFrontSrc) ||
      tryFromImage(event.currentTarget, targetBackSrc)
    ) {
      cleanup();
    }
  };

  const handleError = () => {
    cleanup();
  };

  front?.addEventListener("load", handleLoad);
  front?.addEventListener("error", handleError);
  back?.addEventListener("load", handleLoad);
  back?.addEventListener("error", handleError);
}

function updateInspectionStageMode(card) {
  const stage = elements.inspectionStage;
  if (!stage) {
    return;
  }
  const useDynamicSizing = card?.category === "enigme";
  stage.classList.toggle("is-dynamic", useDynamicSizing);
}

function primeInspectionStage(card) {
  const stage = elements.inspectionStage;
  if (!stage) {
    return;
  }
  const fallbackDimensions =
    (card && CATEGORY_ASPECT_DIMENSIONS[card.category]) ||
    DEFAULT_ASPECT_DIMENSIONS;
  stage.classList.toggle("is-dynamic", card?.category === "enigme");
  stage.style.setProperty(
    "--inspection-aspect",
    `${fallbackDimensions.width} / ${fallbackDimensions.height}`
  );
}
function focusCard(cardId) {
  if (state.currentCategory === "carte") {
    return;
  }
  const target = elements.cardsContainer.querySelector(
    `.card[data-card-id="${cardId}"]`
  );
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("active");
    setTimeout(() => target.classList.remove("active"), 1200);
  } else {
    openInspection(cardId);
  }
}

function setHidden(element, hidden) {
  if (!element) {
    return;
  }
  element.classList.toggle("hidden", hidden);
}

function setupInspectionViewer() {
  const stage = elements.inspectionStage;
  const card = elements.inspectionCard;
  const overlay = elements.inspectionOverlay;
  if (!stage || !card) {
    return;
  }
  const handleOverlayWheel = (event) => {
    if (state.inspectedCardId === null) {
      return;
    }
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
    if (!inspectionViewState.pointerPositions.has(event.pointerId)) {
      return;
    }
    inspectionViewState.pointerPositions.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (
      inspectionViewState.pointerPositions.size === 1 &&
      inspectionViewState.isDragging
    ) {
      const dx = event.clientX - inspectionViewState.lastPointerX;
      const dy = event.clientY - inspectionViewState.lastPointerY;
      inspectionViewState.rotationY += dx * 0.25;
      inspectionViewState.rotationX = clamp(
        inspectionViewState.rotationX - dy * 0.25,
        -80,
        80
      );
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
    overlay?.addEventListener("wheel", handleOverlayWheel, {
      passive: false,
      capture: true,
    });
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

function resetInspectionView({ alignToFace = false } = {}) {
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

function snapInspectionToFace(face) {
  inspectionViewState.rotationX = -6;
  inspectionViewState.rotationY = face === "recto" ? 0 : 180;
  applyInspectionTransform();
}

function setInspectionScale(nextScale) {
  inspectionViewState.scale = clamp(
    nextScale,
    inspectionViewState.minScale,
    inspectionViewState.maxScale
  );
  applyInspectionTransform();
}

function applyInspectionTransform() {
  if (!elements.inspectionCard) {
    return;
  }
  const { rotationX, rotationY, scale } = inspectionViewState;
  elements.inspectionCard.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${scale})`;
}

function getInspectionPointerDistance() {
  const positions = Array.from(inspectionViewState.pointerPositions.values());
  if (positions.length < 2) {
    return 0;
  }
  const [a, b] = positions;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clearInspectionInteractionState() {
  inspectionViewState.pointerPositions.clear();
  inspectionViewState.pinchDistance = 0;
  inspectionViewState.isDragging = false;
  inspectionViewState.lastPointerX = 0;
  inspectionViewState.lastPointerY = 0;
}

function setupSkyMap() {
  const stage = document.getElementById("sky-map-stage");
  const image = document.getElementById("sky-map-image");
  const zoomIn = document.getElementById("zoom-in");
  const zoomOut = document.getElementById("zoom-out");
  const zoomReset = document.getElementById("zoom-reset");
  const fullscreenToggle = document.getElementById("sky-fullscreen-toggle");
  const fullscreenExit = document.getElementById("sky-fullscreen-exit");

  if (!stage || !image) {
    return;
  }

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
    const overflowY = Math.max(
      0,
      (rect.height * skyState.scale - rect.height) / 2
    );
    skyState.translateX = clamp(skyState.translateX, -overflowX, overflowX);
    skyState.translateY = clamp(skyState.translateY, -overflowY, overflowY);
  };

  const updateTransform = () => {
    clampPan();
    image.style.transform = `translate(${skyState.translateX}px, ${skyState.translateY}px) scale(${skyState.scale})`;
  };

  const adjustZoom = (delta) => {
    skyState.scale = clamp(
      skyState.scale + delta,
      skyState.minScale,
      skyState.maxScale
    );
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
    if (!skyState.isPanning) {
      return;
    }
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
    if (!skyState.isPanning) {
      return;
    }
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
    if (!touchList || touchList.length < 2) {
      return 0;
    }
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
      const scaleFactor =
        touchState.pinchStartDistance === 0
          ? 1
          : distance / touchState.pinchStartDistance;
      skyState.scale = clamp(
        touchState.pinchStartScale * scaleFactor,
        skyState.minScale,
        skyState.maxScale
      );
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
    if (skyState.isFullscreen) {
      return;
    }
    skyState.isFullscreen = true;
    document.body.classList.add("sky-fullscreen");
    fullscreenExit?.classList.remove("hidden");
  };

  const exitFullscreen = () => {
    if (!skyState.isFullscreen) {
      return;
    }
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

  window.__skyExitFullscreen = exitFullscreen;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function setupCardsBackToTop() {
  const btn = elements.cardsBackToTop;
  if (!btn) {
    return;
  }

  const updateVisibility = () => {
    const inSkyView = document.body.classList.contains("sky-view");
    const shouldShow = !inSkyView && window.scrollY > 180;
    btn.classList.toggle("hidden", !shouldShow);
  };

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", updateVisibility, { passive: true });
  window.addEventListener("resize", updateVisibility);
  updateVisibility();
}

function setupSpaceBackground() {
  const mainLayer = createSpaceLayer("space-sprites-layer");
  document.body.appendChild(mainLayer);
  seedSpaceSprites(mainLayer, MAIN_SPRITE_COUNT);

  // On reuse le fond principal pour la vue 3D : pas de calque suppl�mentaire dans l'overlay.
}

function createSpaceLayer(id) {
  const layer = document.createElement("div");
  layer.id = id;
  layer.className = "space-sprites-layer";
  layer.setAttribute("aria-hidden", "true");
  return layer;
}

function seedSpaceSprites(layer, count) {
  for (let i = 0; i < count; i += 1) {
    const def = resolveSpaceDefinition(randomSpaceDefinition());
    const sprite = buildSpaceSprite(def);
    layer.appendChild(sprite);
    const initialDelay = Math.random() * 3000;
    setTimeout(() => animateSpaceSprite(sprite, def), initialDelay);
  }
}

function buildSpaceSprite(definition) {
  const def = resolveSpaceDefinition(definition);
  const sprite = document.createElement("img");
  sprite.src = def.src;
  sprite.className = "space-sprite";
  sprite.loading = "lazy";
  sprite.decoding = "async";
  sprite.dataset.motion = def.motion;
  sprite.dataset.tint = Math.random() > 0.45 ? "gold" : "white";
  sprite.dataset.folder = def.folder || "";
  return sprite;
}

function animateSpaceSprite(sprite, definition) {
  const def = resolveSpaceDefinition(definition);

  const margin = 160;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const randomBetween = (min, max) => Math.random() * (max - min) + min;
  const scaleRange = def.scale || [0.35, 0.6];
  const scale = randomBetween(scaleRange[0], scaleRange[1]);
  const driftRotation = randomBetween(-14, 14);

  const pickRoute = (motion) => {
    const routes = [];
    const top = () => ({
      start: { x: randomBetween(-margin, viewportWidth + margin), y: -margin },
      end: {
        x: randomBetween(-margin, viewportWidth + margin),
        y: viewportHeight + margin,
      },
    });
    const bottom = () => ({
      start: { x: randomBetween(-margin, viewportWidth + margin), y: viewportHeight + margin },
      end: { x: randomBetween(-margin, viewportWidth + margin), y: -margin },
    });
    const left = () => ({
      start: { x: -margin, y: randomBetween(-margin, viewportHeight + margin) },
      end: { x: viewportWidth + margin, y: randomBetween(-margin, viewportHeight + margin) },
    });
    const right = () => ({
      start: { x: viewportWidth + margin, y: randomBetween(-margin, viewportHeight + margin) },
      end: { x: -margin, y: randomBetween(-margin, viewportHeight + margin) },
    });

    if (motion === "side") {
      routes.push(left(), right());
    } else if (motion === "float") {
      routes.push(left(), right(), top(), bottom());
    } else if (motion === "thrust") {
      routes.push(
        // bas -> haut
        () => {
          const startX = randomBetween(-margin, viewportWidth + margin);
          return {
            start: { x: startX, y: viewportHeight + margin },
            end: { x: startX + randomBetween(-220, 220), y: -margin },
          };
        },
        // haut -> bas
        () => {
          const startX = randomBetween(-margin, viewportWidth + margin);
          return {
            start: { x: startX, y: -margin },
            end: { x: startX + randomBetween(-220, 220), y: viewportHeight + margin },
          };
        },
        // gauche -> droite
        () => {
          const startY = randomBetween(-margin, viewportHeight + margin);
          return {
            start: { x: -margin, y: startY },
            end: { x: viewportWidth + margin, y: startY + randomBetween(-180, 180) },
          };
        },
        // droite -> gauche
        () => {
          const startY = randomBetween(-margin, viewportHeight + margin);
          return {
            start: { x: viewportWidth + margin, y: startY },
            end: { x: -margin, y: startY + randomBetween(-180, 180) },
          };
        }
      );
      return routes[Math.floor(Math.random() * routes.length)]();
    } else {
      routes.push(bottom(), top());
    }
    return routes[Math.floor(Math.random() * routes.length)];
  };

  const route = pickRoute(def.motion);
  const start = route.start;
  const end = route.end;
  const angleDeg =
    (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI;
  const isThrust =
    def.motion === "thrust" ||
    def.folder === "vaiseau" ||
    def.folder === "astoroide-fire";
  const headingRotation = isThrust
    ? angleDeg + 90 + (def.baseRotation || 0)
    : 0;
  const duration = randomBetween(22, 38);
  const durationRange = def.speed || [22, 38];
  const clampedDuration = randomBetween(durationRange[0], durationRange[1]);

  sprite.style.transition = "none";
  sprite.dataset.motion = def.motion;
  sprite.dataset.folder = def.folder || "";
  sprite.style.transform = `translate(${start.x}px, ${start.y}px) scale(${scale}) rotate(${headingRotation}deg)`;
  sprite.src = def.src;
  // Force initial orientation without animating rotation
  sprite.getBoundingClientRect();

  requestAnimationFrame(() => {
    sprite.style.transition = `transform ${clampedDuration}s linear`;
    sprite.style.transform = `translate(${end.x}px, ${end.y}px) scale(${scale}) rotate(${headingRotation}deg)`;
  });

  if (sprite._onTransitionEnd) {
    sprite.removeEventListener("transitionend", sprite._onTransitionEnd);
  }
  sprite._onTransitionEnd = () => {
    sprite.removeEventListener("transitionend", sprite._onTransitionEnd);
    sprite._onTransitionEnd = null;
    animateSpaceSprite(sprite, randomSpaceDefinition());
  };
  sprite.addEventListener("transitionend", sprite._onTransitionEnd, {
    once: true,
  });
}
