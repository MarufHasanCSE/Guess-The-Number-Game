function startGame() {
    const randomNumber = Math.floor(Math.random() * 100) + 1
  
    let attempts = 0
    let guessedCorrectly = false
  
    while (!guessedCorrectly) {
      let userGuess = prompt("Guess a number between 1 and 100:")
  
      if (userGuess === null) {
        alert("Game cancelled.")
        return
      }
  
      userGuess = Number.parseInt(userGuess)
  
      if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        alert("Please enter a valid number between 1 and 100.")
        continue
      }
  
      attempts++
  
      if (userGuess === randomNumber) {
        guessedCorrectly = true
        alert("Congratulations! You guessed the correct number: " + randomNumber + "\nTotal attempts: " + attempts)
      } else if (userGuess < randomNumber) {
        alert("Too low! Try a higher number.")
      } else {
        alert("Too high! Try a lower number.")
      }
    }
  }