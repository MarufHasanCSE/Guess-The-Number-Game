// Function to start the game
function startGame() {
    // Step 1: Generate a random number between 1 and 100
    const randomNumber = Math.floor(Math.random() * 100) + 1
  
    // Variable to keep track of number of attempts
    let attempts = 0
    let guessedCorrectly = false
  
    // Game loop
    while (!guessedCorrectly) {
      // Step 2: User input via prompt
      let userGuess = prompt("Guess a number between 1 and 100:")
  
      // Handle cancel button or empty input
      if (userGuess === null) {
        alert("Game cancelled.")
        return
      }
  
      // Convert input to number
      userGuess = Number.parseInt(userGuess)
  
      // Validate input
      if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        alert("Please enter a valid number between 1 and 100.")
        continue
      }
  
      // Step 5: Increment guess counter
      attempts++
  
      // Step 3 & 4: Compare guess and provide feedback via alerts
      if (userGuess === randomNumber) {
        // Step 6: Game over - correct guess
        guessedCorrectly = true
        alert("Congratulations! You guessed the correct number: " + randomNumber + "\nTotal attempts: " + attempts)
      } else if (userGuess < randomNumber) {
        alert("Too low! Try a higher number.")
      } else {
        alert("Too high! Try a lower number.")
      }
    }
  }
  