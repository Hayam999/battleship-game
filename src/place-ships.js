const HEIGHT = 25;
const WIDTH = 25;

async function getShipsPoses() {
  return new Promise((resolve) => {
    const positions = [];
    // Setup ship placement UI

    // TODO create and display a css Grid for the GameBoard labeling them just like the game labels it's gameBoard
    initUI();
    // TODO create a div to hold the ships and allow the ships to drag and drop

    // RETURN all positions that user have chose
    resolve([]);
  });
}

// TODO design ui for the user to place their ships

function initUI() {
  const placeShipsDiv = document.createElement("div");
  placeShipsDiv.id = "place-ships-div";

  // Creating the visual GameBoard
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const gameBoard = document.createElement("div");
  gameBoard.id = "placing-gameBoard";
  gameBoard.style.display = "grid";
  gameBoard.style.gridTemplateColumns = "repeat(11, 2rem)";
  gameBoard.style.gridTemplateRows = "repeat(11, 2rem)";

  // First, create all the cell elements and append them to gameBoard
  for (let i = 0; i <= 10; i++) {
    for (let j = 0; j <= 10; j++) {
      const index = i * 11 + j;
      const cell = document.createElement("div");
      cell.id = "cell" + index;
      cell.classList.add("grid-cell");
      cell.style.border = "1px solid black";
      cell.style.textAlign = "center";
      // check if it's an appropriate cell to label with a letter
      if (j === 0 && i != 0) {
        cell.innerText = letters[i - 1];
      } else if (i === 0 && j != 0) {
        cell.innerText = j;
      }
      gameBoard.appendChild(cell);
    }
  }

  // TODO design the UI Ships
  // Creating the Visual ships section

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 300;
  canvas.style.border = "1px solid black";
  canvas.id = "shipsCanvas";

  const shipSizes = [5, 4, 3, 3, 2];
  const shipNames = [
    "Carrier",
    "BattleShip",
    "Cruiser",
    "Submarine",
    "Destroy",
  ];
  let x = 50;
  let y = 50;
  // create ships
  for (let i = 0; i < 5; i++) {
    drawShip(x, y, WIDTH * shipSizes[i], ctx);
    x += WIDTH * shipSizes[i] + 50;
  }

  // how are we gonna activate the drag and drop features
  // add a button to confirm that all ships have been placed in the the right way to place ships and that all the ships have been placed and then save the gameboard with each ship in its postions

  placeShipsDiv.appendChild(gameBoard);
  placeShipsDiv.appendChild(canvas);
  document.body.appendChild(placeShipsDiv);
}

// Function to draw a battleship shape (square with triangle at one end)
function drawShip(x, y, width, ctx) {
  // Save the current context state
  ctx.save();
  ctx.fillStyle = "gray";
  ctx.beginPath();

  ctx.rect(x, y, width - HEIGHT / 2, HEIGHT);

  ctx.moveTo(x + width - HEIGHT / 2, y);
  ctx.lineTo(x + width, y + HEIGHT / 2);
  ctx.lineTo(x + width - HEIGHT / 2, y + HEIGHT);

  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
}
export { getShipsPoses };
