# Configuration des Cartes

Ce dossier contient les fichiers de configuration des cartes du jeu "Le Voyage d'Orion", organisés par thème.

## Structure

- **`histoire.js`** : Cartes d'histoire (16 cartes)
- **`encyclopedie.js`** : Cartes d'encyclopédie (22 cartes)
- **`enigme.js`** : Cartes d'énigme (16 cartes)
- **`indice.js`** : Cartes indices (53 cartes)

## Utilisation

Ces fichiers sont importés et combinés dans le fichier principal `cardsConfig.js` à la racine du projet.

Chaque fichier exporte un tableau de cartes avec la structure suivante :

```javascript
{
  "id": number,           // Identifiant unique de la carte
  "category": string,     // Catégorie : "histoire", "encyclopedie" ou "enigme"
  "title": string,        // Titre de la carte
  "typeCode": string,     // Code du type : "H", "EN" ou "E"
  "rectoFile": string,    // Nom du fichier SVG du recto
  "versoFile": string,    // Nom du fichier SVG du verso
  "number": number|null   // Numéro de la carte (null pour encyclopédie)
}
```

## Ajout de nouvelles cartes

Pour ajouter une nouvelle carte :
1. Ouvrez le fichier correspondant au thème de la carte
2. Ajoutez un nouvel objet dans le tableau avec toutes les propriétés requises
3. Assurez-vous que l'ID est unique
4. Les fichiers SVG doivent être placés dans le dossier `images/cartes/`
