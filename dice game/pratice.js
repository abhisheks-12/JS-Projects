'use strict';

// selecting elements
const score0 = document.querySelector('#score--0');
const score1 = document.getElementById('score--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const currentSc0 = document.getElementById('current--0');
const currentSc1 = document.getElementById('current--1');
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');


// setting values to elements
score0.textContent = 0;
score1.textContent = 0;
diceEl.classList.add('hidden');


// cretating functions
function switchPlayer() {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
}

// Intializing variables
let playing,scores,currentScore,activePlayer;

// Creating function
function init(){
   playing = true;
   scores = [0, 0];
   currentScore = 0;
   activePlayer = 0;

    score0.textContent = 0;
    score1.textContent = 0;
    currentSc0.textContent = 0;
    currentSc1.textContent = 0;
    diceEl.classList.add('hidden');

    player0El.classList.remove('player--winner');
    player1El.classList.remove('player--winner');
    player0El.classList.add('player--active');
    player0El.classList.add('player--active');
    player1El.classList.remove('player--active');
}

init();

//Rolling dice
btnRoll.addEventListener('click', function () {
  //Creating Random dice Number
  if (playing) {
    const dice = Math.trunc(Math.random() * 6) + 1;
    diceEl.classList.remove('hidden');

    // Displayingg dice with random num
    diceEl.src = `dice-${dice}.png`;

    // if dice is not one
    if (dice !== 1) {
      currentScore += dice;
      // Dynamically Selecting insted of currentSc0.textContent =  currentScore;
      document.getElementById(`current--${activePlayer}`).textContent =currentScore;
    } else {
      // document.getElementById(`current--${activePlayer}`).textContent = 0;
      // currentScore = 0;
      // activePlayer = activePlayer === 0 ? 1:0;
      // player0El.classList.toggle('player--active');
      // player1El.classList.toggle('player--active');
      switchPlayer();
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    // add score to total score
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    // if score is greater than 100
    if (scores[activePlayer] >= 100) {
      playing = false;
      document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
      document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
    } else {
      switchPlayer();
    }
  }
});

btnNew.addEventListener('click',init);