const ships = [
  ["carrier", 5],
  ["battleShip", 4],
  ["cruiser", 3],
  ["submarine", 3],
  ["destroy", 2],
];

const cellSize = getComputedStyle(document.documentElement)
  .getPropertyValue("--cell-width")
  .trim();

const cellGap = getComputedStyle(document.documentElement)
  .getPropertyValue("--cell-gap")
  .trim();
export function createShips(user) {
  let result;
  if (user == "human") {
    const shipsDiv = document.createElement("div");
    shipsDiv.id = "ships-div";

    ships.forEach((ship) => {
      const currentShip = createHumanShip(ship[0], ship[1]);
      shipsDiv.appendChild(currentShip);
    });
    result = shipsDiv;
  } else if (user == "computer") {
    const shipsObject = {};
    ships.forEach((ship) => {
      const currentShip = createComputerShip(ship[0], ship[1]);
      shipsObject[ship[0]] = currentShip;
    });
    result = shipsObject;
  }
  return result;
}

function createComputerShip(name, numOfCells) {
  return createShip(name, numOfCells, false);
}

function createHumanShip(name, numOfCells) {
  const shipCover = document.createElement("div");
  shipCover.className = "ship-cover";
  shipCover.id = name + "-cover-div";

  const nameAndBtn = document.createElement("div");
  nameAndBtn.classList = "ship-name-and-turn-btn-div";

  const shipName = document.createElement("div");
  shipName.className = "ship-name";
  shipName.innerText = name + ": x" + numOfCells.toString();
  nameAndBtn.appendChild(shipName);

  const turnBtn = createTurnBtn();
  turnBtn.id = "turn " + name;
  nameAndBtn.appendChild(turnBtn);

  shipCover.appendChild(nameAndBtn);
  const shipContainer = createShip(name, numOfCells, true);
  shipCover.appendChild(shipContainer);
  return shipCover;
}

function createShip(name, numOfCells, dragShip) {
  //  this function will create and return just one Ship
  // and give it a name just on top of it

  // creating the ship
  const shipContainer = document.createElement("div");
  shipContainer.className = "ship-container";
  shipContainer.draggable = dragShip;
  shipContainer.id = name;
  shipContainer.style.display = "grid";
  shipContainer.style.gridTemplateColumns =
    "repeat(" + numOfCells.toString() + "," + cellSize + ")";
  shipContainer.style.gridTemplateRows = "repeat(1, " + cellSize + ")";
  shipContainer.style.gap = cellGap;

  // giving a proper class Name to each cell of the ship to help styling it
  for (let i = 0; i < numOfCells; i++) {
    const cell = document.createElement("div");
    cell.id = name + (i + 1);
    if (i === 0) {
      cell.classList.add("front");
      drawCell(cell, "front");
    } else if (i === numOfCells - 1) {
      cell.classList.add("back");
      drawCell(cell, "back");
    } else {
      cell.classList.add("middle");
      drawCell(cell, "middle");
    }
    cell.classList.add("cell");
    shipContainer.appendChild(cell);
  }

  return shipContainer;
}

// paint the cell according to it's position in the ship
function drawCell(cell, direction) {
  const canvas = document.createElement("canvas");
  const canvaSize = parseFloat(cellSize) * (window.innerWidth / 100);

  canvas.width = canvaSize;
  canvas.height = canvaSize;

  const ctx = canvas.getContext("2d");
  const yDownValue = canvaSize / 5;
  const recHeight = canvaSize - yDownValue * 2;
  const xCurveBegin = 30;
  const xCurvePeak = 10;
  const yCurvePeak = yDownValue + recHeight / 2;

  if (direction === "middle") {
    ctx.fillRect(0, yDownValue, canvaSize, recHeight);
    ctx.save();
  } else if (direction === "front") {
    ctx.beginPath();
    ctx.moveTo(canvaSize, yDownValue);
    ctx.lineTo(xCurveBegin, yDownValue);
    ctx.quadraticCurveTo(30, yDownValue, xCurvePeak, yCurvePeak);
    ctx.quadraticCurveTo(
      xCurvePeak,
      yCurvePeak,
      xCurveBegin,
      canvaSize - yDownValue,
    );
    ctx.lineTo(canvaSize, canvaSize - yDownValue);
    ctx.fill();
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.save();
  } else if (direction === "back") {
    ctx.beginPath();
    ctx.moveTo(0, yDownValue);
    ctx.lineTo(canvaSize - xCurveBegin, yDownValue);
    ctx.quadraticCurveTo(
      canvaSize - xCurveBegin,
      yDownValue,
      canvaSize - xCurvePeak,
      yCurvePeak,
    );
    ctx.quadraticCurveTo(
      canvaSize - xCurvePeak,
      yCurvePeak,
      canvaSize - xCurveBegin,
      canvaSize - yDownValue,
    );
    ctx.lineTo(0, canvaSize - yDownValue);
    ctx.fill();
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.save();
  }
  cell.appendChild(canvas);
}

