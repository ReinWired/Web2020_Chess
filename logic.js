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

function afficheEchiquier() {
  // S'occupe de la première ligne d'affichage qui ne peut pas faire partie de la boucle
  console.log(' _   _'.repeat(10));
  // S'occupe de toutes les autres lignes en concaténant les valeurs de chaque ligne/array de l'échiquier avec un séparateur précisé et entoure cette ligne de bords
  for (let i = 0; i < echiquier.length; i++) {
      console.log('|_' + echiquier[i].join("_|_") + '_|');
  }
}

// Permet de convertir une lettre en son index qui sera utilisé pour naviguer dans le tableau "echiquier"
function convertisseur(lettre) {
  const alphabet = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', ' '];

  indexLettre = alphabet.indexOf(lettre);

  return indexLettre;
}

// "12E4"
function entreeUtilisateur(stringDeplacement) {
  if ( stringDeplacement === undefined ) {
     return "Vous devez rentrer des positions de départ et d'arrivée";
  }

  // Supprime les espaces blancs dans le texte de l'utilisateur grâce à uns expression régulière (Regexp)
  let noWhiteSpace = stringDeplacement.replace(/\s/g, '');

  if ( noWhiteSpace.length !== 4 ) {
    return "Vous avez rentrez trop de caractères, veuillez rentrer un maximum de 4 lettre et chiffres.";
  }

  if (typeof noWhiteSpace[0] !== "string" || typeof noWhiteSpace[2] !== "string") {
        return "Le premier et le troisième caractères doivent être des lettres";
  }

  // Transforme le texte en majuscules pour permettre l'utilisation dans la fonction convertisseur
  let upperCaseNoWhiteSpace = noWhiteSpace.toUpperCase();

  // On convertit les lettres en index grâce à la fonction convertisseur et on transforme les types string en type number
  let X = convertisseur(upperCaseNoWhiteSpace[0]);
  let nouveauX = convertisseur(upperCaseNoWhiteSpace[2]);
  let Y = Number(upperCaseNoWhiteSpace[1]);
  let nouveauY = Number(upperCaseNoWhiteSpace[3]);

  if (typeof X !== "number" || typeof nouveauX !== "number") {
        return "Le second et le quatrième caractères doivent être des nombres";
  }
  
  console.log(Y, X, nouveauY, nouveauX);
  deplacementPiece(Y, X, nouveauY, nouveauX);
  return "Mouvement utilisateur était valide.";
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
    case 'P': return validationPion(Y, X, nouveauY, nouveauX, couleur, couleurCible);
    case 'T': return validationTour(Y, X, nouveauY, nouveauX);
    case 'C': return validationCavalier(Y, X, nouveauY, nouveauX);
    case 'F': return validationFou(Y, X, nouveauY, nouveauX);
    case 'D': return validationDame(Y, X, nouveauY, nouveauX);
    case 'R': return validationRoi(Y, X, nouveauY, nouveauX);
  }
}


// Sert à vérifier si une pièce se trouve sur le chemin à parcourir. Renvoie un booléen
function validationCollision(Y, X, nouveauY, nouveauX) {
  if ( Math.abs(X - nouveauX) === 1 || Math.abs(Y - nouveauY) === 1 ) {
    return true;
  }

  // Vérifie les sens de déplacements sur les axes Y (vertical) et X (horizontal)
  let sensX = -1;
  let sensY = -1;

  if (X < nouveauX) {
    sensX = 1;
  }

  if (Y < nouveauY) {
    sensY = 1;
  }

  if ( Y !== nouveauY && X !== nouveauX) {

    // i s'occupe de l'axe des Y (vertical) et j de l'axe des X (horizontal)
    for (let i = Y + sensY, j = X + sensX; i < nouveauY; i += sensY, j += sensX) {
      if (echiquier[i][j] !== ' - ') {
        return false;
      }
    }

  } else if (Y !== nouveauY) { // Vérifie si on bouge sur l'axe Y

    for (let i = Y + sensY; i < nouveauY; i += sensY) {
      if (echiquier[i][X] !== ' - ') {
        return false;
      }
    }

  } else if ( X !== nouveauX ) { // Vérifie si on bouge sur l'axe X

    for (let i = X + sensX; i < nouveauX; i += sensX) {
      if (echiquier[Y][i] !== ' - ') {
        return false;
      }
    }

  }

  return true;
}


