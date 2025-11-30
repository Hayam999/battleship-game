import {
  createShips,
  createGameBoard,
  createPlacingShipsRules,
} from "./create-ui.js";

import { Ship, GameBoard } from "../backend-logic/data.js";

// create raw data for ships presence
const shipsDic = [
  { name: "carrier", length: 5 },
  { name: "battleShip", length: 4 },
  { name: "cruiser", length: 3 },
  { name: "submarine", length: 3 },
  { name: "destroy", length: 2 },
];

// store each single ship with its metadata in a dictionary
const shipsTable = {};

for (let i = 0; i < shipsDic.length; i++) {
  const ship = shipsDic[i];
  const newKey = ship.name;
  const newShip = Ship(ship.name, ship.length, null, "h");
  shipsTable[newKey] = newShip;
}

const gameBoardTable = GameBoard(shipsTable);

// create ui data for ships presence
// const HEIGHT = 20;
// const WIDTH = 50;
// const styles = getComputedStyle(document.documentElement);

async function getPlayerGameBoard() {
  try {
    renderUiToPlaceShips();
    reviveShips();
  } catch (error) {
    console.error(`Failed to get Player Gameboard ${error}`);
    throw error;
  }
}

function renderUiToPlaceShips() {
  const placeShipsDiv = document.createElement("div");
  placeShipsDiv.id = "place-ships-div";

  const gameBoardWrapper = document.createElement("div");
  gameBoardWrapper.id = "gameBoard-container";
  const gameBoardHeader = document.createElement("h3");
  gameBoardHeader.id = "gameBoard-header";
  gameBoardHeader.innerText = "Game Board";
  const gameBoard = createGameBoard();
  gameBoard.id = "placing-ships-gameBoard";
  gameBoard.style.position = "relative";
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

  // let's play btn
  const letsPlay = document.createElement("button");
  letsPlay.id = "lets-play";
  letsPlay.innerText = "Let's Play";
  letsPlay.addEventListener("click", () => {
    checkRules();
  });

  // Ships Section
  const shipsWrapper = document.createElement("div");
  shipsWrapper.id = "ships-harbour";
  const shipsHeader = document.createElement("h3");
  shipsHeader.id = "ships-header";
  shipsHeader.innerText = "Ships";
  const ships = createShips();
  shipsWrapper.append(shipsHeader, ships);

  shipsAndRulesWrapper.append(rulesWrapper, shipsWrapper);

  placeShipsDiv.append(gameBoardWrapper, shipsAndRulesWrapper, letsPlay);
  document.body.appendChild(placeShipsDiv);
}

function reviveShips() {
  const placeShipsDiv = document.getElementById("place-ships-div");
  const gameBoard = document.getElementById("placing-ships-gameBoard");
  const shipsDiv = document.getElementById("ships-div");
  let isDragging = false;
  let draggedShip;
  let draggedShipName;
  let offsetX, offsetY;

  placeShipsDiv.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const parent = hasParentWithClass(e.target, "ship-container");
    draggedShipName = parent.id;

    if (parent) {
      isDragging = true;
      draggedShip = parent;
      const rect = parent.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      draggedShip.style.position = "fixed";
      draggedShip.style.left = e.clientX - offsetX + "px";
      draggedShip.style.top = e.clientY - offsetY + "px";
    }
  });
  placeShipsDiv.addEventListener("mousemove", (e) => {
    if (isDragging) {
      if (draggedShip.classList.contains("rotated")) {
        const rect = draggedShip.getBoundingClientRect();
        const oldW = rect.height;
        const oldH = rect.width;
        const movingX = oldW / 2 - oldH / 2;

        draggedShip.style.left = e.clientX - movingX + "px";
        draggedShip.style.top = e.clientY + movingX + "px";
      } else {
        draggedShip.style.left = e.clientX + "px";
        draggedShip.style.top = e.clientY + "px";
      }
    }
  });

  placeShipsDiv.addEventListener("mouseup", (event) => {
    event.preventDefault();

    if (isDragging) {
      const gameBoardRec = gameBoard.getBoundingClientRect();
      if (
        event.clientX >= gameBoardRec.left &&
        event.clientX <= gameBoardRec.right &&
        event.clientY >= gameBoardRec.top &&
        event.clientY <= gameBoardRec.bottom
      ) {
        const PosAndIndex = clacPosAndIndex(
          gameBoard,
          event.clientX,
          event.clientY,
        );
        const currentShip = shipsTable[draggedShipName];

        currentShip.index = PosAndIndex.gameBoradIndex;

        // position the ship in the gamebord accurately

        gameBoard.appendChild(draggedShip);
        draggedShip.style.position = "absolute";

        if (draggedShip.classList.contains("rotated")) {
          const n = calcNewPos(
            PosAndIndex.xInPx,
            PosAndIndex.yInPx,
            draggedShip,
            gameBoard,
          );
          draggedShip.style.top = n.y + "%";
          draggedShip.style.left = n.x + "%";
        } else {
          draggedShip.style.top = PosAndIndex.yPos + "%";
          draggedShip.style.left = PosAndIndex.xPos + "%";
        }

        isDragging = false;
        draggedShip = null;
        offsetX = null;
        offsetY = null;
      }
    }
  });

  // rotating the ship functionality
  shipsDiv.addEventListener("click", (e) => {
    // get ship from gameboard
    // change dir accordingly
    if (e.target.classList.contains("turn-ship")) {
      const shipId = e.target.id.substring(5);
      const ship = document.getElementById(shipId);
      const shipData = gameBoardTable.ships[shipId];
      if (shipsDiv.contains(ship)) {
        if (ship.classList.contains("rotated")) {
          ship.style.transform = `rotate(0deg)`;
          shipData.dir = "h";
          ship.classList.remove("rotated");
        } else {
          ship.style.transform = `rotate(90deg)`;
          ship.classList.add("rotated");
          shipData.dir = "v";

          ship.style.position = "relative";
          ship.style.top = "100%";
          ship.style.left = "100%";
          ship.style.transformOrigin = "center";
          ship.style.zIndex = "1";
        }
        console.log(`${shipData.dir}`);
      }
    }
  });
}

