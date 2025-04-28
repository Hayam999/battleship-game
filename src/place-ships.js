// [ ] DEFINE reviveShips()
// NOTE: |  keep the neighbouring rules, there must be at lest 1 cell between all cells from all sides
// [ ] |  Store the ship's x and y position in your game data
// [ ] |  DEFINE   turnShip() to turn the ship vertically to horizontally and vice versa
// [ ] |  REFACTOR landShipCells() to handle landing horizontal ships
// [ ] |  DEFINE reuniouShipCells()
// [ ] |  ADD draging ships in the gameBord feature
//     |  NOTE this will happen after removing the shipContainer from the place ships div by removing it entirely and creating a new div around the cells when clicking any of the cells, or moving the shipContainer with the same place as the cells have been landing
// [x] |  DEFINE landShipCells()
// [ ] |  | DEBUG goForward() as it allowes for forward appending and completing in the second line
// [x] |  DEFINE distributeShipCellsOverGameBoardCells()
// [x] |  | define dragStart event listeners for gameBoard
// [x] |  | modify eventListeners in reviveShips
// [x] |  ADD (front, middle, back) classes to the gameBoard cells

import {
  createShips,
  createGameBoard,
  createPlacingShipsRules,
} from "./create-ui.js";

const shipsDic = {
  carrier: 5,
  battleShip: 4,
  cruiser: 3,
  submarine: 3,
  destroy: 2,
};
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
  //[] TODO style placeShipsDiv
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
  shipsWrapper.id = "ships-harbour";
  const shipsHeader = document.createElement("h3");
  shipsHeader.innerText = "Ships";
  const ships = createShips();
  shipsWrapper.append(shipsHeader, ships);

  shipsAndRulesWrapper.append(rulesWrapper, shipsWrapper);

  placeShipsDiv.append(gameBoardWrapper, shipsAndRulesWrapper);
  document.body.appendChild(placeShipsDiv);
}

function reviveShips() {
  const parentDiv = document.getElementById("ships-harbour");
  const gameBoard = document.getElementById("placing-ships-gameBoard");

  parentDiv.addEventListener("dragstart", (ship) => {
    ship.dataTransfer.setData("text/plain", ship.target.id);
  });
  gameBoard.addEventListener("dragstart", (ship) => {
    const shipId = ship.target.id;
    ship.dataTransfer.setData("text/plain", shipId);
    removeShipName(parent, shipId, shipsDic[shipId]);
  });
  gameBoard.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  });

  gameBoard.addEventListener("drop", (event) => {
    event.preventDefault();
    const shipId = event.dataTransfer.getData("text/plain");
    const shipElement = document.getElementById(shipId);
    const shipLength = shipsDic[shipId];
    const index = calculateIndex(gameBoard, event.clientX, event.clientY);

    // push references to an array to append each cell in the gameBoard sololy, to limit ship dropping to desired gameCells

    const shipCells = getShipCells(shipId, shipLength);

    const cell = document.getElementById("cell" + index.toString());
    landShipCells(cell, index, shipCells);
  });

  // gCell: cell that have been clicked to drop ship on
  // cellIndex: the position Number of gCell
  // shipCells: array of references to shipCells that is beng dropped
  function landShipCells(gCell, cellIndex, shipCells) {
    const shipLen = shipCells.length;
    if (gCell.classList.contains("back")) {
      appendBakward();
    } else if (gCell.classList.contains("front")) {
      appendForward();
    } else if (gCell.classList.contains("middle")) {
      if (goForward()) {
        appendForward();
      } else {
        appendBakward();
      }
    }
    function goForward() {
      for (let i = 1; i <= shipLen; i++) {
        if (shipCells[i].classList.contains("middle") && i != shipLen) {
          return false;
        }
      }
      return true;
    }
    function appendForward() {
      let currentIndex = cellIndex;
      let currentGCell = gCell;
      for (let i = 0; i < shipLen; i++) {
        currentGCell.appendChild(shipCells[i]);
        currentIndex += 1;
        currentGCell = document.getElementById("cell" + currentIndex);
      }
    }
    function appendBakward() {
      let currentIndex = cellIndex;
      let currentGCell = gCell;
      for (let i = shipLen - 1; i >= 0; i--) {
        currentGCell.append(shipCells[i]);
        currentIndex -= 1;
        currentGCell = document.getElementById("cell" + currentIndex);
      }
    }
  }
  function getShipCells(shipId, shipLen) {
    const shipCells = [];
    let currentShipCell;
    for (let i = 1; i <= shipLen; i++) {
      currentShipCell = document.getElementById(shipId + i);
      shipCells.push(currentShipCell);
    }
    return shipCells;
  }
}

// removes the class name of the ship from given cell and cells next to it;
function removeShipName(cell, shipName, shipLength) {}

// calculates position Number of a cell in the game Board that mouse had selected
function calculateIndex(gameBoard, mouseX, mouseY) {
  const boardRect = gameBoard.getBoundingClientRect();

  const cellSize = parseInt(styles.getPropertyValue("--cell-size"));
  const gapSize = parseInt(styles.getPropertyValue("--cell-gap"));

  // coordinates of the mouse relative to the gameBoard means : the start of the gameBoard is the origin
  const dropX = mouseX - boardRect.x;
  const dropY = mouseY - boardRect.y;

  const xIndex = Math.floor(dropX / (cellSize + gapSize));
  const yIndex = Math.floor(dropY / (cellSize + gapSize));
  const index = yIndex * 11 + xIndex;

  return index;
}

// place all ship cells into one shipContainer while dragging
function reuniouShipCells() {
  return;
}

export { getShipsPoses };
