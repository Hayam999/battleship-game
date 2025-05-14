// [ ] DEFINE reviveShips()
// NOTE: |  keep the neighbouring rules, there must be at lest 1 cell between all cells from all sides
// [ ] |  Store the ship's x and y position in your game data
// [ ] |  DEFINE   turnShip() to turn the ship vertically to horizontally and vice versa
// [ ] |  | reposition ship if it have been turned inside the grid
// [x] |  ADD draging ships in the gameBord feature
//     |  NOTE this will happen after removing the shipContainer from the place ships div by removing it entirely and creating a new div around the cells when clicking any of the cells, or moving the shipContainer with the same place as the cells have been landing
// [x] |  DEFINE landShip()
// [x] |  | DEBUG goForward() as it allowes for forward appending and completing in the second line
// [x] |  DEFINE distributeShipCellsOverGameBoardCells()
// [x] |  | define dragStart event listeners for gameBoard
// [x] |  | modify eventListeners in reviveShips
// [x] |  ADD (front, middle, back) classes to the gameBoard cells

// [x] | Make numbers in the gameBoard responsive

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
  const shipsDiv = document.getElementById("ships-div");

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
    const PosAndIndex = clacPosAndIndex(
      gameBoard,
      event.clientX,
      event.clientY,
    );
    // [ ] check Placing ship conditions
    // placing conditions

    gameBoard.appendChild(shipWrapper);
    gameBoard.style.position = "relative";
    shipWrapper.style.position = "absolute";

    shipWrapper.style.top = PosAndIndex.yPos + "%";
    shipWrapper.style.left = PosAndIndex.xPos + "%";
  });
  shipsDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("turn-ship")) {
      const shipId = e.target.id.substring(5);
      const ship = document.getElementById(shipId);

      const currentRotation = getRotationDegrees(ship);
      const newRotation = currentRotation + 90;
      ship.style.transform = `rotate(${newRotation}deg)`;

      // [x] complete rotating the ship properly and make rotation available from horizontal to vertical and vice versa; make the ship change it's direction in a beautiful way
      ship.style.position = "relative";
      ship.style.top = "100%";
      ship.style.left = "100%";
      ship.style.transformOrigin = "center";
      ship.style.zIndex = "1";
    }
  });
}

function getRotationDegrees(element) {
  const style = window.getComputedStyle(element);
  const transform = style.transform;

  if (transform === "none") return 0;

  // The transform matrix looks like: matrix(a, b, c, d, tx, ty)
  const values = transform.match(/matrix\(([^)]+)\)/)[1].split(", ");
  const a = parseFloat(values[0]);
  const b = parseFloat(values[1]);

  // Calculate the angle in degrees
  const radians = Math.atan2(b, a);
  const degrees = Math.round(radians * (180 / Math.PI));

  // Ensure degrees is always a positive rotation between 0–359
  return (degrees + 360) % 360;
}

function clacPosAndIndex(gameBoard, mouseX, mouseY) {
  // [x] !!! the position must be relative to the  gameBoard
  // wherever the gameBoard goes the ship will also be there
  const style = getComputedStyle(document.documentElement);
  const boardRect = gameBoard.getBoundingClientRect();
  const cellWidth = parseFloat(
    style.getPropertyValue("--cell-width").trim().slice(0, -2),
  );
  const cellHeight = parseFloat(
    style.getPropertyValue("--cell-height").trim().slice(0, -2),
  );
  const gapSize = parseFloat(
    style.getPropertyValue("--cell-gap").trim().slice(0, -2),
  );

  // convert coordinates of the mouse from px to viewPort units(vw, vh)
  const vwUnitValueInPxls = window.innerWidth / 100;
  const vhUnitValueInPxls = window.innerHeight / 100;

  // find X ship Position in vw
  const dropX = mouseX - boardRect.x;
  const diffX = dropX % ((cellWidth + gapSize) * vwUnitValueInPxls);
  const xInVw = (dropX - diffX) / vwUnitValueInPxls;

  // find Y ship Position in vh
  const dropY = mouseY - boardRect.y;
  const diffY = dropY % ((cellHeight + gapSize) * vwUnitValueInPxls);
  const yInVh = (dropY - diffY) / vhUnitValueInPxls;

  // turn positions from viewPort to %
  const x = (xInVw * 100) / (boardRect.width / vwUnitValueInPxls);
  const y = (yInVh * 100) / (boardRect.height / vhUnitValueInPxls);

  // calculate index of the first occupied cell in the gameBoard by the ship
  const cellWidthInPxls = cellWidth * vwUnitValueInPxls;
  const cellHeightInPxls = cellHeight * vwUnitValueInPxls;
  const gapSizeInPxls = gapSize * vwUnitValueInPxls;

  const xCell = Math.floor((dropX - diffX) / (cellWidthInPxls + gapSizeInPxls));
  const yCell = Math.floor(
    (dropY - diffY) / (cellHeightInPxls + gapSizeInPxls),
  );
  const index = yCell * 11 + xCell;

  return {
    xPos: x,
    yPos: y,
    gameBoradIndex: index,
  };
}

export { getShipsPoses };
