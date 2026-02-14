let randomNumber;
let attempts;
let minRange;
let maxRange;
let guessHistory;

const welcomeScreen = document.getElementById('welcomeScreen');
const gameScreen = document.getElementById('gameScreen');
const winScreen = document.getElementById('winScreen');
const startBtn = document.getElementById('startBtn');
const guessBtn = document.getElementById('guessBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const guessInput = document.getElementById('guessInput');
const attemptsDisplay = document.getElementById('attempts');
const rangeDisplay = document.getElementById('range');
const feedbackDisplay = document.getElementById('feedback');
const guessHistoryDisplay = document.getElementById('guessHistory');
const winMessage = document.getElementById('winMessage');

function showScreen(screen) {
  welcomeScreen.classList.remove('active');
  gameScreen.classList.remove('active');
  winScreen.classList.remove('active');
  screen.classList.add('active');
}

function startGame() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  minRange = 1;
  maxRange = 100;
  guessHistory = [];

  attemptsDisplay.textContent = '0';
  rangeDisplay.textContent = '1-100';
  feedbackDisplay.textContent = '';
  feedbackDisplay.className = 'feedback';
  guessHistoryDisplay.innerHTML = '';
  guessInput.value = '';

  showScreen(gameScreen);
  guessInput.focus();
}

function makeGuess() {
  const userGuess = parseInt(guessInput.value);

  if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
    showFeedback('Please enter a number between 1 and 100', 'error');
    return;
  }

  if (guessHistory.includes(userGuess)) {
    showFeedback('You already guessed that number!', 'error');
    return;
  }

  attempts++;
  attemptsDisplay.textContent = attempts;
  guessHistory.push(userGuess);

  if (userGuess === randomNumber) {
    winGame();
  } else if (userGuess < randomNumber) {
    minRange = Math.max(minRange, userGuess + 1);
    showFeedback('📈 Too Low! Go Higher', 'low');
    addGuessToHistory(userGuess, 'too-low');
  } else {
    maxRange = Math.min(maxRange, userGuess - 1);
    showFeedback('📉 Too High! Go Lower', 'high');
    addGuessToHistory(userGuess, 'too-high');
  }

  rangeDisplay.textContent = `${minRange}-${maxRange}`;
  guessInput.value = '';
  guessInput.focus();
}

function showFeedback(message, type) {
  feedbackDisplay.textContent = message;
  feedbackDisplay.className = `feedback ${type}`;
}

function addGuessToHistory(guess, type) {
  const guessItem = document.createElement('div');
  guessItem.className = `guess-item ${type}`;
  guessItem.textContent = guess;
  guessHistoryDisplay.appendChild(guessItem);
}

function winGame() {
  let performance;
  if (attempts <= 5) {
    performance = 'Amazing! You\'re a master guesser! 🌟';
  } else if (attempts <= 8) {
    performance = 'Great job! Well played! 🎯';
  } else if (attempts <= 12) {
    performance = 'Good work! Nice effort! 👍';
  } else {
    performance = 'You did it! Practice makes perfect! 💪';
  }

  winMessage.innerHTML = `You found the number <strong>${randomNumber}</strong><br>in <strong>${attempts}</strong> ${attempts === 1 ? 'attempt' : 'attempts'}!<br><br>${performance}`;
  showScreen(winScreen);
}

startBtn.addEventListener('click', startGame);
guessBtn.addEventListener('click', makeGuess);
playAgainBtn.addEventListener('click', startGame);

guessInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    makeGuess();
  }
});