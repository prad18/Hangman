const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");
const victoryImages = ["images/victory1.png", "images/victory2.jpg", "images/victory3.jpg","images/victory4.jpg","images/victory5.jpg","images/victory6.jpg"];
const loseImages = ["images/lost3.jpg","images/lost4.jpg"];

// Initializing game variables
let currentWord, correctLetters, wrongGuessCount, wordIndex;
const maxGuesses = 6;

const resetGame = () => {
    // Resetting game variables and UI elements
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "./images/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}

const getRandomWord = () => {
    // Selecting a word and hint from the wordList in order
    const { word, hint } = wordList[wordIndex];

    // Increment the index for the next round
    wordIndex = (wordIndex + 1) % wordList.length;

    currentWord = word; // Keep spaces in the word
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

/*const gameOver = (isVictory) => {
    // After the game is complete, show the modal with relevant details
    const modalText = isVictory ? `You found the word:` : 'The correct word was:';
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.png`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;

    // Change the text of the play again button based on the result
    playAgainBtn.innerText = isVictory ? 'Next Word' : 'Try Again';

    // If all words are used, change the button text to something else
    if (wordIndex === 0) {
        playAgainBtn.innerText = 'Reload page to play again';
        playAgainBtn.disabled = true; // Optionally, disable the button
    }

    gameModal.classList.add("show");
}*/

const gameOver = (isVictory) => {
    const modalText = isVictory ? `You found the word:` : 'The correct word was:';
    const randomImage = isVictory 
        ? victoryImages[Math.floor(Math.random() * victoryImages.length)]
        : loseImages[Math.floor(Math.random() * loseImages.length)];
    gameModal.querySelector("img").src = randomImage;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    playAgainBtn.innerText = isVictory ? 'Next Word' : 'Try Again';

    if (wordIndex === 0) {
        playAgainBtn.innerText = 'Reload page to play again';
        playAgainBtn.disabled = true;
    }

    gameModal.classList.add("show");
}


const initGame = (button, clickedLetter) => {
    // Checking if clickedLetter exists in the currentWord (case-insensitive)
    if (currentWord.toLowerCase().includes(clickedLetter.toLowerCase())) {
        // Showing all correct letters on the word display
        [...currentWord].forEach((letter, index) => {
            if (letter.toLowerCase() === clickedLetter.toLowerCase() || letter === ' ') {
                correctLetters.push(letter);
                const wordDisplayLetter = wordDisplay.querySelectorAll("li")[index];
                wordDisplayLetter.innerText = letter;
                wordDisplayLetter.classList.add("guessed");
            }
        });
    } else {
        // If clicked letter doesn't exist, update the wrongGuessCount and hangman image
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }

    button.disabled = true; // Disabling the clicked button so the user can't click again
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Calling gameOver function if any of these conditions are met
    if (wrongGuessCount === maxGuesses) return gameOver(false);

    // Check if all letters in the word have been guessed, including spaces
    const isWordGuessed = currentWord.split("").every(letter => correctLetters.includes(letter.toLowerCase()) || letter === ' ');
    if (isWordGuessed) {
        return gameOver(true);
    }
};

// Creating keyboard buttons and adding event listeners
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}

// Initialize wordIndex
wordIndex = 0;

// Start the first game
getRandomWord();

playAgainBtn.addEventListener("click", getRandomWord);