import { createUiPlayground, addCircle } from "./ui-logic/create-ui.js";
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
  const winnerHits = 17;
  let humanHits = 0;
  let computerHits = 0;
  const InitguessArray = createArrayOfIndicies();
  let guessArray = [...InitguessArray];
  const computerWaters = computer.uiData;
  const computerWaterBase = computer.rawData;
  const humanWaters = human.gameBoard.uiData;
  const humanWaterBase = human.gameBoard.rawData;
  addCircle(computerWaters, "cell54", "red");
  addCircle(computerWaters, "cell89", "#6fc4ebff");

  let humanTurn = true;
  computerWaters.addEventListener("click", (e) => {
    if (humanTurn) {
      humanTurn = false;
      const id = e.target.id;
      const index = parseInt(id.substring(4));
      const hit = computerWaterBase.shoot(index);
      //TODO add shooting audio and setTimeOut until audio finishes
      setTimeout(() => {
        if (!hit) {
          computerTurn();
        } else {
          humanHits++;
          addCircle(computerWaters, "cell" + index, "red");
          if (humanHits == winnerHits) {
            declareWinner("human");
          } else {
            humanTurn = true;
          }
        }
      }, 2000);
    }
  });

  /**
   *
   * @sideEffects {shoot human waters, if we hit a ship, shoot again until. Stop shooting when we miss the shoot}
   */
  function computerTurn() {
    const index = guess();
    console.log(guessArray);
    const hitShip = humanWaterBase.shoot(index);
    setTimeout(() => {
      if (hitShip) {
        addCircle(humanWaters, "cell" + index, "red");
        computerHits++;
        if (computerHits == winnerHits) {
          declareWinner(computer);
        } else {
          computerTurn();
        }
      } else {
        humanTurn = true;
        return;
      }
    }, 2000);
  }

  function declareWinner(winner) {
    return winner;
  }

  function guess() {
    const randomNum = Math.floor(Math.random() * guessArray.length);
    const index = guessArray[randomNum];
    guessArray.splice(randomNum, 1);
    return index;
  }
}

export { play };
