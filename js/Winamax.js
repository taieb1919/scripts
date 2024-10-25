// Déclaration des sélecteurs comme des valeurs statiques
////
////
///   REMOVE  ALL UNEEDED DIV FOR PRICE TICKET AND
////
////
////
const selectors = [
  ".sc-dRBbGK.buvRtj",
  ".sc-ggpBeC.ffBkBU",
  ".sc-jsJBEP.sc-hTNaNX",
];

// Parcourir chaque sélecteur et supprimer les éléments correspondants
selectors.forEach((selector) => {
  document.querySelectorAll(selector).forEach((element) => element.remove());
});

// Déclaration des sélecteurs comme des valeurs statiques
////
////
///   REMOVE  ALLEMPTY DIV
////
////
////

// Sélectionner le div avec l'attribut data-testid="sticky-wrap"
const stickyWrap = document.querySelector('div[data-testid="sticky-wrap"]');

if (stickyWrap) {
  // Fonction pour vérifier si un élément est vide
  const isEmptyNode = (node) => {
    return (
      (node.nodeType === Node.ELEMENT_NODE && node.innerHTML.trim() === "") ||
      (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() === "")
    );
  };

  // Supprimer les nœuds vides dans le div
  stickyWrap.childNodes.forEach((node) => {
    if (isEmptyNode(node)) {
      node.remove();
    }
  });
}

// Déclaration des sélecteurs comme des valeurs statiques
////
////
///   GENERATE BETS SELECTIONS BY GAME
////
////
////

// Déclaration des classes Game et Bet
class Game {
  constructor() {
    this.GameTitle = "";
    this.Bets = [];
  }
}

class Bet {
  constructor() {
    this.Name = "";
    this.Odds = 0;
  }
}

// Fonction pour extraire les données
const extractGameData = () => {
  // Sélectionner tous les éléments qui ont un attribut data-testid commençant par "basket-item-"
  const basketItems = document.querySelectorAll(
    'div[data-testid^="basket-item-"]'
  );

  // Initialiser un objet pour stocker les jeux groupés par GameTitle
  const gameMap = {};

  // Parcourir chaque élément basket-item
  basketItems.forEach((item) => {
    // Extraire le titre du jeu (GameTitle) dans le div avec la classe "sc-gpdsqt lcwBfY"
    const gameTitleElement = item.querySelector(".sc-gpdsqt.lcwBfY");
    let gameTitle = "";
    if (gameTitleElement) {
      gameTitle = gameTitleElement.textContent.trim();
    }

    // Si le jeu n'existe pas encore dans gameMap, créer une nouvelle instance de Game
    if (!gameMap[gameTitle]) {
      gameMap[gameTitle] = new Game();
      gameMap[gameTitle].GameTitle = gameTitle;
    }

    // Extraire les paris (Bet) dans le paragraphe avec la classe "sc-fxfXEX jcoGdw"
    const betElements = item.querySelectorAll(".sc-fxfXEX.jcoGdw");
    betElements.forEach((betElement) => {
      const bet = new Bet();

      // Extraire le nom du pari (Bet.Name) dans les span avec les classes "sc-KcXZk fLOgzO" et "sc-lanjmx eJtWuo"
      const betNamePrefix = betElement.querySelector(".sc-KcXZk.fLOgzO");
      const betNameSuffix = betElement.querySelector(".sc-lanjmx.eJtWuo");
      if (betNamePrefix && betNameSuffix) {
        // Combiner les deux parties du nom pour créer Bet.Name (ex: "Résultat Match nul")
        bet.Name = `${betNamePrefix.textContent.trim()} ${betNameSuffix.textContent.trim()}`;
      }

      // Extraire les cotes (Bet.Odds) dans les span avec la classe "sc-IaJfF yJLrW"
      const oddsElement = item.querySelector(".sc-IaJfF.yJLrW");
      if (oddsElement) {
        bet.Odds = parseFloat(oddsElement.textContent.trim().replace(",", "."));
      }

      // Ajouter le pari (Bet) à la liste des paris (Bets) du jeu correspondant dans gameMap
      gameMap[gameTitle].Bets.push(bet);
    });
  });

  // Retourner la liste des jeux (valeurs de gameMap)
  return Object.values(gameMap);
};

// Exécuter la fonction pour extraire les données
const gamesData = extractGameData();

// Convertir les données en chaîne JSON et les afficher
console.log(JSON.stringify(gamesData, null, 2));
