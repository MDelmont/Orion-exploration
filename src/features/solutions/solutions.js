/**
 * Module des solutions
 */

import { elements, getCardById } from "../../state/appState.js";
import solutions from "../../../solutionsConfig.js";
import { buildCardElement } from "../cards/cardBuilder.js";
import { toggleFace, togglePin } from "../cards/cardActions.js";

let openInspectionCallback = null;

/**
 * Définit le callback d'ouverture de l'inspection
 */
export function setOpenInspectionCallback(callback) {
  openInspectionCallback = callback;
}

/**
 * Cache les éléments DOM des solutions
 */
export function cacheSolutionsElements() {
  elements.solutionsSection = document.getElementById("solutions-section");
  elements.solutionsContainer = document.getElementById("solutions-container");
}

/**
 * Rend la section des solutions
 */
export function renderSolutions() {
  elements.solutionsContainer.innerHTML = "";

  solutions.forEach((solution) => {
    const article = document.createElement("article");
    article.id = solution.id;
    article.className = "solution-entry";

    const header = document.createElement("header");
    const title = document.createElement("h2");
    title.textContent = solution.title;
    header.appendChild(title);
    article.appendChild(header);

    // Section des éléments nécessaires
    const reqSection = document.createElement("section");
    reqSection.className = "solution-requirements";
    reqSection.innerHTML = `<h3>Éléments nécessaires</h3>`;

    // Conteneur de cartes
    const cardsContainer = document.createElement("div");
    cardsContainer.className = "cards-grid";

    const addCardItems = (ids) => {
      ids.forEach(id => {
        const card = getCardById(id);
        if (card) {
          const cardEl = buildCardElement(card, {
            onFlip: toggleFace,
            onPin: togglePin,
            onInspect: openInspectionCallback
          });
          cardsContainer.appendChild(cardEl);
        }
      });
    };

    addCardItems(solution.requirements.storyCards);
    addCardItems(solution.requirements.enigmaCards);
    addCardItems(solution.requirements.encyclopediaCards);

    reqSection.appendChild(cardsContainer);

    // Liste des éléments physiques
    if (solution.requirements.physicalElements.length > 0) {
      const physList = document.createElement("ul");
      physList.className = "physical-elements-list";
      solution.requirements.physicalElements.forEach(elem => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>Élément physique :</strong> ${elem}`;
        physList.appendChild(li);
      });
      reqSection.appendChild(physList);
    }

    article.appendChild(reqSection);

    // Section de résolution
    const resSection = document.createElement("section");
    resSection.className = "solution-resolution";
    resSection.innerHTML = `<h3>Résolution</h3>`;

    // Éléments révélateurs
    const revealingDiv = document.createElement("div");
    revealingDiv.className = "revealing-elements";
    revealingDiv.innerHTML = `<h4>Éléments révélateurs</h4>`;
    const revealingList = document.createElement("ul");

    solution.resolution.revealingElements.forEach(elem => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${elem.title}</strong>`;
      if (elem.citations && elem.citations.length > 0) {
        const citList = document.createElement("ul");
        elem.citations.forEach(cit => {
          const citLi = document.createElement("li");
          citLi.textContent = `"${cit}"`;
          citList.appendChild(citLi);
        });
        li.appendChild(citList);
      }
      revealingList.appendChild(li);
    });
    revealingDiv.appendChild(revealingList);
    resSection.appendChild(revealingDiv);

    // Étapes
    const stepsDiv = document.createElement("div");
    stepsDiv.className = "resolution-steps";
    stepsDiv.innerHTML = `<h4>Étapes</h4>`;
    const stepsList = document.createElement("ol");

    solution.resolution.steps.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      stepsList.appendChild(li);
    });
    stepsDiv.appendChild(stepsList);
    resSection.appendChild(stepsDiv);

    article.appendChild(resSection);
    elements.solutionsContainer.appendChild(article);
  });
}
