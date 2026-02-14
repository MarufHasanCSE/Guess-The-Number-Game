let randomNumber;
let attempts;
let minRange;
let maxRange;
let guessHistory;
let hintsUsed;
let maxHints;
let currentDifficulty;
let soundEnabled = true;

const difficulties = {
  easy: { min: 1, max: 50, hints: 5 },
  medium: { min: 1, max: 100, hints: 3 },
  hard: { min: 1, max: 500, hints: 2 },
  extreme: { min: 1, max: 1000, hints: 1 }
};

const welcomeScreen = document.getElementById('welcomeScreen');
const gameScreen = document.getElementById('gameScreen');
const winScreen = document.getElementById('winScreen');
const leaderboardScreen = document.getElementById('leaderboardScreen');
const startBtn = document.getElementById('startBtn');
const guessBtn = document.getElementById('guessBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const changeDifficultyBtn = document.getElementById('changeDifficultyBtn');
const giveUpBtn = document.getElementById('giveUpBtn');
const hintBtn = document.getElementById('hintBtn');
const soundToggle = document.getElementById('soundToggle');
const themeToggle = document.getElementById('themeToggle');
const leaderboardBtn = document.getElementById('leaderboardBtn');
const closeLeaderboardBtn = document.getElementById('closeLeaderboardBtn');
const guessInput = document.getElementById('guessInput');
const attemptsDisplay = document.getElementById('attempts');
const rangeDisplay = document.getElementById('range');
const hintsLeftDisplay = document.getElementById('hintsLeft');
const feedbackDisplay = document.getElementById('feedback');
const hintDisplay = document.getElementById('hintDisplay');
const guessHistoryDisplay = document.getElementById('guessHistory');
const winMessage = document.getElementById('winMessage');
const scoreDisplay = document.getElementById('scoreDisplay');
const welcomeRange = document.getElementById('welcomeRange');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const leaderboardContent = document.getElementById('leaderboardContent');

currentDifficulty = 'medium';

function playSound(type) {
  if (!soundEnabled) return;
  
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch(type) {
    case 'correct':
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      break;
    case 'wrong':
      oscillator.frequency.value = 200;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
    case 'hint':
      oscillator.frequency.value = 600;
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
    case 'click':
      oscillator.frequency.value = 400;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      break;
  }
}

function showScreen(screen) {
  welcomeScreen.classList.remove('active');
  gameScreen.classList.remove('active');
  winScreen.classList.remove('active');
  leaderboardScreen.classList.remove('active');
  screen.classList.add('active');
}

function updateDifficultySelection() {
  difficultyButtons.forEach(btn => {
    if (btn.dataset.difficulty === currentDifficulty) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  const config = difficulties[currentDifficulty];
  welcomeRange.textContent = `${config.min} - ${config.max}`;
}

function startGame() {
  playSound('click');
  
  const config = difficulties[currentDifficulty];
  randomNumber = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
  attempts = 0;
  minRange = config.min;
  maxRange = config.max;
  guessHistory = [];
  hintsUsed = 0;
  maxHints = config.hints;
  
  attemptsDisplay.textContent = '0';
  rangeDisplay.textContent = `${minRange}-${maxRange}`;
  hintsLeftDisplay.textContent = maxHints;
  feedbackDisplay.textContent = '';
  feedbackDisplay.className = 'feedback';
  hintDisplay.textContent = '';
  guessHistoryDisplay.innerHTML = '';
  guessInput.value = '';
  guessInput.min = config.min;
  guessInput.max = config.max;
  hintBtn.disabled = false;
  
  showScreen(gameScreen);
  guessInput.focus();
}

function makeGuess() {
  const config = difficulties[currentDifficulty];
  const userGuess = parseInt(guessInput.value);
  
  if (isNaN(userGuess) || userGuess < config.min || userGuess > config.max) {
    showFeedback(`Please enter a number between ${config.min} and ${config.max}`, 'error');
    playSound('wrong');
    return;
  }
  
  if (guessHistory.includes(userGuess)) {
    showFeedback('You already guessed that number!', 'error');
    playSound('wrong');
    return;
  }
  
  attempts++;
  attemptsDisplay.textContent = attempts;
  guessHistory.push(userGuess);
  
  if (userGuess === randomNumber) {
    playSound('correct');
    winGame();
  } else if (userGuess < randomNumber) {
    minRange = Math.max(minRange, userGuess + 1);
    showFeedback('📈 Too Low! Go Higher', 'low');
    addGuessToHistory(userGuess, 'too-low');
    playSound('wrong');
  } else {
    maxRange = Math.min(maxRange, userGuess - 1);
    showFeedback('📉 Too High! Go Lower', 'high');
    addGuessToHistory(userGuess, 'too-high');
    playSound('wrong');
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

function getHint() {
  if (hintsUsed >= maxHints) {
    showFeedback('No hints remaining!', 'error');
    return;
  }
  
  playSound('hint');
  hintsUsed++;
  hintsLeftDisplay.textContent = maxHints - hintsUsed;
  
  const hintTypes = [
    () => `The number is ${randomNumber % 2 === 0 ? 'EVEN' : 'ODD'}`,
    () => {
      const digit = randomNumber.toString()[0];
      return `First digit is ${digit}`;
    },
    () => {
      const lastDigit = randomNumber % 10;
      return `Last digit is ${lastDigit}`;
    },
    () => {
      const mid = Math.floor((minRange + maxRange) / 2);
      return randomNumber > mid ? `Number is in upper half (${mid + 1}-${maxRange})` : `Number is in lower half (${minRange}-${mid})`;
    },
    () => {
      const sum = randomNumber.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
      return `Sum of digits is ${sum}`;
    }
  ];
  
  const availableHints = hintTypes.filter((_, index) => {
    if (index === 1 && randomNumber < 10) return false;
    if (index === 4 && randomNumber < 10) return false;
    return true;
  });
  
  const randomHint = availableHints[Math.floor(Math.random() * availableHints.length)];
  hintDisplay.textContent = `💡 Hint: ${randomHint()}`;
  
  if (hintsUsed >= maxHints) {
    hintBtn.disabled = true;
  }
}

function calculateScore() {
  const config = difficulties[currentDifficulty];
  const range = config.max - config.min + 1;
  const optimalGuesses = Math.ceil(Math.log2(range));
  
  let baseScore = 1000;
  const attemptPenalty = Math.max(0, (attempts - optimalGuesses) * 50);
  const hintPenalty = hintsUsed * 100;
  
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
    extreme: 3
  };
  
  const finalScore = Math.max(100, Math.floor((baseScore - attemptPenalty - hintPenalty) * difficultyMultiplier[currentDifficulty]));
  return finalScore;
}

function winGame() {
  let performance;
  const config = difficulties[currentDifficulty];
  const optimalGuesses = Math.ceil(Math.log2(config.max - config.min + 1));
  
  if (attempts <= optimalGuesses) {
    performance = 'PERFECT! You\'re a mathematical genius! 🌟';
  } else if (attempts <= optimalGuesses + 3) {
    performance = 'Amazing! You\'re a master guesser! 🎯';
  } else if (attempts <= optimalGuesses + 6) {
    performance = 'Great job! Well played! 👍';
  } else {
    performance = 'You did it! Practice makes perfect! 💪';
  }
  
  const score = calculateScore();
  
  winMessage.innerHTML = `You found the number <strong>${randomNumber}</strong><br>in <strong>${attempts}</strong> ${attempts === 1 ? 'attempt' : 'attempts'}!<br><br>${performance}`;
  
  scoreDisplay.innerHTML = `
    <h3>Your Score</h3>
    <div class="score-value">${score}</div>
  `;
  
  saveToLeaderboard(score);
  showScreen(winScreen);
}

function giveUp() {
  playSound('wrong');
  
  if (confirm(`Give up? The number was ${randomNumber}!`)) {
    showScreen(welcomeScreen);
  }
}

function saveToLeaderboard(score) {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '{}');
  
  if (!leaderboard[currentDifficulty]) {
    leaderboard[currentDifficulty] = [];
  }
  
  leaderboard[currentDifficulty].push({
    score: score,
    attempts: attempts,
    hints: hintsUsed,
    date: new Date().toISOString()
  });
  
  leaderboard[currentDifficulty].sort((a, b) => b.score - a.score);
  leaderboard[currentDifficulty] = leaderboard[currentDifficulty].slice(0, 10);
  
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function showLeaderboard() {
  playSound('click');
  showScreen(leaderboardScreen);
  displayLeaderboard('medium');
}

function displayLeaderboard(difficulty) {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '{}');
  const entries = leaderboard[difficulty] || [];
  
  if (entries.length === 0) {
    leaderboardContent.innerHTML = '<div class="empty-leaderboard">No scores yet.<br>Be the first to play!</div>';
    return;
  }
  
  leaderboardContent.innerHTML = entries.map((entry, index) => {
    const date = new Date(entry.date).toLocaleDateString();
    const rankClass = index === 0 ? 'top-1' : index === 1 ? 'top-2' : index === 2 ? 'top-3' : '';
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
    
    return `
      <div class="leaderboard-entry ${rankClass}">
        <div class="entry-rank">${medal || (index + 1)}</div>
        <div class="entry-info">
          <div class="entry-date">${date}</div>
          <div>Attempts: ${entry.attempts} | Hints: ${entry.hints}</div>
        </div>
        <div class="entry-score">${entry.score}</div>
      </div>
    `;
  }).join('');
}

function toggleTheme() {
  playSound('click');
  document.body.classList.toggle('light-theme');
  themeToggle.textContent = document.body.classList.contains('light-theme') ? '🌞' : '🌓';
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
  playSound('click');
}

difficultyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    playSound('click');
    currentDifficulty = btn.dataset.difficulty;
    updateDifficultySelection();
  });
});

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    playSound('click');
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    displayLeaderboard(btn.dataset.tab);
  });
});

startBtn.addEventListener('click', startGame);
guessBtn.addEventListener('click', makeGuess);
playAgainBtn.addEventListener('click', startGame);
changeDifficultyBtn.addEventListener('click', () => {
  playSound('click');
  showScreen(welcomeScreen);
});
giveUpBtn.addEventListener('click', giveUp);
hintBtn.addEventListener('click', getHint);
soundToggle.addEventListener('click', toggleSound);
themeToggle.addEventListener('click', toggleTheme);
leaderboardBtn.addEventListener('click', showLeaderboard);
closeLeaderboardBtn.addEventListener('click', () => {
  playSound('click');
  showScreen(welcomeScreen);
});

guessInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    makeGuess();
  }
});

updateDifficultySelection();