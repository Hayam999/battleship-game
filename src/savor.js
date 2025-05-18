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
  const placeShipsDiv = document.getElementById("place-ships-div");
  const shipHarbour = document.getElementById("ships-harbour");
  const gameBoard = document.getElementById("placing-ships-gameBoard");
  const shipsDiv = document.getElementById("ships-div");

  gameBoard.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  });
  placeShipsDiv.addEventListener("dragstart", (e) => {
    const dragEle = e.target.closest(".ship-container");
    if (!dragEle) return; // Guard clause if no ship container was found

    // Remove any previous ghost elements
    const oldGhost = document.getElementById("drag-ghost");
    if (oldGhost) oldGhost.remove();

    // Create a proper ghost element that maintains rotation and styling
    const ghostEle = dragEle.cloneNode(true);
    ghostEle.id = "drag-ghost";
    ghostEle.style.position = "absolute";
    ghostEle.style.top = "-9999px";
    ghostEle.style.left = "-9999px";
    ghostEle.style.opacity = "0.8"; // Make it slightly transparent
    ghostEle.style.pointerEvents = "none"; // Prevent it from interfering with other elements

    // Copy computed styles from the original element
    const computedStyle = window.getComputedStyle(dragEle);

    // Apply rotation and transform origin
    ghostEle.style.transform = computedStyle.transform;
    ghostEle.style.transformOrigin = computedStyle.transformOrigin;

    // Make sure all canvas elements are visible
    const canvases = ghostEle.querySelectorAll("canvas");
    canvases.forEach((canvas) => {
      const originalCanvas = dragEle.querySelector(`canvas[id="${canvas.id}"]`);
      if (originalCanvas) {
        // Copy the canvas content
        const context = canvas.getContext("2d");
        canvas.width = originalCanvas.width;
        canvas.height = originalCanvas.height;
        context.drawImage(originalCanvas, 0, 0);
      }
    });

    // Append to body
    document.body.appendChild(ghostEle);

    // Calculate proper offset for drag image based on rotation
    const rect = dragEle.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // Set the drag image with proper positioning
    e.dataTransfer.setDragImage(ghostEle, offsetX, offsetY);

    // Set data for the drop event
    e.dataTransfer.setData("text/plain", dragEle.id);
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
