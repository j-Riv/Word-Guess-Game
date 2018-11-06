// Selectors
var gameContainer = document.getElementById("GameContainer"),
    banner = document.getElementById("Banner"),
    gameDisplay = document.getElementById("GameDisplay"),
    hangmanImg = document.getElementById("TheHangman"),
    gameMsg = document.getElementById("GameMsg"),
    winsDisplay = document.getElementById("WinsDisplay"),
    currentWord = document.getElementById("CurrentWord"),
    guessesDisplay = document.getElementById("GuessesDisplay"),
    usedLettersDisplay = document.getElementById("UsedLettersDisplay"),
    gameEndDisplay = document.getElementById("GameEndedDisplay"),
    wordDisplay = document.getElementById("TheWord"),
    gameEndMsg = document.getElementById("EndMsg"),
    mobileKeyboard = document.getElementById('MobileKeyboard');

// canvas
var limeGreen = "#99f927";
var hangman = document.getElementById("HangmanCanvas");
var ctx = hangman.getContext('2d');
ctx.beginPath();
ctx.strokeStyle = limeGreen;
ctx.lineWidth = 2;

function game_init() {
    game = {
        wordList: [
            "Keyboard",
            "Monitor",
            "Mouse",
            "Bluetooth",
            "Motherboard",
            "USB",
            "Processor",
            "Memory",
            "Ram",
            "GPU"
        ],
        word: null,
        letterCount: 0,
        usedLettersList: [],
        guessCount: 6,
        wins: 0
    }
}

// Desktop keypress
function keypressed(e) {
    console.log("Keypressed: " + e.key);
    // Get character
    // var key = event.charCode || event.keyCode; // Get the Unicode value
    // key = String.fromCharCode(key); // Convert the value into a character

    // play game
    if (game.word == null) {
        game.word = game.wordList[Math.floor(Math.random() * game.wordList.length)];
        setup();
    }
    console.log("Word: " + game.word);
    play_game(e.key);
}

function play_game(key) {
    // updates all on screen displays
    if (gameContainer.classList.contains("game-started")) {
        // Check if key pressed is a letter
        if (is_letter(key)) {
            // Check if the letter has been used
            // If letter hasn't been used play the game
            var isUsedLetter = game.usedLettersList.includes(key);
            console.log("Is key used letter? " + isUsedLetter);
            if (!isUsedLetter) {
                // If letter hasn't been used & player has not run out of guesses, play the game
                if (game.guessCount > 0) {
                    // Do stuff & update completed letters count
                    var index = [],
                        key = key.toUpperCase();
                    game.word = game.word.toUpperCase();
                    // Chec for multiple occurences
                    for (var i = 0; i < game.word.length; i++) {
                        var character = game.word.charAt(i);
                        if (character == key) {
                            index.push(i);
                        }
                    }
                    // If character in word
                    if (index.length > 0) {
                        // if character in word more than once
                        if (index.length > 1) {
                            for (var x = 0; x < index.length; x++) {
                                update_current_word(index[x], key);
                                game.letterCount = game.letterCount + 1;
                            }
                        } else {
                            update_current_word(index[0], key);
                            game.letterCount = game.letterCount + 1;
                        }
                        update_used_letters(key);
                    } else {
                        update_used_letters(key);
                        // update_guesses_remaining();
                        game.guessCount = game.guessCount - 1;
                    }
                    // If all letters completed end game w/ win
                    if (game.letterCount == game.word.length) {
                        end_game("Win", game.word);
                    }
                } else {
                    // Game over
                    setTimeout(function() { end_game("lost", game.word); }, 1000);
                }
                // Update used letters list
                game.usedLettersList.push(key);
            }
            // Update all displays
            update();
            // display object
            console.log("letterCount: " + game.letterCount);
            console.log("guessCount: " + game.guessCount);
            console.log("Wins: " + game.wins);
            console.log("usedLettersList: " + game.usedLettersList);
        }
    }
}

function update() {
    // fix to update all displays at end of each play
    // Canvas
    update_man(game.guessCount);
    // Games Won
    winsDisplay.textContent = game.wins;
    // Guess Count / Remaining
    guessesDisplay.textContent = game.guessCount;
}

