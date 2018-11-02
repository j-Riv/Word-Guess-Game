// Game Variables
var wordList = [
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
];
var guessesAllowed = 6,
    usedLettersList = [],
    word = "",
    letterCount = 0,
    limeGreen = "#99f927";
// Selectors
var game = document.getElementById("Game"),
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
var hangman = document.getElementById("HangmanCanvas");
var ctx = hangman.getContext('2d');
ctx.beginPath();
ctx.strokeStyle = limeGreen;
ctx.lineWidth = 2;

// Desktop keypress
function keypressed(e) {
    // Get character
    // var key = event.charCode || event.keyCode; // Get the Unicode value
    // key = String.fromCharCode(key); // Convert the value into a character

    // play game
    play(e.key);
}

// Main
function play(key) {
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
            if (!isUsedLetter) {
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
    // console.log("The Word: " + word);
    // Set/Reset Game
    usedLettersDisplay.innerHTML = '';
    usedLettersList.length = 0;
    letterCount = 0;
    // Reset canvas
    ctx.clearRect(0, 0, hangman.width, hangman.height);
    ctx.beginPath();
    // Redraw Frame();
    frame();
    // Get Saved Wins if they exist & set them
    var wins = sessionStorage.getItem('gameWins');
    if (isNaN(wins) || wins === null) {
        wins = 0;
        sessionStorage.setItem("gameWins", 0);
    }
    winsDisplay.textContent = wins;
    // Build underscores
    var wordLength = word.length,
        underscores = '';
    for (var i = 0; i < wordLength; i++) {
        underscores += '<span id="u-' + i + '">_</span>';
    }
    // Insert underscores
    currentWord.innerHTML = underscores;
    guessesDisplay.textContent = guessesAllowed;
    // Unhide display - Get Game Ready
    if (gameDisplay.classList.contains("hidden")) {
        gameDisplay.classList.remove("hidden");
    }
    // Mobile keyboard - build and display
    if (game.classList.contains("is-mobile")) {
        mobileKeyboard.classList.remove("hidden");
    }
    // Hide end game display if shown
    if (game.classList.contains("game-ended")) {
        gameEndDisplay.classList.add("hidden");
        game.classList.remove("game-ended");
    }
    // Add class to body
    game.classList.add("game-started");
}

// For lack of a better name
function do_stuff(word, letter, letterCount) {
    var wordLength = word.length,
        index = [],
        letter = letter.toUpperCase(),
        word = word.toUpperCase();
    // Chec for multiple occurences
    for (var i = 0; i < wordLength; i++) {
        var character = word.charAt(i);
        if (character == letter) {
            index.push(i);
        }
    }
    var indexLength = index.length;
    // If character in word
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
    // If all letters completed end game w/ win
    if (letterCount == wordLength) {
        end_game("Win", word);
    }
    return letterCount;
}

// Updates current word with correct letters
function update_current_word(idx, l) {
    document.getElementById("u-" + idx).textContent = l;
}

// Updates used letters list
function update_used_letters(l) {
    var usedLetter = document.createElement('span');
    usedLetter.innerHTML = l;
    usedLettersDisplay.appendChild(usedLetter);
}

// Updates guesses remaining
function update_guesses_remaining() {
    var remaining = guessesDisplay.textContent;
    remaining = parseInt(remaining) - 1;
    // If 0 guesses remaining update man & end game with loss
    if (remaining == 0) {
        update_man(0);
        setTimeout(function() { end_game("lost", word); }, 1000);
    }
    guessesDisplay.textContent = remaining;
    update_man(remaining);
}

// Ends the game
function end_game(status) {
    game.classList.add("game-ended");
    gameDisplay.classList.add("hidden");
    if (game.classList.contains("is-mobile")) {
        mobileKeyboard.classList.add("hidden");
        reset_keyboard();
    }
    // Sounds from Retro.sx
    // Update display with game outcome and play sound at game end
    var sound = "";
    if (status == "Win") {
        var gamesWon = parseInt(sessionStorage.getItem("gameWins"));
        gamesWon = gamesWon + 1;
        sessionStorage.setItem("gameWins", gamesWon);
        gameEndMsg.textContent = "YOU WIN!";
        sound = "./assets/sounds/win.mp3";
    } else {
        gameEndMsg.textContent = "GAME OVER!";
        sound = "./assets/sounds/player-down.mp3";
    }
    var audio = new Audio(sound);
    audio.play();
    // Display word
    wordDisplay.textContent = word;
    // Update game message for next game
    gameMsg.textContent = "Press any key to get started!";
    gameEndDisplay.classList.remove("hidden");
    game.classList.remove("game-started");
}

// Returns true if key is a letter
function is_letter(key) {
    var objRegExp = /^[a-z]+$/;
    return objRegExp.test(key);
}

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
    bodyPart[n]();
}

// Mobile Keyboard --->
var keyRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

// Builds the mobile keyboard
function build_keyboard() {
    for (var i = 0; i < keyRows.length; i++) {
        var keyboardKeys = document.createElement('ul');
        keyboardKeys.id = 'KeyboardRow-' + i;
        for (var x = 0; x < keyRows[i].length; x++) {
            letterKey = document.createElement('li');
            letterKey.id = 'letter-' + keyRows[i][x];
            letterKey.innerHTML = keyRows[i][x];
            mobileKeyboard.appendChild(keyboardKeys);
            keyboardKeys.appendChild(letterKey);
        }
    }
}

// Resets the mobile keyboard
function reset_keyboard() {
    mobileKeyboard.innerHTML = "";
    build_keyboard();
}

// Gets the element clicked
function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

// Mobile keypress
function mobile_keypressed() {
    var key = '';
    mobileKeyboard.onclick = function(event) {
        var target = getEventTarget(event);
        key = target.innerHTML;
        play(key);
        // Disable key
        var pressedKey = document.getElementById("letter-" + key);
        pressedKey.classList.add('key-disabled');
    }
}

// Mobile start
function mobile_start() {
    banner.onclick = function(event) {
        mobileKeyboard.classList.remove("hidden");
        play("");
    }
}

// Checks if on mobile (screen width)
function mobile_check() {
    var w = window,
        d = document,
        de = d.documentElement,
        b = d.getElementsByTagName('body')[0],
        width = w.innerWidth || e.clientWidth || g.clientWidth,
        height = w.innerHeight || e.clientHeight || g.clientHeight;
    console.log("w.innerWidth || e.clientWidth || g.clientWidth" + width);
    // if mobile run mobile functions
    if (width <= 768) {
        game.classList.add("is-mobile");
        mobile_start();
        build_keyboard();
        mobile_keypressed();
    }
}

// Check if mobile
mobile_check();