import {
  createShips,
  createGameBoard,
  createPlacingShipsRules,
} from "./create-ui.js";

const HEIGHT = 20;
const WIDTH = 50;
const styles = getComputedStyle(document.documentElement);

async function getShipsPoses() {
  return new Promise((resolve) => {
    const positions = [];

    // display GameBoard and ships and rules for the user to place their ships
    renderUiToPlaceShips();

    // add Draging and droping eventListeners to rendered ships
    reviveShips();

    // RETURN all positions that user have chose
    resolve([]);
  });
}

function renderUiToPlaceShips() {
  // TODO style placeShipsDiv
  const placeShipsDiv = document.createElement("div");
  placeShipsDiv.id = "place-ships-div";

  // GameBoard Section
  const gameBoardWrapper = document.createElement("div");
  const gameBoardHeader = document.createElement("h3");
  gameBoardHeader.innerText = "Game Board";
  const gameBoard = createGameBoard();
  gameBoard.id = "placing-ships-gameBoard";
  gameBoardWrapper.append(gameBoardHeader, gameBoard);

  // Rules And Ships Section
  const shipsAndRulesWrapper = document.createElement("div");

  // Rules Section
  const rulesWrapper = document.createElement("div");
  const rulesHeader = document.createElement("h3");
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

// make ships draggable and drop them in the gameBoard
// according to the game Rules
// TODO label all cells with cells that occupays
// TODO keep rules when placing ship
function reviveShips() {
  const parentDiv = document.getElementById("place-ships-div");
  const gameBoard = document.getElementById("placing-ships-gameBoard");

  parentDiv.addEventListener("dragstart", (ship) => {
    if (ship.target.classList.contains("ship-container")) {
      ship.dataTransfer.setData("text/plain", ship.target.id);
    }
  });

  parentDiv.addEventListener("dragend", (event) => {
    event.target.classList.remove("dragging");
  });

  gameBoard.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  });

  gameBoard.addEventListener("drop", (event) => {
    event.preventDefault();
    const shipId = event.dataTransfer.getData("text/plain");
    const shipElement = document.getElementById(shipId);
    const index = calculateIndex(gameBoard, event.clientX, event.clientY);
    const cell = document.getElementById("cell" + index.toString());
    cell.appendChild(shipElement);

    shipElement.style.position = "relative";
    shipElement.style.border = "none";
    shipElement.style.zIndex = "100";

    // TODO Store the ship's position in your game data
    // updateShipPosition(shipId, cellX, cellY);
  });
}

function calculateIndex(gameBoard, mouseX, mouseY) {
  const boardRect = gameBoard.getBoundingClientRect();

  const cellSize = parseInt(styles.getPropertyValue("--cell-size"));

  const dropX = mouseX - boardRect.x;
  const dropY = mouseY - boardRect.y;
  const xIndex = Math.floor(dropX / cellSize) - 1;
  const yIndex = Math.floor(dropY / cellSize) - 1;
  const index = yIndex * 11 + xIndex;

  return index;
}

export { getShipsPoses };
