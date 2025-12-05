/**
 * Module du fond spatial animé
 */

import { SPACE_BASE_PATH, SPACE_GROUPS, MAIN_SPRITE_COUNT } from "../../config/constants.js";

/**
 * Génère une définition aléatoire de sprite spatial
 */
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

/**
 * Résout et complète une définition de sprite
 */
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
    baseRotation: base.baseRotation !== undefined ? base.baseRotation : group?.baseRotation,
  };
}

/**
 * Crée une couche de sprites spatiaux
 */
function createSpaceLayer(id) {
  const layer = document.createElement("div");
  layer.id = id;
  layer.className = "space-sprites-layer";
  layer.setAttribute("aria-hidden", "true");
  return layer;
}

/**
 * Crée un élément sprite
 */
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

/**
 * Anime un sprite spatial
 */
function animateSpaceSprite(sprite, definition) {
  const def = resolveSpaceDefinition(definition);

  const margin = 160;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const randomBetween = (min, max) => Math.random() * (max - min) + min;
  const scaleRange = def.scale || [0.35, 0.6];
  const scale = randomBetween(scaleRange[0], scaleRange[1]);

  const pickRoute = (motion) => {
    const routes = [];
    const top = () => ({
      start: { x: randomBetween(-margin, viewportWidth + margin), y: -margin },
      end: { x: randomBetween(-margin, viewportWidth + margin), y: viewportHeight + margin },
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
        () => {
          const startX = randomBetween(-margin, viewportWidth + margin);
          return {
            start: { x: startX, y: viewportHeight + margin },
            end: { x: startX + randomBetween(-220, 220), y: -margin },
          };
        },
        () => {
          const startX = randomBetween(-margin, viewportWidth + margin);
          return {
            start: { x: startX, y: -margin },
            end: { x: startX + randomBetween(-220, 220), y: viewportHeight + margin },
          };
        },
        () => {
          const startY = randomBetween(-margin, viewportHeight + margin);
          return {
            start: { x: -margin, y: startY },
            end: { x: viewportWidth + margin, y: startY + randomBetween(-180, 180) },
          };
        },
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
  const angleDeg = (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI;
  const isThrust = def.motion === "thrust" || def.folder === "vaiseau" || def.folder === "astoroide-fire";
  const headingRotation = isThrust ? angleDeg + 90 + (def.baseRotation || 0) : 0;
  const durationRange = def.speed || [22, 38];
  const clampedDuration = randomBetween(durationRange[0], durationRange[1]);

  sprite.style.transition = "none";
  sprite.dataset.motion = def.motion;
  sprite.dataset.folder = def.folder || "";
  sprite.style.transform = `translate(${start.x}px, ${start.y}px) scale(${scale}) rotate(${headingRotation}deg)`;
  sprite.src = def.src;
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
  sprite.addEventListener("transitionend", sprite._onTransitionEnd, { once: true });
}

/**
 * Initialise les sprites d'une couche
 */
function seedSpaceSprites(layer, count) {
  for (let i = 0; i < count; i += 1) {
    const def = resolveSpaceDefinition(randomSpaceDefinition());
    const sprite = buildSpaceSprite(def);
    layer.appendChild(sprite);
    const initialDelay = Math.random() * 3000;
    setTimeout(() => animateSpaceSprite(sprite, def), initialDelay);
  }
}

/**
 * Configure et démarre le fond spatial
 */
export function setupSpaceBackground() {
  const mainLayer = createSpaceLayer("space-sprites-layer");
  document.body.appendChild(mainLayer);
  seedSpaceSprites(mainLayer, MAIN_SPRITE_COUNT);
}
