// [ ] DEFINE reviveShips()
// NOTE: |  keep the neighbouring rules, there must be at lest 1 cell between all cells from all sides
// [ ] |  Store the ship's x and y position in your game data
// [ ] |  DEFINE   turnShip() to turn the ship vertically to horizontally and vice versa
// [ ] |  REFACTOR landShip() to handle landing horizontal ships
// [ ] |  DEFINE reuniouShipCells()
// [ ] |  ADD draging ships in the gameBord feature
//     |  NOTE this will happen after removing the shipContainer from the place ships div by removing it entirely and creating a new div around the cells when clicking any of the cells, or moving the shipContainer with the same place as the cells have been landing
// [x] |  DEFINE landShip()
// [x] |  | DEBUG goForward() as it allowes for forward appending and completing in the second line
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
  gameBoardWrapper.id = "gameBoard-container";
  const gameBoardHeader = document.createElement("h3");
  gameBoardHeader.id = "gameBoard-header";
  gameBoardHeader.innerText = "Game Board";
  const gameBoard = createGameBoard();
  gameBoard.id = "placing-ships-gameBoard";
  gameBoardWrapper.append(gameBoardHeader, gameBoard);

  // Rules And Ships Section
  const shipsAndRulesWrapper = document.createElement("div");
  shipsAndRulesWrapper.id = "ships-n-rules-wrapper";

  // Rules Section
  const rulesWrapper = document.createElement("div");
  rulesWrapper.id = "rules-wrapper";
  const rulesHeader = document.createElement("h3");
  rulesHeader.id = "rules-header";
  rulesHeader.innerText = "Drag and Drop each Ship into the Game Board";
  const rules = createPlacingShipsRules();
  rulesWrapper.append(rulesHeader, rules);

  // Ships Section
  const shipsWrapper = document.createElement("div");
  shipsWrapper.id = "ships-harbour";
  const shipsHeader = document.createElement("h3");
  shipsHeader.id = "ships-header";
  shipsHeader.innerText = "Ships";
  const ships = createShips();
  shipsWrapper.append(shipsHeader, ships);

  shipsAndRulesWrapper.append(rulesWrapper, shipsWrapper);

  placeShipsDiv.append(gameBoardWrapper, shipsAndRulesWrapper);
  document.body.appendChild(placeShipsDiv);
}

function reviveShips() {
  const shipHarbour = document.getElementById("ships-harbour");
  const gameBoard = document.getElementById("placing-ships-gameBoard");

  shipHarbour.addEventListener("dragstart", (ship) => {
    ship.dataTransfer.setData("text/plain", ship.target.id);
  });
  gameBoard.addEventListener("dragstart", (ship) => {
    const shipId = ship.target.id;
    ship.dataTransfer.setData("text/plain", shipId);
  });
  gameBoard.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  });

  gameBoard.addEventListener("drop", (event) => {
    event.preventDefault();
    const shipId = event.dataTransfer.getData("text/plain");
    const shipWrapper = document.getElementById(shipId);
    //const shipLength = shipsDic[shipId];
    const Pos = calculatePos(gameBoard, event.clientX, event.clientY);

    // [ ] check Placing ship conditions
    // placing conditions
    const shipRect = shipWrapper.getBoundingClientRect();
    const s = shipRect.width / 2;
    if (!Pos) {
      return;
    } else if (
      shipRect.width > Pos.xTillEnd + s ||
      shipRect.height > Pos.yTillEnd + shipRect.height
    ) {
      return;
    }

    gameBoard.appendChild(shipWrapper);
    shipWrapper.style.position = "absolute";
    shipWrapper.style.top = Pos.y + "px";
    shipWrapper.style.left = Pos.x + "px";

    // const cell = document.getElementById("cell" + index.toString());
    // const shipCells = getShipCells(shipId, shipLength);
    // landShip(cell, index, shipCells, shipWrapper);
  });

  // gCell: cell that have been clicked to drop ship on
  // cellIndex: the position Number of gCell
  // shipCells: array of references to shipCells that is beng dropped
  function landShip(gCell, cellIndex, shipCells, shipWrapper) {
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
    // // append the unvisible shipWrapper to first cell to keep ship draggable
    // shipWrapper.style.position = "relative";
    // shipWrapper.style.zIndex = "100";
    // shipCells[0].appendChild(shipWrapper);
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

// calculates position where we should place the ship
function calculatePos(gameBoard, mouseX, mouseY) {
  const boardRect = gameBoard.getBoundingClientRect();

  const cellWidth = parseInt(styles.getPropertyValue("--cell-width"));
  const cellHeight = parseInt(styles.getPropertyValue("--cell-height"));
  const gapSize = parseInt(styles.getPropertyValue("--cell-gap"));

  // coordinates of the mouse relative to the gameBoard means : the start of the gameBoard is the origin
  const dropX = mouseX - boardRect.x;
  const dropY = mouseY - boardRect.y;
  const w = boardRect.width;
  const h = boardRect.height;
  const xTillEnd = w - dropX;
  const yTillEnd = h - dropY;
  if (dropX <= 70 || dropY <= 70) {
    return false;
  }
  const difX = dropX % (cellWidth + gapSize);
  const difY = dropY % (cellHeight + gapSize);

  const x = mouseX - difX;
  const y = mouseY - difY;

  return {
    x: x,
    y: y,
    width: w,
    height: h,
    xTillEnd: xTillEnd,
    yTillEnd: yTillEnd,
  };
}

// place all ship cells into one shipContainer while dragging
function reuniouShipCells() {
  return;
}

export { getShipsPoses };
