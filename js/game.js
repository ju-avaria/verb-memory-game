let firstCard = null;
let secondCard = null;
let boardLocked = false;

let attempts = 0;
let matchedPairs = 0;
let totalPairs = 5;

let verbErrors = loadVerbErrors();

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled;
}

function selectRandomVerbs(amount, type = "all") {
  let availableVerbs;

  if (type === "regular") {
    availableVerbs = verbs.filter((verb) => verb.type === "regular");
  } else if (type === "irregular") {
    availableVerbs = verbs.filter((verb) => verb.type === "irregular");
  } else {
    availableVerbs = [...verbs];
  }

  const shuffledVerbs = shuffleArray(availableVerbs);

  return shuffledVerbs.slice(0, amount);
}

function createCards(selectedVerbs, mode) {
  const cards = [];

  selectedVerbs.forEach((verb) => {
    cards.push({
      verbId: verb.id,
      value: verb.infinitive,
      role: "infinitive",
    });

    let secondValue;
    let secondRole;

    if (mode === "past") {
      secondValue = verb.past;
      secondRole = "past";
    } else if (mode === "participle") {
      secondValue = verb.participle;
      secondRole = "participle";
    } else if (mode === "gerund") {
      secondValue = verb.gerund;
      secondRole = "gerund";
    } else {
      secondValue = verb.spanish;
      secondRole = "spanish";
    }

    cards.push({
      verbId: verb.id,
      value: secondValue,
      role: secondRole,
    });
  });

  return shuffleArray(cards);
}

function startGame() {
  const victoryMessage = document.querySelector("#victory-message");

  victoryMessage.classList.add("hidden");

  resetTurn();

  attempts = 0;
  matchedPairs = 0;

  const settings = getGameSettings();

  updateGameInfo(settings);

  totalPairs = settings.amount;

  updateStats();

  const selectedVerbs = selectRandomVerbs(settings.amount, settings.type);

  const cards = createCards(selectedVerbs, settings.mode);

  renderCards(cards);
}

function renderCards(cards) {
  const gameBoard = document.querySelector("#game-board");

  gameBoard.innerHTML = "";

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.setAttribute("tabindex", "0");

    cardElement.classList.add("card");

    cardElement.dataset.verbId = card.verbId;
    cardElement.dataset.role = card.role;

    cardElement.innerHTML = `
            <span class="card-hidden">?</span>
            <span class="card-value">${card.value}</span>
        `;

    cardElement.addEventListener("click", () => {
      console.log("Card clicked:", card.value);
      flipCard(cardElement);
    });

    cardElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        flipCard(cardElement);
      }
    });

    gameBoard.appendChild(cardElement);
  });
}

function flipCard(cardElement) {
  if (boardLocked) {
    return;
  }

  if (cardElement.classList.contains("matched")) {
    return;
  }

  if (cardElement === firstCard) {
    return;
  }

  cardElement.classList.add("flipped");

  if (firstCard === null) {
    firstCard = cardElement;

    console.log(
      "First card:",
      firstCard.dataset.verbId,
      firstCard.dataset.role,
    );

    return;
  }

  secondCard = cardElement;
  boardLocked = true;

  attempts++;

  updateStats();

  console.log(
    "Second card:",
    secondCard.dataset.verbId,
    secondCard.dataset.role,
  );

  checkForMatch();
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  boardLocked = false;
}

function checkForMatch() {
  const isMatch = firstCard.dataset.verbId === secondCard.dataset.verbId;

  if (isMatch) {
    handleMatch();
  } else {
    handleMismatch();
  }
}

function handleMatch() {
  console.log("Match!");

  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  matchedPairs++;

  updateStats();

  checkGameComplete();

  resetTurn();
}

function handleMismatch() {
  console.log("No match");

  registerError(firstCard);
  registerError(secondCard);

  console.log("Verb errors:", verbErrors);

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");

    resetTurn();
  }, 1000);
}

function updateStats() {
  const attemptsElement = document.querySelector("#attempts");

  const pairsElement = document.querySelector("#pairs");

  const totalPairsElement = document.querySelector("#total-pairs");

  attemptsElement.textContent = attempts;
  pairsElement.textContent = matchedPairs;
  totalPairsElement.textContent = totalPairs;
}

function checkGameComplete() {
  if (matchedPairs === totalPairs) {
    console.log("Game completed!");

    setTimeout(() => {
      showVictoryMessage();
    }, 300);
  }
}

