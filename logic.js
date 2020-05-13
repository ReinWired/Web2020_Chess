// Représentation de l'échiquier
const echiquier = [
  [' * ', ' A ', ' B ', ' C ', ' D ', ' E ', ' F ', ' G ', ' H ', ' * '],
  [' 1 ', 'BT1', 'BC1', 'BF1', 'BD1', 'BR1', 'BF2', 'BC2', 'BT2', ' 1 '],
  [' 2 ', 'BP1', 'BP2', 'BP3', 'BP4', 'BP5', 'BP6', 'BP7', 'BP8', ' 2 '],
  [' 3 ', ' - ', ' - ', ' - ', ' - ', ' - ', ' - ', ' - ', ' - ', ' 3 '],
  [' 4 ', ' - ', ' - ', ' - ', ' - ', ' - ', ' - ', ' - ', ' - ', ' 4 '],
  [' 5 ', ' - ', ' - ', ' - ', ' - ', ' - ', ' - ', ' - ', ' - ', ' 5 '],
  [' 6 ', ' - ', ' - ', ' - ', ' - ', ' - ', ' - ', ' - ', ' - ', ' 6 '],
  [' 7 ', 'NP1', 'NP2', 'NP3', 'NP4', 'NP5', 'NP6', 'NP7', 'NP8', ' 7 '],
  [' 8 ', 'NT1', 'NC1', 'NF1', 'ND1', 'NR1', 'NF2', 'NC2', 'NT2', ' 8 '],
  [' * ', ' A ', ' B ', ' C ', ' D ', ' E ', ' F ', ' G ', ' H ', ' * ']
];

// Sert à stocker le nombre de tours / le numéro de tour actuel
let mouvementJoueur = 1;

// Fonction qui sert à un indiquer si un mouvement est valide ou non. Renvoie un array du style [booléen, message]
function validationMouvement(Y, X, nouveauY, nouveauX) {
  if ( Y === nouveauY && X === nouveauX ) {
    return [false, `La case de départ est la même que celle d'arrivée.`]
  }

  if ( !(Y >= 1 && Y <= 8 && X >= 1 && X <= 8) ) {
    return [false, `Les coordonnées de départ se trouvent en dehors de l'échiquier.`];
  }

  if (echiquier[Y][X][1] === '-') {
    return [false, `Vous avez sélectionné une case vide.`];
  }

  // Récupére la couleur, le type et le numéro de la pièce à bouger (position de départ)
  var couleur = echiquier[Y][X][0];
  var type = echiquier[Y][X][1];
  var numero = echiquier[Y][X][2];
  
  // Si le numéro de tours est impair c'est aux Blancs de jouer sinon c'est aux Noirs - Modulo ("%") d'un nombre par 2 permet récupérer le reste d'une division entière par 2 ce qui permet de savoir si il est pair ou impair (Ex: 3 % 2 = 1, 4 % 2 = 0, 5 % 2 = 1)
  if ( (mouvementJoueur % 2) === 0 && couleur === 'B') {
    return [false, `C'est aux ${ mouvementJoueur % 2 === 1 ? 'Blancs' : 'Noirs' } de jouer`];
  }

  if ( !(nouveauY >= 1 && nouveauY <= 8 && nouveauX >= 1 && nouveauX <= 8) ) {
    return [false, `Les coordonnées d'arrivée se trouvent en dehors de l'échiquier.`];
  }

  // Récupére la couleur de la pièce à la position de destination (ou un espace ' ' si aucune pièce n'est présente à cet endroit)
  var couleurCible = echiquier[nouveauY][nouveauX][0];

  if (couleur === couleurCible) {
    return [false, `Vous ne pouvez pas vous déplacez sur la même case qu'une pièce de votre équipe.`];
  }

  // Le switch servira à vérifier des conditions spécifiques selon le type de la pièce
  switch (type) {
    case 'P':
    case 'T': return validationTour(Y, X, nouveauY, nouveauX);
    case 'C': return validationCavalier(Y, X, nouveauY, nouveauX);
    case 'F':
    case 'D':
    case 'R': return validationRoi(Y, X, nouveauY, nouveauX);
  }
}

