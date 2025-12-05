/**
 * Constantes et configurations de l'application
 */

// Labels des catégories
export const CATEGORY_LABELS = {
  regles: "Règles",
  histoire: "Histoires",
  enigme: "Énigmes",
  encyclopedie: "Encyclopédie",
  indice: "Indices",
  epinglees: "Épinglées",
  carte: "Carte du ciel",
  solutions: "Solutions",
};

// Icônes SVG
export const ICONS = {
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

// Chemins des dossiers de cartes par catégorie
export const CATEGORY_FOLDERS = {
  histoire: "images/cartes/histoires/",
  enigme: "images/cartes/enigmes/",
  encyclopedie: "images/cartes/encyclopedies/",
  indice: "images/cartes/",
};

// Dimensions réelles en mm pour le calcul des ratios
export const CATEGORY_ASPECT_DIMENSIONS = {
  histoire: { width: 105, height: 148 },
  encyclopedie: { width: 105, height: 148 },
  enigme: { width: 70, height: 120 },
  indice: { width: 52, height: 37 },
};

export const DEFAULT_ASPECT_DIMENSIONS = { width: 63, height: 88 };

// Animation
export const FLIP_ANIMATION_MS = 400;

// Configuration du fond spatial
export const SPACE_BASE_PATH = "images/backgound";
export const MAIN_SPRITE_COUNT = 35;
export const OVERLAY_SPRITE_COUNT = 35;

export const SPACE_GROUPS = {
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
