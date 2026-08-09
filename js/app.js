const startButton = document.querySelector("#start-button");

const playAgainButton = document.querySelector("#play-again-button");

const practiceDifficultButton = document.querySelector(
  "#practice-difficult-button",
);

const resetProgressButton = document.querySelector("#reset-progress-button");

startButton.addEventListener("click", () => {
  startGame();
});

playAgainButton.addEventListener("click", () => {
  startGame();
});

practiceDifficultButton.addEventListener("click", () => {
  startDifficultVerbsGame();
});

resetProgressButton.addEventListener("click", () => {
  const confirmed = confirm("Are you sure you want to reset your progress?");

  if (confirmed) {
    resetProgress();
  }
});
