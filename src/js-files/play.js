import {
  createUiPlayground,
  addCircle,
  createFinal,
} from "./ui-logic/create-ui.js";
import { createArrayOfIndicies } from "./backend-logic/data.js";
import shootMp3 from "../assets/shoot.mp3";
import boomMp3 from "../assets/boom.mp3";
import oceanMp3 from "../assets/ocean.mp3";
import humanLoseMp3 from "../assets/humanLose.mp3";
import humanWinMp3 from "../assets/humanWin.mp3";
import radioMp3 from "../assets/radio.mp3";

/**
 * @purpose Starts playing a complete round
 * @param {human:
 * {rawData: GameBoard, uiData: Visual GameBoard}}
 * @param {computer: {rawData: GameBoard, uiData: Visual GameBoard}}
 */

function play(human, computer) {
  const oceanSound = new Audio(oceanMp3);
  const shotSound = new Audio(shootMp3);
  const boomSound = new Audio(boomMp3);
  const humanLoseSound = new Audio(humanLoseMp3);
  const humanWinSound = new Audio(humanWinMp3);
  const radioSound = new Audio(radioMp3);
  let oceanSoundOn = true;
  oceanSound.play();
  radioSound.play();
  oceanSound.addEventListener("error", (e) => {
    console.error("Audio load error:", e);
    console.error("Error code:", oceanSound.error?.code);
    console.error("Error message:", oceanSound.error?.message);
  });
  oceanSound.addEventListener(
    "ended",
    () => {
      if (oceanSoundOn) {
        this.currentTime = 0;
        this.play();
      }
    },
    false,
  );
  radioSound.addEventListener(
    "ended",
    () => {
      if (oceanSoundOn) {
        this.currentTime = 0;
        this.play();
      }
    },
    false,
  );

  /*********/

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
  let humanTurn = true;
  computerWaters.addEventListener("click", (e) => {
    if (humanTurn) {
      shotSound.currentTime = 0;
      shotSound.play();
      humanTurn = false;
      const id = e.target.id;
      const index = parseInt(id.substring(4));
      const shot = computerWaterBase.shoot(index);
      if (shot.hit) {
        addCircle(computerWaters, "cell" + index, "red");
      } else {
        addCircle(computerWaters, "cell" + index, "#56a5eeff");
      }
      //TODO add shooting audio and setTimeOut until audio finishes
      setTimeout(() => {
        if (!shot.hit) {
          computerTurn();
        } else {
          humanHits++;
          if (shot.isSunk) {
            revealShip(shot.ship);
          }
          if (humanHits == winnerHits) {
            declareWinner("human");
          } else {
            humanTurn = true;
          }
        }
      }, 1000);
    }
  });

  /**
   *
   * @sideEffects {shoot human waters, if we hit a ship, shoot again until. Stop shooting when we miss the shoot}
   */
  function computerTurn() {
    const index = guess();
    boomSound.currentTime = 0;
    boomSound.play();
    const shot = humanWaterBase.shoot(index);
    if (shot.hit) {
      addCircle(humanWaters, "cell" + index, "red");
    } else {
      addCircle(humanWaters, "cell" + index, "#56a5eeff");
    }
    setTimeout(() => {
      if (shot.hit) {
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
    }, 1000);
  }

  function declareWinner(winner) {
    ocean.remove();
    const finalScene = createFinal(winner);
    document.body.append(finalScene);
    if (winner == "human") {
      humanWinSound.play();
    } else if (winner == "computer") {
      humanLoseSound.play();
    } else {
      throw new Error("invalid winner");
    }
  }

  function guess() {
    const randomNum = Math.floor(Math.random() * guessArray.length);
    const index = guessArray[randomNum];
    guessArray.splice(randomNum, 1);
    return index;
  }
  /*
  @purpose: reveals the given ship in the computer gameboard
   */
  function revealShip(ship) {
    const uiShip = computerWaters.querySelector("#" + ship);
    uiShip.style.visibility = "visible";
  }
}

export { play };
