import { createShips, createGameBoard } from "./create-ui.js";
import {
  createGameBoard as CreateRawGameBoard,
  shipNames,
} from "../backend-logic/data.js";

const cellSize = parseFloat(
  getComputedStyle(document.documentElement)
    .getPropertyValue("--cell-width")
    .trim(),
);

const cellGap = parseFloat(
  getComputedStyle(document.documentElement)
    .getPropertyValue("--cell-gap")
    .trim(),
);
/**
 * -------------------- Computer GameBoard --------------------
 */

/**
 *
 * @param {gb: GameBoard object filled with placed ships'}
 */
function getComputerGameBoard(gb) {
  const uiShips = createShips("computer");
  const uiGb = createGameBoard();
  uiGb.style.position = "relative";
  shipNames.forEach((ship) => {
    const currentRawShip = gb.ships[ship];
    const currentUiShip = uiShips[ship];
    positionUiShip(currentRawShip, currentUiShip, uiGb);
    currentUiShip.style.visibility = "hidden";
  });
  return uiGb;
}

/**
 * -------------------- Human GameBoard --------------------
 */

async function getPlayerGameBoard() {
  const gameBoardTable = CreateRawGameBoard();
  let placementController = null;
  const letsPlayDiv = document.createElement("div");
  letsPlayDiv.className = "lets-play-container";
  const letsPlay = document.createElement("button");
  letsPlay.id = "lets-play";
  letsPlay.className = "lets-play-btn";
  letsPlay.innerText = "Let's Play";
  letsPlayDiv.append(letsPlay);
  const placeShipsDiv = document.createElement("div");
  placeShipsDiv.id = "place-ships-div";
  const gameBoard = createGameBoard();
  gameBoard.id = "placing-ships-gameBoard";
  gameBoard.style.position = "relative";
  try {
    renderUiToPlaceShips();
    placementController = new AbortController();
    reviveShips(placementController.signal);

    const result = await new Promise((resolve) => {
      letsPlayDiv.addEventListener("click", () => {
        if (gameBoardTable.humanPlacedAllShips()) {
          cleanupPlacementListeners(placementController);
          const uiShips = createShips("computer");
          const uiGb = createGameBoard();
          uiGb.style.position = "relative";
          const rawShips = gameBoardTable.ships;
          shipNames.forEach((ship) => {
            const currentRawShip = rawShips[ship];
            const currentUiShip = uiShips[ship];
            positionUiShip(currentRawShip, currentUiShip, uiGb);
          });
          placeShipsDiv.remove();
          letsPlayDiv.remove();
          resolve({ rawData: gameBoardTable, uiData: uiGb });
        }
      });
    });
    return result;
  } catch (error) {
    console.error(`Failed to get Player Gameboard ${error}`);
    throw error;
  }

  function renderUiToPlaceShips() {
    const gameBoardWrapper = document.createElement("div");
    gameBoardWrapper.id = "gameBoard-container";
    const gameBoardHeader = document.createElement("h3");
    gameBoardHeader.id = "gameBoard-header";
    gameBoardHeader.innerText = "Game Board";

    gameBoardWrapper.append(gameBoardHeader, gameBoard);

    // Rules And Ships Section
    const shipsAndRulesWrapper = document.createElement("div");
    shipsAndRulesWrapper.id = "ships-n-rules-wrapper";

    // Ships Section
    const shipsWrapper = document.createElement("div");
    shipsWrapper.id = "ships-harbour";
    const shipsHeader = document.createElement("h3");
    shipsHeader.id = "ships-header";
    shipsHeader.innerText = "Ships";
    const advice = document.createElement("h5");
    advice.innerText = "drag and drop ships into the gameboard";
    const ships = createShips("human");
    shipsWrapper.append(shipsHeader, advice, ships);

    shipsAndRulesWrapper.append(shipsWrapper);

    placeShipsDiv.append(gameBoardWrapper, shipsAndRulesWrapper);
    const wrapper = document.createElement("div");
    wrapper.id = "placing-ships-wrapper";
    wrapper.append(placeShipsDiv, letsPlayDiv);
    document.body.appendChild(wrapper);
  }

  function reviveShips(signal) {
    const placeShipsDiv = document.getElementById("place-ships-div");
    const shipsDiv = document.getElementById("ships-div");
    placeShipsDiv.style.cursor = "grab";
    let isDragging = false;
    let draggedShip;
    let draggedShipName;
    let offsetX, offsetY;

    placeShipsDiv.addEventListener(
      "mousedown",
      (e) => {
        e.preventDefault();
        const parent = hasParentWithClass(e.target, "ship-container");
        draggedShipName = parent.id;

        if (parent) {
          isDragging = true;
          shipsDiv.style.cursor = "grabbing";
          draggedShip = parent;
          const rect = parent.getBoundingClientRect();
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;

          draggedShip.style.position = "fixed";
          draggedShip.style.left = e.clientX - offsetX + "px";
          draggedShip.style.top = e.clientY - offsetY + "px";
        }
      },
      { signal },
    );
    placeShipsDiv.addEventListener(
      "mousemove",
      (e) => {
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
      },
      { signal },
    );

    placeShipsDiv.addEventListener(
      "mouseup",
      (event) => {
        event.preventDefault();

        if (isDragging) {
          shipsDiv.style.cursor = "grab";
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

            const currentShip = gameBoardTable.ships[draggedShipName];
            currentShip.updateLocation(PosAndIndex.gameBoradIndex);
            const addShip = gameBoardTable.addShip(currentShip);
            if (!addShip) {
              currentShip.updateLocation(null);
              return;
            }
            /// !!!
            // position the ship in the gamebord responsively
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
      },
      { signal },
    );

    // rotating the ship functionality
    shipsDiv.addEventListener(
      "click",
      (e) => {
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
              ship.style.top = "0";
              ship.style.left = "0";
              ship.style.transformOrigin = "center";
              ship.style.zIndex = "1";
            }
          }
        }
      },
      { signal },
    );
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

    const xCell = Math.floor(
      (dropX - diffX) / (cellWidthInPxls + gapSizeInPxls),
    );
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
}
/******************************************************************/

function positionUiShip(currentRawShip, currentUiShip, uiGb) {
  const rawX = currentRawShip.pos.x;
  const rawY = currentRawShip.pos.y;

  const top = rawX * cellSize + cellGap * rawX;
  const left = rawY * cellSize + cellGap * rawY;

  uiGb.appendChild(currentUiShip);
  currentUiShip.style.position = "absolute";
  if (currentRawShip.dir == "v") {
    currentUiShip.style.top = top + "vw";
    currentUiShip.style.left = left + cellSize + "vw";
    currentUiShip.style.transformOrigin = "top left";
    currentUiShip.style.transform = `rotate(90deg)`;
  } else {
    currentUiShip.style.top = top + "vw";
    currentUiShip.style.left = left + "vw";
  }
}
function cleanupPlacementListeners(placementController) {
  if (placementController) {
    placementController.abort();
    placementController = null;
  }
}

export { getPlayerGameBoard, getComputerGameBoard };
