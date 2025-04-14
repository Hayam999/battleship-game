import "./style.css";
import { controlGameFlow } from "./game-flow";
import { getShipsPoses } from "./place-ships";

const startButtonContainer = document.querySelector(".start-button-container");
const startBtn = document.querySelector(".start-button");
const backgroundDiv = document.getElementById("background-container");
startBtn.addEventListener("click", function () {
  // Start your game logic here
  startGame();
  startBtn.style.display = "none";
  // Initialize your game
});

document.addEventListener("DOMContentLoaded", function () {
  const loadingBar = document.querySelector(".loading-bar");
  const loadingPercentage = document.querySelector(".loading-percentage");
  const loadingContainer = document.querySelector(".loading-container");

  // Simulate loading (replace with your actual asset loading logic)
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += 5;
    loadingBar.style.width = progress + "%";
    loadingPercentage.textContent = progress + "%";

    if (progress >= 100) {
      clearInterval(loadingInterval);
      // When loading completes, replace loading bar with start button
      setTimeout(() => {
        // Hide loading container
        loadingContainer.style.opacity = "0";
        loadingContainer.style.transition = "opacity 0.5s ease";

        setTimeout(() => {
          loadingContainer.style.display = "none";
          // Show start button in the same position
          startButtonContainer.style.display = "block";
          setTimeout(() => {
            startButtonContainer.style.opacity = "1";
            startButtonContainer.style.transition = "opacity 0.5s ease";
          }, 10);
        }, 500);
      }, 300);
    }
  }, 200);

  // Start button click handler
});

async function startGame() {
  const playerName = await getPlayerName();

  if (playerName) {
    backgroundDiv.remove();
    startBtn.remove();
    const positions = await getShipsPoses();
    // TODO create a player object or pass the name to a function that does that for you and use positions to create the gameBord that is for the player
    // TODO keep the game flow and hand it to another function that is not startGame
  } else {
    waitToStart();
  }
}

function waitToStart() {
  startBtn.style.display = "block";
  backgroundDiv.style.display = "flex";
  document.body.style.backgroundColor = "#ffffff";
}

async function getPlayerName() {
  return new Promise((resolve) => {
    const nameDialog = document.getElementById("name-dialog");
    const cancelNamebtn = document.getElementById("cancel-name");
    const inputField = document.getElementById("player-name");
    backgroundDiv.style.display = "none";
    document.body.style.backgroundColor = "#2E90A6";
    nameDialog.showModal();
    cancelNamebtn.addEventListener("click", () => {
      inputField.value = "";
      nameDialog.close();
      resolve(null);
    });
    inputField.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = inputField.value;
        inputField.value = "";
        nameDialog.close();
        resolve(value);
      }
    });
  });
}

export { startGame, getPlayerName };