function setup() {
    console.log("initial game setup");
    // fix to update all displays at end of each play
    // Set/Reset Game
    // Reset canvas
    ctx.clearRect(0, 0, hangman.width, hangman.height);
    ctx.beginPath();
    // Redraw Frame();
    frame();
    // Get Saved Wins if they exist & set them
    var wins = sessionStorage.getItem('gameWins');
    if (isNaN(wins) || wins === null) {
        game.wins = 0;
        sessionStorage.setItem("gameWins", 0);
    }
    winsDisplay.textContent = game.wins;
    // Build underscores
    var underscores = '';
    for (var i = 0; i < game.word.length; i++) {
        underscores += '<span id="u-' + i + '">_</span>';
    }
    // Insert underscores
    currentWord.innerHTML = underscores;
    guessesDisplay.textContent = game.guessCount;
    usedLettersDisplay.innerHTML = '';
    // Unhide display - Get Game Ready
    if (gameDisplay.classList.contains("hidden")) {
        gameDisplay.classList.remove("hidden");
    }
    // Mobile keyboard - build and display
    if (gameContainer.classList.contains("is-mobile")) {
        mobileKeyboard.classList.remove("hidden");
    }
    // Hide end game display if shown
    if (gameContainer.classList.contains("game-ended")) {
        gameEndDisplay.classList.add("hidden");
        gameContainer.classList.remove("game-ended");
    }
    // Add class to body
    gameContainer.classList.add("game-started");
}

// Updates current word with correct letters
function update_current_word(index, letter) {
    document.getElementById("u-" + index).textContent = letter;
}

// Updates used letters list
function update_used_letters(letter) {
    var usedLetter = document.createElement('span');
    usedLetter.innerHTML = letter;
    usedLettersDisplay.appendChild(usedLetter);
}

// Ends the game
function end_game(status) {
    gameContainer.classList.add("game-ended");
    gameDisplay.classList.add("hidden");
    if (gameContainer.classList.contains("is-mobile")) {
        mobileKeyboard.classList.add("hidden");
        // reset_keyboard();
    }
    // Sounds from Retro.sx
    // Update display with game outcome and play sound at game end
    var sound = "";
    if (status == "Win") {
        var gamesWon = parseInt(sessionStorage.getItem("gameWins"));
        game.wins = gamesWon + 1;
        sessionStorage.setItem("gameWins", game.wins);
        gameEndMsg.textContent = "YOU WIN!";
        sound = "./assets/sounds/win.mp3";
    } else {
        gameEndMsg.textContent = "GAME OVER!";
        sound = "./assets/sounds/player-down.mp3";
    }
    var audio = new Audio(sound);
    audio.play();
    // Display word
    wordDisplay.textContent = game.word;
    // Update game message for next game
    gameMsg.textContent = "Press any key to get started!";
    gameEndDisplay.classList.remove("hidden");
    gameContainer.classList.remove("game-started");
    // Reset Game
    reset_game();
}

// Resets Game Object
function reset_game() {
    game.word = null;
    game.letterCount = 0;
    game.usedLettersList.length = 0;
    game.guessCount = 6;
}

// Returns true if key is a letter
function is_letter(key) {
    var objRegExp = /^[a-z]+$/;
    return objRegExp.test(key);
}

// Canvas Methods
// Draws the hangman canvas
function draw(fromX, fromY, toX, toY) {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
}
// Frame
function frame() {
    ctx.setLineDash([5, 5]);
    // top line
    draw(140, 20, 290, 20);
    // vertical line
    draw(280, 10, 280, 390);
    // bottom lines
    draw(10, 380, 290, 380);
    draw(10, 390, 290, 390);
    ctx.setLineDash([]);
}
// body parts
function head() {
    draw(150, 20, 150, 40);
    // circle
    ctx.beginPath();
    ctx.arc(150, 65, 25, 0, 2 * Math.PI);
    ctx.stroke();
}

function torso() {
    draw(150, 90, 150, 160);
}

function leftArm() {
    draw(150, 90, 100, 140);
}

function rightArm() {
    draw(150, 90, 200, 140);
}

function leftLeg() {
    draw(150, 160, 100, 210);
}

function rightLeg() {
    draw(150, 160, 200, 210);
}

var bodyPart = [rightLeg, leftLeg, rightArm, leftArm, torso, head];

// Updates the hangman
function update_man(n) {
    if (n !== 6) {
        bodyPart[n]();
    }
}

game_init();