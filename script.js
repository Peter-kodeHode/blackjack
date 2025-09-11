let player = {
  name: "You",
  chips: 500,
};

let dealer = {
  name: "Dealer",
  chips: 50000000,
};

let cards = [];
let cardVal = [];
let sum = 0;
let dealerCards = [];
let dealerSum = 0;
let hasBlackJack = false;
let isAlive = false;
let hasCards = false;
let betPlaced = false;
let betAmount = 0;
let message = "";
let isStanding = false;
let deckId = "";

async function callApi() {
  try {
    const response = await fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6"
    );
    if (!response.ok) throw new Error("Failed to fetch deck");
    const data = await response.json();
    deckId = data.deck_id;
    console.log("Deck ID:", deckId);
  } catch (error) {
    console.error("Error fetching deck:", error);
    messageEl.textContent = "Error initializing deck. Please try again.";
  }
}

const messageEl = document.getElementById("message-el");
const sumEl = document.getElementById("sum-el");
const cardsEl = document.getElementById("cards-el");
const playerEl = document.getElementById("player-el");
const dealerEl = document.getElementById("dealer-el");
const dealerCardsEl = document.getElementById("dealer-cards-el");
const dealerSumEl = document.getElementById("dealer-sum-el");
const yourBet = document.getElementById("your-bet");
const nameIn = document.getElementById("name-input");
const betIn = document.getElementById("bet-input");

playerEl.textContent = player.name + ": $" + player.chips;

dealerEl.textContent = dealer.name + ": $" + dealer.chips;

async function getRandomCard() {
  let cardValue = await drawCard();
  return cardValue;
}

async function startGame() {
  if (!deckId) {
    await callApi();
  }

  if (!hasCards && betPlaced) {
    isAlive = true;
    hasBlackJack = false;
    isStanding = false;

    let firstCard = await drawCard(false);
    let secondCard = await drawCard(false);
    cards = [firstCard, secondCard];
    sum = firstCard + secondCard;

    let dealerFirstCard = await drawCard(true);
    let dealerSecondCard = await drawCard(true);
    dealerCards = [dealerFirstCard, dealerSecondCard];
    dealerSum = dealerFirstCard + dealerSecondCard;

    hasCards = true;
    renderGame();
  }
}

function isNaturalBlackjack(sum, cards) {
  return sum === 21 && cards.length === 2;
}

function renderGame() {
  cardsEl.textContent = player.name + "'s Cards: ";
  for (let i = 0; i < cards.length; i++) {
    cardsEl.textContent += cards[i] + " ";
  }

  dealerCardsEl.textContent = "Dealers' cards: ";
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardsEl.textContent += dealerCards[i] + " ";
  }

  sumEl.textContent = "Sum: " + sum;
  dealerSumEl.textContent = "Dealer sum: " + dealerSum;

  if (!isStanding) {
    if (sum > 21) {
      message = "You busted!";
      handleLoss();
    } else if (
      isNaturalBlackjack(sum, cards) &&
      isNaturalBlackjack(dealerSum, dealerCards)
    ) {
      message = "Both have natural Blackjack! Push!";
      handlePush();
    } else if (isNaturalBlackjack(sum, cards)) {
      message = "Natural Blackjack! You win!";
      handleWin(2.5);
    } else {
      message = "Do you want to draw a new card?";
    }
  }

  messageEl.textContent = message;
}

async function stand() {
  if (!isAlive || hasBlackJack || !hasCards || dealerSum === 0) {
    return;
  }

  isStanding = true;

  while (dealerSum < 17) {
    let dealerCard = await drawCard(true);
    dealerSum += dealerCard;
    dealerCards.push(dealerCard);

    if (dealerSum > 21) {
      let aceCount = dealerCards.filter((card) => card === 11).length;
      let tempSum = dealerSum;
      while (aceCount > 0 && tempSum > 21) {
        tempSum -= 10;
        aceCount--;
      }
      dealerSum = tempSum;
    }

    renderGame();
  }

  if (dealerSum > 21) {
    message = "Dealer busted! You win!";
    handleWin(2);
  } else if (sum > 21) {
    message = "You busted!";
    handleLoss();
  } else if (isNaturalBlackjack(sum, cards)) {
    if (isNaturalBlackjack(dealerSum, dealerCards)) {
      message = "Both have natural Blackjack! Push!";
      handlePush();
    } else {
      message = "Your natural Blackjack beats dealer!";
      handleWin(2.5);
    }
  } else if (isNaturalBlackjack(dealerSum, dealerCards)) {
    message = "Dealer has natural Blackjack!";
    handleLoss();
  } else if (sum === 21 && dealerSum === 21) {
    message = "Both have 21! Push!";
    handlePush();
  } else if (sum > dealerSum) {
    message = "You win!";
    handleWin(2);
  } else if (sum < dealerSum) {
    message = "Dealer wins!";
    handleLoss();
  } else {
    message = "Push! It's a tie.";
    handlePush();
  }

  messageEl.textContent = message;

  isStanding = false;
}

async function newCard() {
  if (isAlive && !hasBlackJack && hasCards && !isStanding) {
    let card = await drawCard(false);
    sum += card;
    cards.push(card);
    renderGame();
  }
}

function setName() {
  player["name"] = prompt("Please enter your name");
  if (player.name != null) {
    document.getElementById("player-el").innerHTML = playerEl.textContent =
      player.name + ": $" + player.chips;
  }
}

function placeBet() {
  let betInput = document.querySelector("input").value;
  betAmount = parseInt(betInput);

  if (isNaN(betAmount) || betAmount <= 0 || betAmount > player.chips) {
    alert("Invalid bet! Enter a number between 1 and " + player.chips);
    return;
  }

  player.chips -= betAmount;
  betPlaced = true;

  yourBet.textContent = "Bet: $" + betAmount;
  updateScores();
}

function handleWin(multiplier) {
  let winAmount = betAmount * multiplier;
  player.chips += winAmount;
  dealer.chips -= winAmount;
  console.log(`Player won ${winAmount}. Bet was ${betAmount}`);
  resetGameState();
}

function handleLoss() {
  dealer.chips += betAmount;
  console.log(`Player lost ${betAmount}`);
  resetGameState();
}

function handlePush() {
  player.chips += betAmount;
  console.log(`Push - returning bet of ${betAmount}`);
  resetGameState();
}

function resetGameState() {
  hasCards = false;
  betPlaced = false;
  betAmount = 0;
  yourBet.textContent = "Bet: $0";
  updateScores();
  

}

function updateScores() {
  playerEl.textContent = `${player.name}: $${player.chips}`;
  dealerEl.textContent = `${dealer.name}: $${dealer.chips}`;
}

function getAceValueForDealer(currentSum) {
  return currentSum + 11 <= 21 ? 11 : 1;
}

async function drawCard(isDealer = false) {
  let response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
  );
  let data = await response.json();

  let card = data.cards[0];
  let cardValue = card.value;

  console.log("Raw card value:", card.value);

  if (["JACK", "QUEEN", "KING"].includes(cardValue)) {
    cardValue = 10;
  } else if (cardValue === "ACE") {
    cardValue = isDealer ? getAceValueForDealer(dealerSum) : sum < 11 ? 11 : 1;
  } else {
    cardValue = parseInt(cardValue);
  }

  console.log("Processed card value:", cardValue);

  const container = isDealer
    ? document.getElementById("dealer-card-img")
    : document.getElementById("player-card-img");

  container.innerHTML += `<img src="${card.image}" alt="Card">`;

  if (data.remaining < 156) {
    callApi();
  }

  return cardValue;
}