function getGameSettings() {
  const selectedType = document.querySelector(
    'input[name="verb-type"]:checked',
  );

  const selectedAmount = document.querySelector(
    'input[name="verb-amount"]:checked',
  );

  const selectedMode = document.querySelector(
    'input[name="practice-mode"]:checked',
  );

  return {
    type: selectedType.value,
    amount: Number(selectedAmount.value),
    mode: selectedMode.value,
  };
}

function showVictoryMessage() {
  const victoryMessage = document.querySelector("#victory-message");

  const finalAttempts = document.querySelector("#final-attempts");

  finalAttempts.textContent = attempts;

  renderDifficultVerbs();

  victoryMessage.classList.remove("hidden");
}

function updateGameInfo(settings) {
  const gameInfo = document.querySelector("#current-game-info");

  const typeLabels = {
    regular: "Regular",
    irregular: "Irregular",
    all: "All verbs",
  };

  const modeLabels = {
    spanish: "Infinitive ↔ Spanish",
    past: "Infinitive ↔ Past",
    participle: "Infinitive ↔ Past Participle",
    gerund: "Infinitive ↔ Gerund",
  };

  gameInfo.textContent =
    `${typeLabels[settings.type]} · ` +
    `${modeLabels[settings.mode]} · ` +
    `${settings.amount} verbs`;

  gameInfo.classList.remove("hidden");
}

function registerError(card) {
  const verbId = card.dataset.verbId;

  if (verbErrors[verbId] === undefined) {
    verbErrors[verbId] = 0;
  }

  verbErrors[verbId]++;

  saveVerbErrors();
}

function getDifficultVerbs() {
  return Object.entries(verbErrors)
    .map(([verbId, errors]) => {
      const verb = verbs.find((verb) => verb.id === Number(verbId));

      return {
        verb,
        errors,
      };
    })
    .sort((a, b) => b.errors - a.errors);
}

function renderDifficultVerbs() {
  const reviewSection = document.querySelector("#review-section");

  const reviewList = document.querySelector("#review-list");

  const difficultVerbs = getDifficultVerbs();

  reviewList.innerHTML = "";

  if (difficultVerbs.length === 0) {
    reviewSection.classList.add("hidden");

    return;
  }

  difficultVerbs.slice(0, 5).forEach((item) => {
    const listItem = document.createElement("li");

    listItem.innerHTML = `
                <span>
                    ${item.verb.infinitive.toUpperCase()}
                </span>

                <span>
                    ${item.errors} error${item.errors === 1 ? "" : "s"}
                </span>
            `;

    reviewList.appendChild(listItem);
  });

  reviewSection.classList.remove("hidden");
}

function startDifficultVerbsGame() {
  const difficultVerbs = getDifficultVerbs();

  if (difficultVerbs.length < 2) {
    alert("You need more recorded errors before starting this practice mode.");

    return;
  }

  const settings = getGameSettings();

  const amount = Math.min(settings.amount, difficultVerbs.length);

  const selectedVerbs = difficultVerbs
    .slice(0, amount)
    .map((item) => item.verb);

  // Reset game state
  resetTurn();

  attempts = 0;
  matchedPairs = 0;
  totalPairs = selectedVerbs.length;

  // Hide victory message
  const victoryMessage = document.querySelector("#victory-message");

  victoryMessage.classList.add("hidden");

  // Update current game information
  const gameInfo = document.querySelector("#current-game-info");

  const modeLabels = {
    spanish: "Infinitive ↔ Spanish",
    past: "Infinitive ↔ Past",
    participle: "Infinitive ↔ Past Participle",
    gerund: "Infinitive ↔ Gerund",
  };

  gameInfo.textContent =
    `Difficult verbs · ` +
    `${modeLabels[settings.mode]} · ` +
    `${selectedVerbs.length} verbs`;

  gameInfo.classList.remove("hidden");

  // Update counters
  updateStats();

  // Create cards using the currently selected practice mode
  const cards = createCards(selectedVerbs, settings.mode);

  // Draw cards
  renderCards(cards);

  console.log("Starting difficult verbs practice...");
  console.log("Selected verbs:", selectedVerbs);
}

function loadVerbErrors() {
  const savedErrors = localStorage.getItem("verbErrors");

  if (savedErrors === null) {
    return {};
  }

  return JSON.parse(savedErrors);
}

function saveVerbErrors() {
  localStorage.setItem("verbErrors", JSON.stringify(verbErrors));
}

function resetProgress() {
  verbErrors = {};

  localStorage.removeItem("verbErrors");

  const reviewSection = document.querySelector("#review-section");

  const reviewList = document.querySelector("#review-list");

  reviewList.innerHTML = "";

  reviewSection.classList.add("hidden");

  console.log("Progress reset.");
}
