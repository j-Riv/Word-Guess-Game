// Game Variables
var wordList = [
    "Keyboard",
    "Monitor",
    "Mouse",
    "Bluetooth",
    "Motherboard",
    "USB"
];
var guessesAllowed = 6,
    usedLettersList = [],
    word = "",
    letterCount = 0;
// Selectors
var game = document.getElementById("Game"),
    gameDisplay = document.getElementById("GameDisplay"),
    hangmanImg = document.getElementById("TheHangman"),
    gameMsg = document.getElementById("GameMsg"),
    winsDisplay = document.getElementById("WinsDisplay"),
    currentWord = document.getElementById("CurrentWord"),
    guessesDisplay = document.getElementById("GuessesDisplay"),
    usedLettersDisplay = document.getElementById("UsedLettersDisplay"),
    gameEndDisplay = document.getElementById("GameEndedDisplay"),
    wordDisplay = document.getElementById("TheWord"),
    gameEndMsg = document.getElementById("EndMsg");

function main(event) {
    // Get character
    var key = event.charCode || event.keyCode; // Get the Unicode value
    key = String.fromCharCode(key); // Convert the value into a character
    var guessCount = guessesDisplay.innerText; // Guesses left
    // Update message after first key press
    gameMsg.innerHTML = "";
    // Game started
    if (game.classList.contains("game-started")) {
        // Check if key pressed is a letter
        if (is_letter(key)) {
            // Check if the letter has been used
            // If letter hasn't been used play the game
            var isUsedLetter = usedLettersList.includes(key);
            if (isUsedLetter != true) {
                // If letter hasn't been used & player has not run out of guesses, play the game
                if (guessCount > 0) {
                    // Do stuff & update completed letters count
                    letterCount = do_stuff(word, key, letterCount);
                } else {
                    // Game over
                    setTimeout(function() { end_game("lost", word); }, 1000);
                }
                // Update used letters list
                usedLettersList.push(key);
            }
        }
    } else {
        // Show main game display
        gameDisplay.classList.remove("hidden");
        // Select random word from list
        word = wordList[Math.floor(Math.random() * wordList.length)];
        // Setup game
        game_setup(word);
    }
}

function game_setup(word) {
    // Reset
    reset_game();
    // console.log("The Word: " + word);
    // Update Image
    hangmanImg.src = "./assets/images/hangman-start.png";
    // Get Saved Wins if they exist & set them
    var wins = sessionStorage.getItem('gameWins');
    if (isNaN(wins) || wins === null) {
        wins = 0;
        sessionStorage.setItem("gameWins", 0);
    }
    winsDisplay.innerHTML = wins;
    // Draw out blank word
    var wordLength = word.length,
        underscores = '';
    for (var i = 0; i < wordLength; i++) {
        underscores += '<span id="u-' + i + '">_</span>';
    }
    // Insert underscores
    currentWord.innerHTML = underscores;
    guessesDisplay.innerHTML = guessesAllowed;

    if (gameDisplay.classList.contains("hidden")) {
        gameDisplay.classList.remove("hidden");
    }
    // Game is Ready
    if (game.classList.contains("game-ended")) {
        gameEndDisplay.classList.add("hidden");
        game.classList.remove("game-ended");
    }
    game.classList.add("game-started");
}

function do_stuff(word, letter, letterCount) {
    var wordLength = word.length,
        index = [],
        letter = letter.toUpperCase(),
        word = word.toUpperCase();
    for (var i = 0; i < wordLength; i++) {
        var character = word.charAt(i);
        if (character == letter) {
            index.push(i);
        }
    }
    var indexLength = index.length;
    // if character in word
    if (indexLength > 0) {
        // if character in word more than once
        if (indexLength > 1) {
            for (var x = 0; x < indexLength; x++) {
                update_current_word(index[x], letter);
                letterCount = letterCount + 1;
            }
        } else {
            update_current_word(index[0], letter);
            letterCount = letterCount + 1;
        }
        update_used_letters(letter);
    } else {
        update_used_letters(letter);
        update_guesses_remaining();
    }
    // If all letters completed
    if (letterCount == wordLength) {
        end_game("Win", word);
    }
    return letterCount;
}

function update_current_word(idx, l) {
    document.getElementById("u-" + idx).innerHTML = l;
}

function update_used_letters(l) {
    var span = document.createElement('span');
    span.innerHTML = l;
    usedLettersDisplay.appendChild(span);
}

function update_guesses_remaining() {
    var remaining = guessesDisplay.innerText;
    remaining = parseInt(remaining) - 1;
    if (remaining == 0) {
        setTimeout(function() { end_game("lost", word); }, 1000);
    }
    guessesDisplay.innerHTML = remaining;
    update_image(remaining + 1);
}

function end_game(status) {
    game.classList.add("game-ended");
    gameDisplay.classList.add("hidden");
    // Retro.sx
    var sound = "";
    if (status == "Win") {
        var gamesWon = parseInt(sessionStorage.getItem("gameWins"));
        gamesWon = gamesWon + 1;
        sessionStorage.setItem("gameWins", gamesWon);
        gameEndMsg.innerHTML = "YOU WIN!";
        sound = "./assets/sounds/win.mp3";
    } else {
        gameEndMsg.innerHTML = "GAME OVER!";
        sound = "./assets/sounds/player-down.mp3";
    }
    var audio = new Audio(sound);
    audio.play();
    wordDisplay.innerHTML = word;
    gameMsg.innerHTML = "Press any key to get started!";
    gameEndDisplay.classList.remove("hidden");
    game.classList.remove("game-started");
}

function is_letter(key) {
    var objRegExp = /^[a-z]+$/;
    return objRegExp.test(key);
}

function reset_game() {
    usedLettersDisplay.innerHTML = '';
    usedLettersList.length = 0;
    letterCount = 0;
}

function update_image(n) {
    if (n > 0) {
        hangmanImg.src = "./assets/images/hangman-" + n + ".png";
    }
}