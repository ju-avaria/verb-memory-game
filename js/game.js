let firstCard = null;
let secondCard = null;
let boardLocked = false;

let attempts = 0;
let matchedPairs = 0;
let totalPairs = 5;

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

function createCards(selectedVerbs) {
  const cards = [];

  selectedVerbs.forEach((verb) => {
    cards.push({
      verbId: verb.id,
      value: verb.infinitive,
      role: "infinitive",
    });

    cards.push({
      verbId: verb.id,
      value: verb.spanish,
      role: "spanish",
    });
  });

  return shuffleArray(cards);
}

function startGame() {
  resetTurn();

  attempts = 0;
  matchedPairs = 0;

  const settings = getGameSettings();

  totalPairs = settings.amount;

  updateStats();

  console.log("Starting Verb Memory...");
  console.log("Settings:", settings);

  const selectedVerbs = selectRandomVerbs(settings.amount, settings.type);

  const cards = createCards(selectedVerbs);

  renderCards(cards);
}

function renderCards(cards) {
  const gameBoard = document.querySelector("#game-board");

  gameBoard.innerHTML = "";

  cards.forEach((card) => {
    const cardElement = document.createElement("div");

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
      alert(`Game completed!\nAttempts: ${attempts}`);
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

  return {
    type: selectedType.value,
    amount: Number(selectedAmount.value),
  };
}
