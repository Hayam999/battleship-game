import "./style.css";

document.addEventListener("DOMContentLoaded", function () {
  const loadingBar = document.querySelector(".loading-bar");
  const loadingPercentage = document.querySelector(".loading-percentage");
  const loadingContainer = document.querySelector(".loading-container");
  const startButtonContainer = document.querySelector(
    ".start-button-container",
  );

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
  document
    .querySelector(".start-button")
    .addEventListener("click", function () {
      // Start your game logic here
      console.log("Game started!");
      this.disabled = true;
      startButtonContainer.style.opacity = "0";
      // Initialize your game
    });
});
