import {
  createShips,
  createGameBoard,
  createPlacingShipsRules,
} from "./create-ui.js";

import { Ship } from "../backend-logic/data.js";

// create raw data for ships presence
const shipsDic = [
  { name: "carrier", length: 5 },
  { name: "battleShip", length: 4 },
  { name: "cruiser", length: 3 },
  { name: "submarine", length: 3 },
  { name: "destroy", length: 2 },
];

// store each single ship with its metadata in a dictionary
const shipsDb = {};

for (let i = 0; i < shipsDic.length; i++) {
  const ship = shipsDic[i];
  const newKey = ship.name;
  const newShip = Ship(ship.name, ship.length, null, null);
  shipsDb[newKey] = newShip;
}

// create ui data for ships presence
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
        const currentShip = shipsDb[draggedShipName];

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
    if (e.target.classList.contains("turn-ship")) {
      const shipId = e.target.id.substring(5);
      const ship = document.getElementById(shipId);
      if (shipsDiv.contains(ship)) {
        if (ship.classList.contains("rotated")) {
          ship.style.transform = `rotate(0deg)`;
          ship.classList.remove("rotated");
        } else {
          ship.style.transform = `rotate(90deg)`;
          ship.classList.add("rotated");

          ship.style.position = "relative";
          ship.style.top = "100%";
          ship.style.left = "100%";
          ship.style.transformOrigin = "center";
          ship.style.zIndex = "1";
        }
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

export { getShipsPoses };
