let player = {
    name: "You",
    chips: 500
}

let dealer = {
    name: "Dealer",
    chips: 500000
}


let cards = []
var cardVal = []
let sum = 0
let dealerCards = []
let dealerSum = 0
let hasBlackJack = false
let isAlive = false
let hasCards = false
let betPlaced = false
let betAmount = 0
let message = ""

let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let playerEl = document.getElementById("player-el")
let dealerEl = document.getElementById("dealer-el")
let dealerCardsEl = document.getElementById("dealer-cards-el")
let dealerSumEl = document.getElementById("dealer-sum-el")
let yourBet = document.getElementById("your-bet")
let nameIn = document.getElementById("name-input")
let betIn = document.getElementById("bet-input")

playerEl.textContent = player.name + ": $" + player.chips

dealerEl.textContent = dealer.name + ": $" + dealer.chips

function getRandomCard() {
    let randomNumber = Math.floor( Math.random()*13 ) + 1
    if (randomNumber > 10) {
        return 10
    } else if (randomNumber === 1 && sum < 11) {
        return 11
    }
    else if (randomNumber === 1 && sum > 10) {
        return 1
    }
     else {
        return randomNumber
    }
}


//Gotta fix so two aces at start don't result in 22 and bust

function dealerGetRandomCard(){
    let randomNumber = Math.floor( Math.random()*13 ) + 1
    // let randomNumber = 1
    if (randomNumber > 10) {
        return 10
    } else if (randomNumber === 1 && dealerSum < 11 && dealerCards[0] < 11) {
        return 11
    }
    else if (randomNumber === 1 && dealerSum > 10 && dealerCards[0] > 10) {
        return 1
    }
     else {
        return randomNumber
    }
}

function startGame() {
    if (hasCards === false && betPlaced === true ) { 
        //Added hasCards and betPlaced booleans to prevent pressing startgame when game is already started and
        //making it unable to start game when a bet hasn't been placed.
    isAlive = true
    hasBlackJack = false
    firstCard = getRandomCard()
    secondCard = getRandomCard()
    cards = [firstCard, secondCard]
    sum = firstCard + secondCard
    dealerFirstCard = dealerGetRandomCard()
    dealerSecondCard = dealerGetRandomCard()
    dealerCards = [dealerFirstCard, dealerSecondCard]
    dealerSum = dealerFirstCard + dealerSecondCard
    hasCards = true
    renderGame()
    }
}

//Make the dealer be able to lose and win as well -> Partially done
//Bets now pay out

function renderGame() {
    cardsEl.textContent = player.name +"'s Cards: "
    for (let i = 0; i < cards.length; i++) {
        cardsEl.textContent += cards[i] + " "
    }

    dealerCardsEl.textContent="Dealers' cards: "
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCardsEl.textContent += dealerCards[i] + " "
    }

    sumEl.textContent = "Sum: " + sum
    if (sum <= 20) {
        message = "Do you want to draw a new card?"
        } else if (sum === 21) {
            message = "You've got Blackjack!"
            hasBlackJack = true
            hasCards = false
            betPlaced = false
            player.chips = betAmount * 2.5 + player.chips
            dealer.chips = dealer.chips - (betAmount * 2.5)
            playerEl.textContent = player.name + ": $" + player.chips
            dealerEl.textContent = dealer.name + ": $" + dealer.chips
            } else {
                message = "You busted!"
                isAlive = false
                hasCards = false
                betPlaced = false
                dealer.chips = dealer.chips + betAmount
                playerEl.textContent = player.name + ": $" + player.chips
                dealerEl.textContent = dealer.name + ": $" + dealer.chips
            }

    if (dealerSum === 21 && sum < 21) {
        message = "The dealer has blackjack!"
        hasBlackJack = true
        hasCards = false
        betPlaced = false
        player.chips = player.chips - betAmount
        dealer.chips = betAmount + dealer.chips
        playerEl.textContent = player.name + ": $" + player.chips
        dealerEl.textContent = dealer.name + ": $" + dealer.chips
            } else if (dealerSum > 21) {
            message = "The dealer busted!"
            hasCards = false
            betPlaced = false
            player.chips = player.chips + betAmount * 2
            playerEl.textContent = player.name + ": $" + player.chips
            dealerEl.textContent = dealer.name + ": $" + dealer.chips
                }else if (dealerSum === sum && dealerSum > 16) {
                    message = "It's a tie! Bets refunded"
                    hasCards = false
                    betPlaced = false
                    player.chips = player.chips + betAmount
                    playerEl.textContent = player.name + ": $" + player.chips
                    dealerEl.textContent = dealer.name + ": $" + dealer.chips
                }

    dealerSumEl.textContent = "Dealer sum: " + dealerSum
    
    messageEl.textContent = message
}


function newCard() {
    if (isAlive === true && hasBlackJack === false) {
        let card = getRandomCard()
        sum += card
        cards.push(card)
        renderGame()
    }
}


