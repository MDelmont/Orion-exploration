export const physicalElements = {
    carteCiel: "Carte du ciel",
    sextant: "Sextant en bois",
    registre: "Registre du sextant",
    gabaritLapinRecto: "Gabarit constellation de lapin (Recto)",
    gabaritLapinVerso: "Gabarit constellation de lapin (Verso)",
    gabaritLyreRecto: "Gabarit constellation de la Lyre (Recto)",
    gabaritLyreVerso: "Gabarit constellation de la Lyre (Verso)",
    gabaritSagittaireRecto: "Gabarit constellation du Sagittaire (Recto)",
    gabaritSagittaireVerso: "Gabarit constellation du Sagittaire (Verso)",
    diaporama: "Diaporama de couleurs",
    diapositives: "Trois diapositives (étoiles)",
    feuille: "Feuille de papier",
};

export const solutions = [
    {
        id: "enigme_0",
        title: "Enigme n°0",
        requirements: {
            storyCards: [38],
            enigmaCards: [35],
            encyclopediaCards: [11, 12],
            physicalElements: [physicalElements.carteCiel, physicalElements.sextant, physicalElements.registre],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°0",
                    citations: [
                        "L’Object Capable de te guider parmi les astres",
                        "pourtant tout y commence.",
                    ],
                },
                {
                    title: "Carte encyclopédie : Le sextant",
                    citations: [
                        "Object triangulaire à sommet plat, conçu en bois",
                        "Titre de la carte : « le sextant »",
                    ],
                },
                {
                    title: "Carte encyclopédie : La Treizième Lueur",
                    citations: ["Là où tout commence."],
                },
            ],
            steps: [
                "Trouver les cartes encyclopédie “Le Sextant” et “La Treizième lueur”.",
                "Comprendre que le sextant existe en bois.",
                "Aligner le centre du sextant avec la fausse étoile 13.",
                "Aligner les traits sur le sextant pour que chaque symbole touche le numéro de son Étoile.",
                "Numéros récupérés : 13, 25, 45, 85. Somme = 155.",
                "Prendre la carte histoire n°155.",
            ],
        },
    },
    {
        id: "enigme_1",
        title: "Enigme n°1",
        requirements: {
            storyCards: [37],
            enigmaCards: [34],
            encyclopediaCards: [6],
            physicalElements: [physicalElements.carteCiel, physicalElements.sextant, physicalElements.gabaritLapinRecto],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°1",
                    citations: ["Ce lapin n’a pas de pelage"],
                },
                {
                    title: "Carte encyclopédie : Constellation du lapin",
                    citations: ["le même total de 110", "matrices ajourées"],
                },
            ],
            steps: [
                "Comprendre que c’est le lapin dont on parle.",
                "Comprendre que 110 fait référence a l’espace entre les deux étoiles que le sextant indique : 25 + 85.",
                "Utiliser le gabarit en bois représentant la constellation de lapin.",
                "Trouver dans l’espace 110 la constellation de lapin grâce au gabarit.",
                "Additionner toutes les étoiles de la constellation retrouvée : 02 + 07 + 12 + 24 + 26 + 41 + 69 + 77 = 258.",
                "Prendre la carte histoire n°258.",
            ],
        },
    },
    {
        id: "enigme_2",
        title: "Enigme n°2",
        requirements: {
            storyCards: [52],
            enigmaCards: [36],
            encyclopediaCards: [2],
            physicalElements: [physicalElements.carteCiel, physicalElements.gabaritLapinVerso],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°2",
                    citations: ["Dans l’ombre du Lapin, une forme oubliée persiste.", "Sa suite ne se trouve pas sur la planche, mais dans le ciel."],
                },
            ],
            steps: [
                "Utiliser le verso du gabarit de la constellation lapin.",
                "Voir la carte encyclopédie pour comprendre la forme de l’arc d’Orion.",
                "Comprendre que le dessin sur le verso est une partie de l’arc d’Orion.",
                "Utiliser le gabarit pour trouver les étoiles correspondant à l’arc d’Orion.",
                "Prolonger l’arc et additionner les étoiles : 28 + 32 + 36 + 39 + 47 + 71 = 253.",
                "Prendre la carte histoire n°253.",
            ],
        },
    },
    {
        id: "enigme_3",
        title: "Enigme n°3",
        requirements: {
            storyCards: [52, 49],
            enigmaCards: [21],
            encyclopediaCards: [18, 17, 2, 3],
            physicalElements: [physicalElements.carteCiel, physicalElements.gabaritLapinVerso, physicalElements.sextant],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°3",
                    citations: ["Poses le sextant là où le ciel refuse les autres.", "Trouve la flèche qui le complète."],
                },
            ],
            steps: [
                "Positionner le sextant sur la carte.",
                "Superposer le gabarit constellation de lapin (verso) par son trou en gras sur le sextant.",
                "Aligner les cœurs pour compléter avec les flèches (Constellation de Cupidon).",
                "Trouver la flèche à suivre (Constellation d’Orion).",
                "Calculer le poids du vaisseau (50) et des flèches (10).",
                "Tirer 5 flèches. Calculer le trou noir : 91 - 50 = 41.",
                "Prendre la carte histoire n°41.",
            ],
        },
    },
    {
        id: "enigme_4",
        title: "Enigme n°4",
        requirements: {
            storyCards: [48],
            enigmaCards: [30],
            encyclopediaCards: [4],
            physicalElements: [physicalElements.carteCiel, physicalElements.gabaritLyreRecto, physicalElements.sextant],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°4",
                    citations: ["là où 70 vibrations forment une trame invisible"],
                },
            ],
            steps: [
                "Trouver l’espace du ciel 70 (25 + 45).",
                "Prendre le gabarit constellation de la lyre en bois recto.",
                "Retrouver la constellation de la Lyre sur le ciel.",
                "Additionner ses numéros : 01 + 20 + 37 + 58 + 82 = 198.",
                "Prendre la carte histoire n°198.",
            ],
        },
    },
    {
        id: "enigme_5",
        title: "Enigme n°5",
        requirements: {
            storyCards: [41],
            enigmaCards: [28],
            encyclopediaCards: [4],
            physicalElements: [physicalElements.carteCiel, physicalElements.gabaritLyreRecto],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°5",
                    citations: ["Chaque corde tombée a laissé un élan.", "Chaque corde avait sa portée."],
                },
            ],
            steps: [
                "Comprendre que les traits sur le gabarit sont les traces des cordes.",
                "Prolonger les traits pour voir quelles étoiles ils traversent.",
                "Voir le poids de chaque corde (points sur la carte encyclopédie).",
                "Aller à la 1ère, 2ème ou 3ème étoile croisée selon le poids.",
                "Additionner les étoiles trouvées : 09 + 46 + 53 + 80 + 97 = 285.",
                "Prendre la carte histoire n°285.",
            ],
        },
    },
    {
        id: "enigme_6",
        title: "Enigme n°6",
        requirements: {
            storyCards: [50],
            enigmaCards: [22],
            encyclopediaCards: [4],
            physicalElements: [physicalElements.carteCiel, physicalElements.gabaritLyreRecto],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°6",
                    citations: ["Écoutez leur poids, pesez leur accord.", "résonance doit atteindre 197"],
                },
            ],
            steps: [
                "Calculer le poids des cordes (somme des points).",
                "Associer chaque point à son étoile dans le ciel.",
                "Trouver les trois poids qui font 197 au total (75 + 9 + 113).",
                "Additionner les étoiles associées : 01 + 20 + 82 = 103.",
                "Prendre la carte histoire n°103.",
            ],
        },
    },
    {
        id: "enigme_7",
        title: "Enigme n°7",
        requirements: {
            storyCards: [40],
            enigmaCards: [29],
            encyclopediaCards: [10, 13],
            physicalElements: [physicalElements.carteCiel, physicalElements.gabaritLyreVerso, physicalElements.registre],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°7",
                    citations: ["Lisez les marques.", "Additionnez les résonances."],
                },
            ],
            steps: [
                "Comprendre que la partition est cryptée avec des notes (lettres).",
                "Utiliser le registre du sextant pour associer un numéro à chaque lettre (δ=01, etc.).",
                "Associer chaque lettre à une note selon la logique du Chœur Suspendu.",
                "Trouver les notes (B=37, C=20, D=58, E=82).",
                "Additionner leur résonance : 75 + 25 + 7 + 29 + 35 = 171.",
                "Prendre la carte histoire n°171.",
            ],
        },
    },
    {
        id: "enigme_8",
        title: "Enigme n°8",
        requirements: {
            storyCards: [39],
            enigmaCards: [26],
            encyclopediaCards: [4],
            physicalElements: [physicalElements.carteCiel, physicalElements.gabaritLyreVerso],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°8",
                    citations: ["Chaque corde vibre d’une couleur oubliée.", "Le calcul final confirmera l’accord."],
                },
            ],
            steps: [
                "Voir la formule des couleurs sur le gabarit (verso).",
                "Associer chaque corde à une colonne du tableau des couleurs.",
                "Trouver la couleur de chaque corde (Jaune, Vert, Bleu, Violet, Rouge).",
                "Calculer la formule : 20 * 37/1 + 58 - 82 = 716.",
                "Prendre la carte histoire n°716.",
            ],
        },
    },
    {
        id: "enigme_9",
        title: "Enigme n°9",
        requirements: {
            storyCards: [42],
            enigmaCards: [27],
            encyclopediaCards: [4],
            physicalElements: [physicalElements.carteCiel, physicalElements.gabaritLyreRecto, physicalElements.diaporama],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°9",
                    citations: ["l’harmonie doit être projetée", "Aligne les teintes retrouvées"],
                },
            ],
            steps: [
                "Prendre le gabarit constellation de la lyre (recto).",
                "Trouver la constellation de la lyre en plus grand (planète colorée).",
                "Récupérer le filtre associé à l’étoile selon l’énigme précédente.",
                "Extraire les numéros des couleurs sur les planètes.",
                "Additionner les valeurs : 14 + 44 + 55 + 67 + 93 = 273.",
                "Prendre la carte histoire n°273.",
            ],
        },
    },
    {
        id: "enigme_10",
        title: "Enigme n°10",
        requirements: {
            storyCards: [47],
            enigmaCards: [23],
            encyclopediaCards: [5],
            physicalElements: [physicalElements.carteCiel, physicalElements.gabaritSagittaireRecto],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°10",
                    citations: ["les Rivières de Mémoire", "détourner l’oubli"],
                },
            ],
            steps: [
                "Comprendre que le compagnon est le Sagittaire.",
                "Prendre le gabarit du Sagittaire (recto) et le positionner sur le ciel.",
                "Additionner les étoiles trouvées : 04 + 05 + 10 + 33 + 40 + 49 + 51 + 56 + 60 + 62 + 73 + 75 = 518.",
                "Prendre la carte histoire n°518.",
            ],
        },
    },
    {
        id: "enigme_11",
        title: "Enigme n°11",
        requirements: {
            storyCards: [51],
            enigmaCards: [25],
            encyclopediaCards: [5, 7],
            physicalElements: [physicalElements.carteCiel, physicalElements.gabaritSagittaireRecto, physicalElements.registre],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°11",
                    citations: ["une seule rivière échappe à sa flèche", "le Sagittaire murmure un nom"],
                },
            ],
            steps: [
                "Repérer le mot FAUCON sur le gabarit.",
                "Identifier la rivière que le Sagittaire ne pointe pas.",
                "Utiliser le registre pour reproduire le mot FAUCON avec la première lettre des étoiles.",
                "Additionner les étoiles trouvées : 89 + 25 + 52 + 99 + 95 + 05 = 365.",
                "Prendre la carte histoire n°365.",
            ],
        },
    },
    {
        id: "enigme_12",
        title: "Enigme n°12",
        requirements: {
            storyCards: [46],
            enigmaCards: [24],
            encyclopediaCards: [19],
            physicalElements: [physicalElements.carteCiel, physicalElements.sextant, physicalElements.gabaritSagittaireVerso],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°12",
                    citations: ["Les poils de son dos", "Son arc se mit à trembler"],
                },
            ],
            steps: [
                "Voir le labyrinthe de traits sur le verso du gabarit Sagittaire.",
                "Aligner le gabarit sur le sextant.",
                "Suivre le chemin depuis le logo de l’arbre (Lerna) jusqu’à la sortie.",
                "Positionner l’étoile 5 de Sagittaire sur l’étoile 5 de la rivière.",
                "Prendre la bonne étoile (15) et l'additionner au numéro de la rivière (365) = 380.",
                "Prendre la carte histoire n°380.",
            ],
        },
    },
    {
        id: "enigme_13",
        title: "Enigme n°13",
        requirements: {
            storyCards: [45],
            enigmaCards: [31],
            encyclopediaCards: [20, 14, 8, 16, 1, 7],
            physicalElements: [physicalElements.carteCiel],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°13",
                    citations: ["Associe chaque geste à sa saveur", "Le bon mélange ouvrira la suite"],
                },
            ],
            steps: [
                "Identifier le plat : Flan de lumière acidulé.",
                "Associer les ingrédients aux gestes (Codex).",
                "Former le mot SCORPION avec les lettres du Codex.",
                "Utiliser la constellation du Scorpion pour trouver le chemin (8 étoiles).",
                "Associer chaque lettre à un numéro d'étoile.",
                "Appliquer la recette (formule mathématique) : 706.",
                "Prendre la carte histoire n°706.",
            ],
        },
    },
    {
        id: "enigme_14",
        title: "Enigme n°14",
        requirements: {
            storyCards: [44],
            enigmaCards: [32],
            encyclopediaCards: [9, 20],
            physicalElements: [physicalElements.carteCiel, physicalElements.feuille],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°14",
                    citations: ["un ancien carré permet de faire renaître les formes", "Sagittaire : la rosée du matin"],
                },
            ],
            steps: [
                "Comprendre que la couleur du Sagittaire est le rose.",
                "Remplir le carré de retissage avec les étoiles roses.",
                "La forme révèle un cactus.",
                "Trouver le nombre d'espèces de cactus sur Zubenelgenubi (485).",
                "Prendre la carte histoire n°485.",
            ],
        },
    },
    {
        id: "enigme_15",
        title: "Enigme n°15",
        requirements: {
            storyCards: [43],
            enigmaCards: [33],
            encyclopediaCards: [],
            physicalElements: [
                physicalElements.carteCiel,
                physicalElements.sextant,
                physicalElements.registre,
                physicalElements.gabaritLapinRecto,
                physicalElements.gabaritLyreRecto,
                physicalElements.gabaritSagittaireRecto,
                physicalElements.diapositives,
            ],
        },
        resolution: {
            revealingElements: [
                {
                    title: "Carte énigme n°15",
                    citations: ["reconstruit (155)", "Rêver (258)", "explorer (273)", "lumière (365)", "à (253)"],
                },
            ],
            steps: [
                "Utiliser les versos des cartes histoires.",
                "Associer chaque mot/numéro à une carte histoire.",
                "Traduire les constellations pour obtenir la phrase : 'La ceinture se reconstruit...'.",
                "Reconstruire la ceinture avec tous les éléments (sextant, gabarits, diapositives).",
                "Projeter la lumière pour révéler 'Veux tu mepouser'.",
                "Fin du jeu.",
            ],
        },
    },
];

export default solutions;
