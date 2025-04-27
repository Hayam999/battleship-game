// [ ] DEFINE reviveShips()
// [ ]  keep the neighbouring rules, there must be at lest 1 cell between all cells from all sides
// [ ] |  DEFINE reuniouShipCells()
// [ ] |  DEFINE distributeShipCellsOverGameBoardCells()
// [ ] |  attach eventListener to the class shipContainer
//     |  this task id dependent on whether the dragging behaviour will change after distributing the cells over the gameBoard cells or not
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

// TODO add class Name = ship Name to the cell receiving the ship and all consequtive cells
// TODO before appending ships to the cell make sure there are no ship class names in the one cell before and one cell after and there are no ships in the upper row or lower row "when placing horizontally, same for vertical placing";
// TODO add double click event to the ship to change it's direction, if verticall make it horizontal and vice verca, changing directions are not allowed on the gameBoard, Add UI Guid for changeing the ship direction

// TODO Store the ship's position in your game data
// updateShipPosition(shipId, cellX, cellY);
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
    // assure ship isn't placed in first row or first col
    if (index < 0) {
      return;
    }

    // push references to an array to append each cell in the gameBoard sololy, to limit ship dropping to desired gameCells

    const shipCells = getShipCells(shipId, shipLength);

    // guarentee the ship will be on row or col one in both dircetions
    // HORIZONTALLY

    //[ ] TODO: VERTICALLY

    const cell = document.getElementById("cell" + index.toString());
    landShipCells(cell, index, shipCells);
    // // add Ship Name as a class to the cells that carry the ship
    // let cellId = index;
    // let currentCell = cell;
    // for (let i = 1; i <= shipLength; i++) {
    //   currentCell.classList.add = shipId;
    //   currentCell.classList.add = shipId + i;
    //   cellId += 1;
    //   currentCell = document.getElementById("cell" + cellId.toString());
    // }
    // cell.appendChild(shipElement);

    // project ship on top of cells
    shipElement.style.position = "relative";
    shipElement.style.border = "none";
    shipElement.style.zIndex = "100";
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
      let currentIndex = cellIndex;
      for (let i = 1; i <= shipLen; i++) {
        if (currentIndex % 11 === 0 && i != shipLen) {
          return false;
        }
        currentIndex += 1;
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
