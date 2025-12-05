/**
 * Module des règles
 */

import { elements } from "../../state/appState.js";

/**
 * Cache les éléments DOM des règles
 */
export function cacheRulesElements() {
  elements.rulesSection = document.getElementById("rules-section");
  elements.rulesContainer = document.getElementById("rules-container");
}

/**
 * Rend la section des règles
 */
export function renderRules() {
  elements.rulesContainer.innerHTML = "";

  // Section Règles du jeu
  const rulesArticle = document.createElement("article");
  rulesArticle.id = "regles-jeu";
  rulesArticle.className = "solution-entry";

  const rulesHeader = document.createElement("header");
  const rulesTitle = document.createElement("h2");
  rulesTitle.textContent = "Règles du jeu";
  rulesHeader.appendChild(rulesTitle);
  rulesArticle.appendChild(rulesHeader);

  const rulesContent = document.createElement("div");
  rulesContent.className = "rules-content";
  rulesContent.innerHTML = `
    <section>
      <h3>1. Objectif</h3>
      <p>Résoudre toutes les énigmes dans l'ordre et retrouver les <strong>trois étoiles d'Orion</strong>, représentées par les <strong>3 diapositives avec photo</strong>.</p>
    </section>

    <section>
      <h3>2. Contenu (vu comme de simples outils)</h3>
      <ul>
        <li>17 <strong>cartes Histoire</strong></li>
        <li>16 <strong>cartes Énigme</strong> (numérotées 0 à 15)</li>
        <li>20 <strong>cartes Encyclopédie</strong></li>
        <li>1 <strong>carte du ciel</strong></li>
        <li>2 <strong>pièces triangulaires en bois</strong></li>
        <li>3 <strong>gabaries rectangulaires en bois</strong></li>
        <li>5 <strong>diapositives colorées</strong> (rouge, vert, bleu, jaune, violet)</li>
        <li>3 <strong>diapositives avec photo</strong> → ce sont les <strong>étoiles d'Orion</strong>, à récupérer à la dernière énigme</li>
        <li>papier / crayon (optionnel mais utile)</li>
      </ul>
      <p>Aucun de ces éléments n'est "verrouillé" en cours de jeu, sauf les 3 diapositives-photo que vous ne devez utiliser qu'à la toute fin.</p>
    </section>

    <section>
      <h3>3. Mise en place</h3>
      <ol>
        <li><strong>Cartes Histoire</strong> : Former une pile de toutes les cartes Histoire, <strong>face cachée</strong>, classées par numéro.</li>
        <li><strong>Cartes Énigme</strong> : Former une pile des cartes Énigme, <strong>face cachée</strong>, classées de 0 à 15.</li>
        <li><strong>Cartes Encyclopédie</strong> : Poser toutes les cartes Encyclopédie <strong>face visible</strong>, accessibles en permanence.</li>
        <li><strong>Matériel physique</strong> : Carte du ciel, pièces en bois, filtres colorés, posés sur la table, accessibles dès le début. Mettre les <strong>3 diapositives-photo</strong> de côté : elles serviront seulement à la toute fin.</li>
        <li><strong>Départ</strong> : Retourner la <strong>carte Histoire n°1</strong>, sur son coin supérieur droit, lire le <strong>numéro de la carte Énigme</strong> associée et retourner cette Énigme.</li>
      </ol>
    </section>

    <section>
      <h3>4. Mécanique centrale</h3>
      <h4>4.1. Lien Histoire ↔ Énigme</h4>
      <ul>
        <li><strong>Chaque carte Histoire</strong> :
          <ul>
            <li>est lue entièrement (texte d'ambiance, indices implicites),</li>
            <li>indique en haut à droite le <strong>numéro d'une carte Énigme</strong> à retourner.</li>
          </ul>
        </li>
        <li><strong>Chaque carte Énigme</strong> :
          <ul>
            <li>peut se résoudre à l'aide :
              <ul>
                <li>de la carte du ciel,</li>
                <li>du registre,</li>
                <li>des gabaries en bois,</li>
                <li>des pièces triangulaires,</li>
                <li>des filtres colorés,</li>
                <li>et des cartes Encyclopédie.</li>
              </ul>
            </li>
            <li>donne comme <strong>réponse finale un nombre</strong> (souvent un calcul ou une somme).</li>
          </ul>
        </li>
      </ul>

      <h4>4.2. Numéro trouvé → nouvelle carte Histoire</h4>
      <ol>
        <li>Quand vous pensez avoir résolu l'énigme, vous obtenez un <strong>nombre</strong>.</li>
        <li>Ce nombre correspond au <strong>numéro d'une carte Histoire</strong>.</li>
        <li>Procédure :
          <ul>
            <li>Retourner <strong>uniquement</strong> cette carte Histoire.</li>
            <li>Regarder en haut à droite le <strong>numéro de l'Énigme suivante</strong> indiqué.</li>
          </ul>
        </li>
      </ol>

      <h4>4.3. Vérification : bon chemin ou erreur</h4>
      <p>Les cartes Énigme doivent être faites <strong>dans l'ordre</strong> : 0, puis 1, puis 2, …, jusqu'à 15.</p>
      <ul>
        <li>Si la <strong>carte Histoire que vous venez de retourner</strong> indique en haut à droite <strong>le numéro de l'Énigme suivante dans la séquence</strong> → la solution est <strong>correcte</strong>, vous pouvez :
          <ul>
            <li>lire la carte Histoire,</li>
            <li>puis retourner l'Énigme suivante indiquée.</li>
          </ul>
        </li>
        <li>Si la carte Histoire <strong>n'indique pas</strong> le numéro de l'Énigme suivante attendue (par exemple vous êtes sur l'Énigme 3, et la carte Histoire ne renvoie pas vers l'Énigme 4) :
          <ul>
            <li>vous vous êtes <strong>trompés</strong>,</li>
            <li><strong>ne lisez pas</strong> le texte de cette carte Histoire,</li>
            <li>remettez-la <strong>immédiatement face cachée</strong>,</li>
            <li>revenez à l'Énigme en cours et corrigez votre raisonnement / calcul.</li>
          </ul>
        </li>
      </ul>
      <blockquote>
        <p><strong>C'est la règle de contrôle centrale :</strong> si l'Énigme suivante n'est pas dans l'ordre, la réponse est fausse.</p>
      </blockquote>
    </section>

    <section>
      <h3>5. Accès aux cartes Encyclopédie et au matériel</h3>
      <ul>
        <li>Les <strong>cartes Encyclopédie</strong> sont <strong>toujours disponibles</strong>. Vous pouvez les consulter à tout moment, dans n'importe quel ordre, autant de fois que nécessaire.</li>
        <li>Les <strong>objets physiques</strong> (carte du ciel, gabaries, pièces triangulaires, registre, filtres colorés) sont utilisables <strong>dès le début</strong>. Les énigmes vous indiquent comment les employer, mais rien n'est "bloqué" mécaniquement.</li>
        <li>Les <strong>3 diapositives-photo (étoiles d'Orion)</strong> ne servent que lors de la <strong>toute dernière énigme</strong>. Avant cela, on les laisse de côté.</li>
      </ul>
    </section>

    <section>
      <h3>6. Fin de partie</h3>
      <p>La dernière énigme nécessite les trois diapositives photo. Prenez-les au moment de la faire.</p>
    </section>
  `;
  rulesArticle.appendChild(rulesContent);
  elements.rulesContainer.appendChild(rulesArticle);

  // Section Tutoriel
  const tutorialArticle = document.createElement("article");
  tutorialArticle.id = "tutoriel-site";
  tutorialArticle.className = "solution-entry";

  const tutorialHeader = document.createElement("header");
  const tutorialTitle = document.createElement("h2");
  tutorialTitle.textContent = "Tutoriel du site web";
  tutorialHeader.appendChild(tutorialTitle);
  tutorialArticle.appendChild(tutorialHeader);

  const tutorialContent = document.createElement("div");
  tutorialContent.className = "rules-content";
  tutorialContent.innerHTML = `
    <section>
      <h3>Navigation</h3>
      <p>Utilisez les boutons en haut de la page pour naviguer entre les différentes catégories :</p>
      <ul>
        <li><strong>Règles</strong> : Cette page, contenant les règles du jeu et le tutoriel</li>
        <li><strong>Histoires</strong> : Toutes les cartes Histoire</li>
        <li><strong>Énigmes</strong> : Toutes les cartes Énigme</li>
        <li><strong>Encyclopédie</strong> : Toutes les cartes Encyclopédie</li>
        <li><strong>Carte du ciel</strong> : Vue dédiée à la carte du ciel interactive</li>
        <li><strong>Épinglées</strong> : Vos cartes épinglées pour un accès rapide</li>
        <li><strong>Solutions</strong> : Solutions détaillées des énigmes</li>
      </ul>
    </section>

    <section>
      <h3>Manipulation des cartes</h3>
      <h4>Retourner une carte</h4>
      <p>Cliquez sur l'image de la carte ou sur le bouton de retournement pour voir le recto ou le verso.</p>

      <h4>Épingler une carte</h4>
      <p>Cliquez sur le bouton d'épingle pour ajouter une carte à vos favoris. Vous pourrez ensuite la retrouver rapidement dans la catégorie "Épinglées".</p>

      <h4>Inspecter une carte</h4>
      <p>Cliquez sur le bouton d'inspection (icône d'œil) pour ouvrir une vue détaillée de la carte en plein écran. Dans cette vue :</p>
      <ul>
        <li>Utilisez la souris pour faire pivoter la carte en 3D</li>
        <li>Utilisez la molette de la souris pour zoomer</li>
        <li>Cliquez sur le bouton de retournement pour voir l'autre face</li>
        <li>Appuyez sur Échap ou cliquez sur le bouton de fermeture pour quitter</li>
      </ul>
    </section>

    <section>
      <h3>Carte du ciel interactive</h3>
      <p>Dans la section "Carte du ciel" :</p>
      <ul>
        <li>Utilisez la molette de la souris pour zoomer</li>
        <li>Cliquez et glissez pour déplacer la carte</li>
        <li>Utilisez les boutons de contrôle pour zoomer ou recentrer</li>
        <li>Cliquez sur le bouton plein écran pour une vue immersive</li>
      </ul>
    </section>

    <section>
      <h3>Barre latérale</h3>
      <p>La barre latérale affiche la liste des cartes de la catégorie actuelle. Cliquez sur une carte dans la liste pour la faire défiler dans la vue principale.</p>
    </section>

    <section>
      <h3>Conseils d'utilisation</h3>
      <ul>
        <li>Épinglez les cartes importantes pour y accéder rapidement</li>
        <li>Utilisez la vue d'inspection pour examiner les détails des cartes</li>
        <li>Consultez les cartes Encyclopédie pour obtenir des informations utiles</li>
        <li>Les solutions sont disponibles si vous êtes bloqué, mais essayez de résoudre les énigmes par vous-même d'abord !</li>
      </ul>
    </section>
  `;
  tutorialArticle.appendChild(tutorialContent);
  elements.rulesContainer.appendChild(tutorialArticle);
}
