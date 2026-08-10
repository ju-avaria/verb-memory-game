const startButton = document.querySelector("#start-button");

const playAgainButton = document.querySelector("#play-again-button");

const practiceDifficultButton = document.querySelector(
  "#practice-difficult-button",
);

const themeToggleButton = document.querySelector("#theme-toggle-button");

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

themeToggleButton.addEventListener("click", () => {
  toggleTheme();
});

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-theme");

    themeToggleButton.textContent = "Light Mode";
  } else {
    document.body.classList.remove("dark-theme");

    themeToggleButton.textContent = "Dark Mode";
  }
}

function toggleTheme() {
  const isDark = document.body.classList.contains("dark-theme");

  const newTheme = isDark ? "light" : "dark";

  applyTheme(newTheme);

  localStorage.setItem("theme", newTheme);
}

const savedTheme = localStorage.getItem("theme") || "light";

applyTheme(savedTheme);