// Sert à vérifier si une pièce se trouve sur le chemin à parcourir. Renvoie un booléen
function validationCollision(Y, X, nouveauY, nouveauX) {
  if ( X !== nouveauX ) { // Vérifie si on bouge sur l'axe X

    if (X < nouveauX) {
        for (let i = X + 1; i < nouveauX; i++) {
          if (echiquier[Y][i] !== ' - ') {
            return false;
          }
        }
    } else {
      for (let i = X - 1; i > nouveauX; i--) {
          if (echiquier[Y][i] !== ' - ') {
            return false;
          }
      }
    }

  } else if (Y !== nouveauY) { // Vérifie si on bouge sur l'axe Y

    if (Y < nouveauY) {
        for (let i = Y + 1; i < nouveauY; i++) {
          if (echiquier[i][X] !== ' - ') {
            return false;
          }
        }
    } else {
      for (let i = Y - 1; i > nouveauY; i--) {
          if (echiquier[i][X] !== ' - ') {
            return false;
          }
      }
    }

  }

  return true;
}

function validationTour(Y, X, nouveauY, nouveauX) {
  if ( !( Math.abs(X - nouveauX) > 0 && Math.abs(Y - nouveauY) === 0 ||
       Math.abs(Y - nouveauY) > 0 && Math.abs(X - nouveauX) === 0 ) ) {
    return [false, `La tour peut seulement se déplacer en ligne.`];
  }

  if ( validationCollision(Y, X, nouveauY, nouveauX) === false ) {
    return [false, `Il y a une pièce présente sur le chemin de la tour.`];
  }

  return [true, `Tout est okay !`];
}

function validationRoi(Y, X, nouveauY, nouveauX) {
  if ( !( Math.abs(X - nouveauX) === 1 && Math.abs(Y - nouveauY) === 1 ||
      Math.abs(X - nouveauX) === 1 && Math.abs(Y - nouveauY) === 0 ||
      Math.abs(X - nouveauX) === 0 && Math.abs(Y - nouveauY) === 1 ) ) {
    return [false, `Le roi peut seulement se déplacer d'une case en ligne ou en diagonale.`];
  }

  return [true, `Tout est okay !`];
}

function validationCavalier(Y, X, nouveauY, nouveauX) {
  if ( !( (Math.abs(X - nouveauX) + Math.abs(Y - nouveauY)) === 3 && Math.abs(X - nouveauX) >= 1 && Math.abs(Y - nouveauY) >= 1 ) ) {
    return [false, `Le cavalier peut seulement se déplacer de 3 cases au total et en 'L'.`];
  }

  return [true, `Tout est okay !`];
}

// Permet de convertir une lettre en son index qui sera utilisé pour naviguer dans le tableau "echiquier"
function convertisseur(lettre) {
  const alphabet = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', ' '];

  indexLettre = alphabet.indexOf(lettre);

  return indexLettre;
}

// Permet de déplacer une pièce vers une nouvelle position et de rendre la case de départ vide
function deplacementPiece(Y, X, nouveauY, nouveauX) {
  let resultatValidationMouvement = validationMouvement(Y, X, nouveauY, nouveauX);
  let mouvementValide = resultatValidationMouvement[0]; // Contient un booléen indiquant si le mouvement est valide
  let messageMouvement = resultatValidationMouvement[1]; // Contient un message à afficher dans le cas d'une erreur

  if (mouvementValide === true) {
    echiquier[nouveauY][nouveauX] = echiquier[Y][X]; // Assigne à la position finale la valeur de la position de départ
    echiquier[Y][X] = ' - '; // "Vide" la position de départ
    mouvementJoueur++; // Incrémente le nombre de tours si le mouvement à eu lieu
    afficheEchiquier();
  } else {
    console.log(messageMouvement); // Si le mouvement est invalide affiche l'erreur
  }
}

function afficheEchiquier() {
  // S'occupe de la première ligne d'affichage qui ne peut pas faire partie de la boucle
  console.log(' _   _'.repeat(10));
  // S'occupe de toutes les autres lignes en concaténant les valeurs de chaque ligne/array de l'échiquier avec un séparateur précisé et entoure cette ligne de bords
  for (let i = 0; i < echiquier.length; i++) {
      console.log('|_' + echiquier[i].join("_|_") + '_|');
  }
}

afficheEchiquier();