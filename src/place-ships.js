import {
  createShips,
  createGameBoard,
  createPlacingShipsRules,
} from "./create-ui.js";

const HEIGHT = 20;
const WIDTH = 50;

async function getShipsPoses() {
  return new Promise((resolve) => {
    const positions = [];
    // Setup ship placement UI

    // TODO create and display a css Grid for the GameBoard labeling them just like the game labels it's gameBoard
    initUI();
    // TODO create a div to hold the ships and allow the ships to drag and drop

    // RETURN all positions that user have chose
    resolve([]);
  });
}

// TODO design ui for the user to place their ships

function initUI() {
  // TODO add game rules to placeShipsDiv
  // TODO style placeShipsDiv
  const placeShipsDiv = document.createElement("div");
  placeShipsDiv.id = "place-ships-div";

  // GameBoard Section
  const gameBoardWrapper = document.createElement("div");
  const gameBoardHeader = document.createElement("h3");
  gameBoardHeader.innerText = "Game Board";
  const gameBoard = createGameBoard();
  gameBoardWrapper.append(gameBoardHeader, gameBoard);

  // Rules And Ships Section
  const shipsAndRulesWrapper = document.createElement("div");

  // Rules Section
  const rulesWrapper = document.createElement("div");
  const rulesHeader = document.createElement("h6");
  rulesHeader.innerText = "Drag and Drop each Ship into the Game Board";
  const rules = createPlacingShipsRules();
  rulesWrapper.append(rulesHeader, rules);

  // Ships Section
  const shipsWrapper = document.createElement("div");
  const shipsHeader = document.createElement("h3");
  shipsHeader.innerText = "Ships";
  const ships = createShips();
  shipsWrapper.append(shipsHeader, ships);

  shipsAndRulesWrapper.append(rulesWrapper, shipsWrapper);

  placeShipsDiv.append(gameBoardWrapper, shipsAndRulesWrapper);
  document.body.appendChild(placeShipsDiv);
}

export { getShipsPoses };
