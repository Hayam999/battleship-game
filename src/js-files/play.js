import { createUiPlayground } from "./ui-logic/create-ui.js";

/**
 * @purpose Starts playing a complete round
 * @param {human:
 * {rawData: GameBoard, uiData: Visual GameBoard}}
 * @param {computer: {rawData: GameBoard, uiData: Visual GameBoard}}
 */
function play(human, computer) {
  const ocean = createUiPlayground(human.gameBoard.uiData, computer.uiData);
  document.body.appendChild(ocean);
  const enemyWaters = computer.uiData;
  const enemeyWaterBase = computer.rawData;
  let humanTurn = true;
  enemyWaters.addEventListener("click", (e) => {
    if (humanTurn) {
      const id = e.target.id;
      const index = parseInt(id.substring(4));
      const hit = shootComputerWaters(index);
      //TODO add shooting audio and setTimeOut until audio finishes
      setTimeout(() => {
        if (!hit) {
          humanTurn = false;
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
    enemeyWaterBase.shoot(index);
    computerTurn();
    return index;
  }

  /**
   *
   * @sideEffects {shoot human waters, if we hit a ship, shoot again until. Stop shooting when we miss the shoot}
   */
  function computerTurn() {
    return true;
  }
}

export { play };
