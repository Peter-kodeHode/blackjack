let player = {
  name: "You",
  chips: 500,
};

let dealer = {
  name: "Dealer",
  chips: 50000000,
};

let cards = [];
var cardVal = [];
let sum = 0;
let dealerCards = [];
let dealerSum = 0;
let hasBlackJack = false;
let isAlive = false;
let hasCards = false;
let betPlaced = false;
let betAmount = 0;
let message = "";
let messageEl = document.getElementById("message-el");
let sumEl = document.getElementById("sum-el");
let cardsEl = document.getElementById("cards-el");
let playerEl = document.getElementById("player-el");
let dealerEl = document.getElementById("dealer-el");
let dealerCardsEl = document.getElementById("dealer-cards-el");
let dealerSumEl = document.getElementById("dealer-sum-el");
let yourBet = document.getElementById("your-bet");
let nameIn = document.getElementById("name-input");
let betIn = document.getElementById("bet-input");

playerEl.textContent = player.name + ": $" + player.chips;

dealerEl.textContent = dealer.name + ": $" + dealer.chips;

async function getRandomCard() {
  let cardValue = await drawCard();
  return cardValue;
}

//Aces should only give the value of 1 if the value of 11 causes the player or dealer to bust.

async function startGame() {
  if (!hasCards && betPlaced) {
    isAlive = true;
    hasBlackJack = false;

    let firstCard = await getRandomCard();
    let secondCard = await getRandomCard();
    cards = [firstCard, secondCard];
    sum = firstCard + secondCard;

    let dealerFirstCard = await getRandomCard();
    let dealerSecondCard = await getRandomCard();
    dealerCards = [dealerFirstCard, dealerSecondCard];
    dealerSum = dealerFirstCard + dealerSecondCard;

    hasCards = true;
    renderGame();
  }
}

//Make the dealer be able to lose and win as well -> Partially done
//Bets now pay out

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
  if (sum <= 20) {
    message = "Do you want to draw a new card?";
  } else if (sum === 21) {
    message = "You've got Blackjack!";
    hasBlackJack = true;
    hasCards = false;
    betPlaced = false;
    player.chips = betAmount * 2.5 + player.chips;
    dealer.chips = dealer.chips - betAmount * 2.5;
    playerEl.textContent = player.name + ": $" + player.chips;
    dealerEl.textContent = dealer.name + ": $" + dealer.chips;
  } else {
    message = "You busted!";
    isAlive = false;
    hasCards = false;
    betPlaced = false;
    dealer.chips = dealer.chips + betAmount;
    playerEl.textContent = player.name + ": $" + player.chips;
    dealerEl.textContent = dealer.name + ": $" + dealer.chips;
  }
  //Simplify
  if (dealerSum === 21 && sum < 21) {
    message = "The dealer has blackjack!";
    hasBlackJack = true;
    hasCards = false;
    betPlaced = false;
    player.chips = player.chips - betAmount;
    dealer.chips = betAmount + dealer.chips;
    playerEl.textContent = player.name + ": $" + player.chips;
    dealerEl.textContent = dealer.name + ": $" + dealer.chips;
  } else if (dealerSum > 21) {
    message = "The dealer busted!";
    hasCards = false;
    betPlaced = false;
    player.chips = player.chips + betAmount * 2;
    playerEl.textContent = player.name + ": $" + player.chips;
    dealerEl.textContent = dealer.name + ": $" + dealer.chips;
  } else if (dealerSum === sum && dealerSum > 16) {
    message = "It's a tie! Bets refunded";
    hasCards = false;
    betPlaced = false;
    player.chips = player.chips + betAmount;
    playerEl.textContent = player.name + ": $" + player.chips;
    dealerEl.textContent = dealer.name + ": $" + dealer.chips;
  }

  dealerSumEl.textContent = "Dealer sum: " + dealerSum;

  messageEl.textContent = message;
}

async function newCard() {
  if (isAlive === true && hasBlackJack === false) {
    let card = await getRandomCard();
    sum += card;
    cards.push(card);
    renderGame();
  }
}

//Make a function that gives you the ability to stand/hold and to make dealer hold on 17
//Currently pressing stand before new game renders out a single card to dealers hand. Not good (doesnt do this anymore?)

//EDIT: Fixed now I think.
//Can't make dealer hit on 17 or higher even when my sum of cards is higher. Gotta either fix it here or in the win conditions aka rendergame()

async function stand() {
  if (
    dealerSum > 16 &&
    dealerSum > 0 &&
    isAlive === true &&
    hasBlackJack === false &&
    hasCards === true
  ) {
    renderGame();
  } else if (
    dealerSum < 17 &&
    dealerSum > 0 &&
    isAlive === true &&
    hasBlackJack === false &&
    hasCards === true
  ) {
    let dealerCard = await getRandomCard();
    dealerSum += dealerCard;
    dealerCards.push(dealerCard);
    renderGame();
  } else if (
    dealerSum > 17 &&
    sum > dealerSum &&
    dealerSum > 0 &&
    isAlive === true &&
    hasBlackJack === false &&
    hasCards === true
  ) {
    let dealerCard = await getRandomCard();
    dealerSum += dealerCard;
    dealerCards.push(dealerCard);
    renderGame();
  }
}

function setName() {
  // maxLength = 25;
  //     while (player.name == -1 (player.name != null && player.name.length > maxLength)) {
  //         player['name'] = prompt("Please enter your name. It should be no longer than " + maxLength + " characters in length"
  //         );
  //     }
  player["name"] = prompt("Please enter your name"); //Make a max limit on name. Above code does not do the trick
  if (player.name != null) {
    document.getElementById("player-el").innerHTML = playerEl.textContent =
      player.name + ": $" + player.chips;
  }
}

function placeBet() {
  let betInput = document.querySelector("input").value;
  let betAmount = parseInt(betInput);

  if (isNaN(betAmount) || betAmount <= 0 || betAmount > player.chips) {
    alert("Invalid bet! Enter a number between 1 and " + player.chips);
    return;
  }

  player.chips -= betAmount;
  betPlaced = true;

  yourBet.textContent = "Bet: $" + betAmount;
  playerEl.textContent = player.name + ": $" + player.chips;
}

async function callApi() {
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
    .then((response) => response.json())
    .then((data) => {
      deckId = data.deck_id;
      console.log("Deck ID:", deckId);
    })
    .catch((error) => console.error("Error fetching deck:", error));
}

callApi();

async function drawCard() {
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
    cardValue = sum < 11 ? 11 : 1;
  } else {
    cardValue = parseInt(cardValue);
  }

  console.log("Processed card value:", cardValue);

  document.getElementById("card-img").innerHTML += `<img src="${card.image}">`;

  if (data.remaining < 156) {
    callApi();
  }

  return cardValue;
}