function validationPion(Y, X, nouveauY, nouveauX, couleur, couleurCible) {
  if ( !( couleur === 'B' && nouveauY > Y || couleur === 'N' && nouveauY < Y ) ) {
      return [false, `Le pion ne peut qu'avancer.`];
  }

  if ( Math.abs(Y - nouveauY) !== 1 && Math.abs(X - nouveauX) !== 1 || couleurCible === ' ') {
      return [false, `Le pion ne peut se déplacer en diagonale d'une case que pour manger une pièce.`];
  }

  
  if ( ( Math.abs(nouveauY - Y) <= 2 && Math.abs(nouveauX - X) === 0 ) ) {
    if ( ( Math.abs(nouveauY - Y) === 1 && Math.abs(nouveauX - X) === 0 ) ) {
      return [true, `Tout est okay !`];
    } else if ( !(Y === 2 || Y === 7) ) {
      return [false, `Le pion ne peut avancer de 2 cases en ligne que à son premier déplacement.`];
    } else {
      return [true, `Tout est okay !`];
    }
  }
  

  return [true, `Tout est okay !`];
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


function validationCavalier(Y, X, nouveauY, nouveauX) {
  if ( !( (Math.abs(X - nouveauX) + Math.abs(Y - nouveauY)) === 3 && Math.abs(X - nouveauX) >= 1 && Math.abs(Y - nouveauY) >= 1 ) ) {
    return [false, `Le cavalier peut seulement se déplacer de 3 cases au total et en 'L'.`];
  }

  return [true, `Tout est okay !`];
}


function validationFou(Y, X, nouveauY, nouveauX) {
  if ( !( Math.abs(nouveauY - Y) === Math.abs(nouveauX - X) ) ) {
    return [false, `Le fou ne peut se déplacer qu'en diagonale.`];
  }

  if ( validationCollision(Y, X, nouveauY, nouveauX) === false ) {
    return [false, `Il y a une pièce présente sur le chemin du fou.`];
  }

  return [true, `Tout est okay !`];
}


function validationDame(Y, X, nouveauY, nouveauX) {
  if ( !( Math.abs(X - nouveauX) > 0 && Math.abs(Y - nouveauY) === 0 ||
       Math.abs(Y - nouveauY) > 0 && Math.abs(X - nouveauX) === 0 ||
       Math.abs(nouveauY - Y) === Math.abs(nouveauX - X) ) ) {
    return [false, `La dame ne peut se déplacer qu'en ligne ou en diagonale.`];
  }

  if ( validationCollision(Y, X, nouveauY, nouveauX) === false ) {
    return [false, `Il y a une pièce présente sur le chemin de la dame.`];
  }

  return [true, `Tout est okay !`];
}


function validationRoi(Y, X, nouveauY, nouveauX) {
  if ( !( Math.abs(X - nouveauX) === 1 && Math.abs(Y - nouveauY) === 1 ||
      Math.abs(X - nouveauX) === 1 && Math.abs(Y - nouveauY) === 0 ||
      Math.abs(X - nouveauX) === 0 && Math.abs(Y - nouveauY) === 1 ) ) {
    return [false, `Le roi peut seulement se déplacer d'une case en ligne ou en diagonale.`];
  }

  return [true, `Tout est okay !`];
}

console.log("Les règles du jeu d'échecs peuvent se lire à l'adresse suivante: https://www.apprendre-les-echecs.com/wp-content/uploads/2018/04/regles_du_jeu_echecs_v4.pdf");
afficheEchiquier();

entreeUtilisateur("C2 B3");