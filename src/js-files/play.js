import { createUiPlayground } from "./ui-logic/create-ui.js";

/**
 * @purpose Starts playing a complete round
 * @param {human:
 * {rawData: GameBoard, uiData: Visual GameBoard}}
 * @param {computer: {rawData: GameBoard, uiData: Visual GameBoard}}
 */
function play(human, computer) {
  const ocean = createUiPlayground(human.gameBoard.uiData, computer.uiData);
  document.body.append(ocean);
}

export { play };
