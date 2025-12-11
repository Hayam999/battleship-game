import { createUiPlayground } from "./ui-logic/create-ui.js";
import { createArrayOfIndicies } from "./backend-logic/data.js";

/**
 * @purpose Starts playing a complete round
 * @param {human:
 * {rawData: GameBoard, uiData: Visual GameBoard}}
 * @param {computer: {rawData: GameBoard, uiData: Visual GameBoard}}
 */

function play(human, computer) {
  const ocean = createUiPlayground(human.gameBoard.uiData, computer.uiData);
  document.body.appendChild(ocean);

  const InitguessArray = createArrayOfIndicies();
  let guessArray = [...InitguessArray];
  const computerWaters = computer.uiData;
  const computerWaterBase = computer.rawData;
  const humanWaters = human.gameBoard.uiData;
  const humanWaterBase = human.gameBoard.rawData;

  let humanTurn = true;
  computerWaters.addEventListener("click", (e) => {
    if (humanTurn) {
      humanTurn = false;
      const id = e.target.id;
      const index = parseInt(id.substring(4));
      const hit = shootComputerWaters(index);
      //TODO add shooting audio and setTimeOut until audio finishes
      setTimeout(() => {
        if (!hit) {
          computerTurn();
        } else {
          humanTurn = true;
        }
      }, 2000);
    }
  });

  /**
   *
   * @param {index} the index of the shooted cell;
   * @returns Boolean: ture if human hit a computer ship, false if missed the hit
   */

  function shootComputerWaters(index) {
    const hitShip = computerWaterBase.shoot(index);
    return hitShip;
  }

  /**
   *
   * @sideEffects {shoot human waters, if we hit a ship, shoot again until. Stop shooting when we miss the shoot}
   */
  function computerTurn() {
    const index = guess();
    const hitShip = humanWaterBase.shoot(index);
    setTimeout(() => {
      if (hitShip) {
        computerTurn();
      } else {
        humanTurn = true;
        return;
      }
    });
    // guess an index;
    // shoot human waters;
    // if shoot on ship take another turen
    // else set humanTurn to true;
  }

  function guess() {
    const randomNum = Math.floor(Math.random() * guessArray.length);
    const index = guessArray[randomNum];
    guessArray.splice(randomNum, 1);
    return index;
  }
}

export { play };