export function createGameBoard() {
  // Creating the visual GameBoard
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const gameBoard = document.createElement("div");

  gameBoard.className = "gameBoard";

  // First, create all the cell elements and append them to gameBoard
  for (let i = 0; i <= 10; i++) {
    for (let j = 0; j <= 10; j++) {
      const index = i * 11 + j;
      const cell = document.createElement("div");
      cell.id = "cell" + index;
      // check if it's an appropriate cell to label with a letter
      if (j === 0) {
        cell.classList.add("numeric-cell");
      } else if (i === 0) {
        cell.classList.add("numeric-cell");
      } else if (j === 10 && i != 0) {
        cell.classList.add("back");
        cell.classList.add("cell");
      } else if (j === 1 && i != 0) {
        cell.classList.add("front");
        cell.classList.add("cell");
      } else {
        cell.classList.add("cell");
        cell.classList.add("middle");
      }
      gameBoard.appendChild(cell);
    }
  }
  return gameBoard;
}

export function createPlacingShipsRules() {
  const rulesDiv = document.createElement("div");
  rulesDiv.className = "rulesDiv";

  // rules to place the ships content
  const rulesContent = document.createElement("div");
  rulesContent.innerText =
    "- Ships must be placed horizontally or vertically, never diagonally. \n  - Ships can't overlap each other. \n - At least one square is required between ships.";

  rulesDiv.appendChild(rulesContent);
  return rulesDiv;
}

export function createTurnBtn() {
  const btn = document.createElement("button");
  btn.className = "turn-ship";

  const svg = document.createElement("div");
  svg.className = "turn-ship-svg";

  // Set the text content using a text node instead
  const textNode = document.createTextNode("Rotate");
  textNode.id = "rotate";

  // Add both elements to the button
  btn.appendChild(textNode);
  btn.appendChild(svg);

  return btn;
  // [x]!!! style btn and make svg visible;
}
export function createGameRules() {
  const gameRules = document.createElement("div");
  gameRules.textContent = "Game Rules";
  return gameRules;
}

/**
 * @purpose Crafts visual playground
 * @param {computerGb: visual gameBoard for computer}
 * @param {humanGb: visual gameboard for computer}
 * @returns HtmlDivElement holding gameboards
 */
export function createUiPlayground(humanGb, computerGb) {
  const ocean = document.createElement("div");
  ocean.id = "ocean";
  const header = document.createElement("h1");
  header.id = "battlespace-header";
  header.innerText = "Battleship";

  const friendlyWaters = document.createElement("div");
  friendlyWaters.id = "friendly-waters";
  const enemyWaters = document.createElement("div");
  enemyWaters.id = "enemy-waters";
  friendlyWaters.appendChild(humanGb);
  enemyWaters.appendChild(computerGb);

  const battlespace = document.createElement("div");
  battlespace.id = "battlespace";
  battlespace.append(enemyWaters, friendlyWaters);

  ocean.append(header, battlespace);
  return ocean;
}

export function addCircle(uiGb, cellId, color) {
  console.log(cellId);
  const cell = uiGb.querySelector("#" + cellId);
  const canvas = document.createElement("canvas");

  const canvaSize = parseFloat(cellSize) * (window.innerWidth / 100);
  const ctx = canvas.getContext("2d");
  canvas.width = canvaSize;
  canvas.height = canvaSize;

  const centerX = canvaSize / 2;
  const centerY = canvaSize / 2;
  const radius = canvaSize / 4;

  ctx.fillStyle = color;
  ctx.beginPath(); // Good practice to add this
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  ctx.fill();

  cell.appendChild(canvas);
  canvas.style.position = "relative";
  canvas.style.zIndex = 3;
}