function clacPosAndIndex(gameBoard, mouseX, mouseY) {
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
    xInPx: xInVw * vwUnitValueInPxls,
    yInPx: yInVh * vhUnitValueInPxls,
  };
}

function hasParentWithClass(element, className) {
  let currentElement = element;

  while (currentElement !== null) {
    if (
      currentElement.classList &&
      currentElement.classList.contains(className)
    ) {
      return currentElement;
    }
    currentElement = currentElement.parentElement;
  }

  return false;
}

// return new (x,y) poses for the ship after rotation, using the (x,y) poses returned by calcPosAndIndex
// Why? Because the old position was accurate for the horizontal ship but it does not suit the vertical ship
function calcNewPos(oldX, oldY, ship, gameboard) {
  const boardRect = gameboard.getBoundingClientRect();

  const rect = ship.getBoundingClientRect();
  const oldWidth = rect.height;
  const oldHeight = rect.width;

  const xInPx = oldX - (oldWidth / 2 - oldHeight / 2);
  const yInPx = oldY + (oldWidth / 2 - oldHeight / 2);

  const newX = (xInPx * 100) / boardRect.width;
  const newY = (yInPx * 100) / boardRect.height;
  return { x: newX, y: newY };
}

function checkRules() {
  // all ships must be within allowed grid cells
  // No overlapping between ships
  // all ships must be placed somewhere
  // at least on grid around the whole ship must be empty

  for (let i = 0; i < shipsDic.length; i++) {
    const key = shipsDic[i].name;
    const ship = gameBoardTable.ships[key];
    const index = ship.index;
    if (!index) {
      return {
        skipped: false,
        msg: "All ships must take its place on the gameboard",
      };
    }
    const indexArr = getIndexArr(ship);
    const ValidBoundries = checkBoundries(indexArr, ship.name, ship.dir);
    if (!ValidBoundries.skipped) {
      return { skipped: false, msg: ValidBoundries.msg };
    }
    const validLocation = checkLocation(indexArr, ship);
    if (!validLocation.skipped) {
      return { skipped: false, msg: validLocation.msg };
    }
  }
}

/**
 * @param indexArr => array of indecies on the grid.
 * @param ship => the ship that occupies given indecies from indexArr on gameboard.
 * --------------------------------------
 * @purpose check given conditions:
 * =======> 1) ship do not overlap with any other ship.
 * =======> 2) ship has 1 there is at least 1 empty square around the ship from all directions except valid boundries.
 * --------------------------------------
 * @returns {skepped: boolean , msg: String explains proplem when skipped is false}
 */

function checkLocation(indexArr, ship) {
  return true;
}
function checkBoundries(indexArr, name, dir) {
  const first = indexArr[0];
  const last = indexArr[indexArr.length - 1];

  // assure first cell of ship doesn't land on the first row or the first column
  if (first <= 10 || first % 11 == 0) {
    return {
      skipped: false,
      msg: `The ship: ${name} starts off the gameboard`,
    };
  }

  // assure last cell of ship isn't off gameboard
  if (dir == "h") {
    const firstIndexInRow = first - (first % 11);
    const lastIndexInRow = firstIndexInRow + 10;
    if (last > lastIndexInRow) {
      return {
        skipped: false,
        msg: `The ship: ${name} ends off the gameboard`,
      };
    }
  } else if (dir == "v") {
    if (last > 120) {
      return {
        skipped: false,
        msg: `The ship: ${name} ends off the gameboard`,
      };
    }
  } else {
    return {
      skipped: false,
      msg: `The ship: ${name} don't have a valid direction`,
    };
  }
  return { skipped: true, msg: "" };
}

function getIndexArr(ship) {
  let step;
  let indexArr = [];
  console.log(ship);
  console.log(ship.dir);
  if (ship.dir == "h") {
    step = 1;
  } else if (ship.dir == "v") {
    step = 11;
  } else {
    return {
      msg: "ship doesn't have a valid dirction",
      insructions: "Make sure the ship exists and it have a valid dirction",
    };
  }
  let currentIndex = ship.index;
  for (let i = 0; i < ship.length; i++) {
    indexArr.push(currentIndex);
    currentIndex = currentIndex + step;
  }
  return indexArr;
}

export { getPlayerGameBoard };
