import { createShips } from "./create-ui.js";

const HEIGHT = 20;
const WIDTH = 50;

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
  gameBoard.className = "gameBoard";

  // First, create all the cell elements and append them to gameBoard
  for (let i = 0; i <= 10; i++) {
    for (let j = 0; j <= 10; j++) {
      const index = i * 11 + j;
      const cell = document.createElement("div");
      cell.id = "cell" + index;
      // check if it's an appropriate cell to label with a letter
      if (j === 0) {
        if (i != 0) {
          cell.innerText = letters[i - 1];
        }
        cell.classList.add("numeric-cell");
      } else if (i === 0) {
        if (j != 0) {
          cell.innerText = j;
        }
        cell.classList.add("numeric-cell");
      } else {
        cell.classList.add("cell");
      }
      gameBoard.appendChild(cell);
    }
  }
  const ships = createShips();
  placeShipsDiv.append(gameBoard, ships);
  document.body.appendChild(placeShipsDiv);
}

export { getShipsPoses };