//Make a function that gives you the ability to stand/hold and to make dealer hold on 17
//Currently pressing stand before new game renders out a single card to dealers hand. Not good (doesnt do this anymore?)

//EDIT: Fixed now I think.
//Can't make dealer hit on 17 or higher even when my sum of cards is higher. Gotta either fix it here or in the win conditions aka rendergame()

function stand(){
     if (dealerSum > 16 && dealerSum > 0 && isAlive === true && hasBlackJack === false && hasCards === true ) {
        renderGame()
    }
    else if (dealerSum < 17 && dealerSum > 0 && isAlive === true && hasBlackJack === false && hasCards === true ) {
        let dealerCard = dealerGetRandomCard()
        dealerSum += dealerCard
        dealerCards.push(dealerCard)
        renderGame()
    }
    else if (dealerSum > 17 && sum > dealerSum && dealerSum > 0 && isAlive === true && hasBlackJack === false && hasCards === true ) {
        let dealerCard = dealerGetRandomCard()
        dealerSum += dealerCard
        dealerCards.push(dealerCard)
        renderGame()
    }
}

function setName() {
    // maxLength = 25;
    //     while (player.name == -1 (player.name != null && player.name.length > maxLength)) {
    //         player['name'] = prompt("Please enter your name. It should be no longer than " + maxLength + " characters in length"
    //         );
    //     }
    player['name'] = prompt("Please enter your name"); //Make a max limit on name. Above code does not do the trick
    if (player.name != null) {
      document.getElementById("player-el").innerHTML =
      playerEl.textContent = player.name + ": $" + player.chips;
    }
  }
  
//Bet now subtracts from player.chips. Now I gotta make you unable to bet if you're out of money.
//Also have to make it so if you cancel the prompt or enter text instead of numbers, you are unable to bet.
//You can now change your bet and it returns whatever you bet earlier if the bet is smaller.

// function placeBet(){
//     if (betPlaced === false) {
//         betAmount = Number(prompt("Please enter your bet"));
//         player.chips = player.chips - betAmount
//         document.getElementById("your-bet").innerHTML =
//         yourBet.textContent = "Bet: $" + betAmount
//         playerEl.textContent = player.name + ": $" + player.chips
//         betPlaced = true;
//     } 
//     else if (betAmount == "null" || betAmount == null || betAmount == "" || betAmount == NaN) {
//         return;
//     }
//     else if (betPlaced === true && betAmount > 0) 
//         player.chips = betAmount + player.chips
//         betAmount = Number(prompt("Please enter a new bet"));
//         player.chips = player.chips - betAmount
//         document.getElementById("your-bet").innerHTML =
//         yourBet.textContent = "Bet: $" + betAmount
//         playerEl.textContent = player.name + ": $" + player.chips
//         betPlaced = true;
// }

function placeBet(){
    if (betPlaced === false) {
        betAmount = betIn.value;
        player.chips = player.chips - betAmount
        document.getElementById("your-bet").innerHTML =
        yourBet.textContent = "Bet: $" + betAmount
        playerEl.textContent = player.name + ": $" + player.chips
        betPlaced = true;
    } 
    else if (betAmount == "null" || betAmount == null || betAmount == "" || betAmount == NaN) {
        return;
    }
    // else if (betPlaced === true && betAmount > 0) 
    //     player.chips = betAmount + player.chips
    //     betAmount = Number(prompt("Please enter a new bet"));
    //     player.chips = player.chips - betAmount
    //     document.getElementById("your-bet").innerHTML =
    //     yourBet.textContent = "Bet: $" + betAmount
    //     playerEl.textContent = player.name + ": $" + player.chips
    //     betPlaced = true;
}

//API STUFF
//Need to make a function that shuffles deck when about 50% of the cards have been used.

function callApi () {
    fetch("https://deckofcardsapi.com/api/deck/2w8q9pp938w7/shuffle/?deck_count=6")
    .then (response => response.json())
    .then (data => console.log(data))
    .then (data => {
        return data //This does fuck all
    })
}




//Can now read value of cards drawn . Now to redo the math in functions with the API
//Gotta make it convert strings on non numeric cards to numbers so it can be used in the math functions.

function drawCard () {
    fetch("https://deckofcardsapi.com/api/deck/2w8q9pp938w7/draw/?count=1")
    .then (response => response.json())
    .then (data => {
        console.log(data.cards)
     
    for (i in data.cards) {console.log(data.cards[i].value)
        if (data.cards[i].value === "JACK"||"KING"||"QUEEN") {
            console.log("match")
            data.cards[i].value = 10;
        }
            cardVal.push(data.cards[i].value);
            console.log(cardVal);
            let imageUrl = data.cards[i].image;
            document.getElementById("card-img")
            .innerHTML += '<img src="' + imageUrl + '">';
    }
    })}

//MAybe push so that every new entry to array gets it's own index position. Done and works
//Turn king, queen and jack into 10's. Ace into 11 or 1

