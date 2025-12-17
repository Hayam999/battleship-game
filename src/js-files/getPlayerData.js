import "../style.css";
import { getPlayerGameBoard } from "./ui-logic/place-ships.js";

async function getPlayerData() {
  const startButtonContainer = document.querySelector(
    ".start-button-container",
  );
  const startBtn = document.querySelector(".start-button");
  const backgroundDiv = document.getElementById("background-container");

  //------------------------------------------------\\

  document.addEventListener(
    "DOMContentLoaded",
    function () {
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
    },
    { once: true },
  );

  async function startGame() {
    const playerName = await getPlayerName();
    if (playerName) {
      backgroundDiv.remove();
      startBtn.remove();
      const playerData = await getPlayerGameBoard();

      return {
        name: playerName,
        gameBoard: { rawData: playerData.rawData, uiData: playerData.uiData },
      };
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

      const inputField = document.getElementById("player-name");
      backgroundDiv.style.display = "none";
      document.body.style.backgroundColor = "#2E90A6";
      nameDialog.showModal();

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

  const result = new Promise((resolve) => {
    startBtn.addEventListener(
      "click",
      function () {
        const playerData = startGame();
        startBtn.style.display = "none";
        resolve(playerData);
      },
      { once: true },
    );
  });
  return result;
}

export { getPlayerData };
