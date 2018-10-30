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
    letterCount = 0,
    limeGreen = "#99f927";
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
    gameEndMsg = document.getElementById("EndMsg"),
    mobileKeyboard = document.getElementById('MobileKeyboard'),
    mobileStart = document.getElementById("MobileStart");

// canvas
var hangman = document.getElementById("HangmanCanvas");
var ctx = hangman.getContext('2d');
ctx.beginPath();
ctx.strokeStyle = limeGreen;
ctx.lineWidth = 2;

// add main here -->
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
    // Mobile Keyboard
    if (game.classList.contains("is-mobile")) {
        mobileKeyboard.classList.remove("hidden");
    }
    // console.log("The Word: " + word);
    // Update Image
    frame();
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
        update_man(0);
        setTimeout(function() { end_game("lost", word); }, 1000);
    }
    guessesDisplay.innerHTML = remaining;
    update_man(remaining);
}

function end_game(status) {
    game.classList.add("game-ended");
    gameDisplay.classList.add("hidden");
    if (game.classList.contains("is-mobile")) {
        mobileKeyboard.classList.add("hidden");
        reset_keyboard();
        mobileStart.classList.remove("hidden");
    }
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
    // reset canvas
    ctx.clearRect(0, 0, hangman.width, hangman.height);
    ctx.beginPath();
}

// Hangman Canvas
function draw(fromX, fromY, toX, toY) {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
}
// frame
function frame() {
    ctx.setLineDash([5, 5]);
    // top line
    draw(190, 20, 390, 20);
    // vertical line
    draw(380, 10, 380, 390);
    // bottom lines
    draw(10, 380, 390, 380);
    draw(10, 390, 390, 390);
    ctx.setLineDash([]);
}
// body parts
function head() {
    draw(200, 20, 200, 40);
    // circle
    ctx.beginPath();
    ctx.arc(200, 65, 25, 0, 2 * Math.PI);
    ctx.stroke();
}

function torso() {
    draw(200, 90, 200, 160);
}

function leftArm() {
    draw(200, 90, 150, 140);
}

function rightArm() {
    draw(200, 90, 250, 140);
}

function leftLeg() {
    draw(200, 160, 150, 210);
}

function rightLeg() {
    draw(200, 160, 250, 210);
}

var bodyPart = [rightLeg, leftLeg, rightArm, leftArm, torso, head];

function update_man(n) {
    bodyPart[n]();
}

// Mobile Keyboard
var alphabet = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
    'z', 'x', 'c', 'v', 'b', 'n', 'm'
];
var keyRow1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
var keyRow2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
var keyRow3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

var keyRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

// create alphabet ul
function build_keyboard() {
    for (var i = 0; i < keyRows.length; i++) {
        var keyboardKeys = document.createElement('ul');
        keyboardKeys.id = 'KeyboardRow-' + i;
        for (var x = 0; x < keyRows[i].length; x++) {
            letterKey = document.createElement('li');
            letterKey.id = 'letter-' + keyRows[i][x];
            letterKey.innerHTML = keyRows[i][x];
            // mobile_keypressed();
            mobileKeyboard.appendChild(keyboardKeys);
            keyboardKeys.appendChild(letterKey);
        }
    }
}

function reset_keyboard() {
    mobileKeyboard.innerHTML = "";
    build_keyboard();
}

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

function mobile_keypressed() {
    var key = '';
    mobileKeyboard.onclick = function(event) {
        var target = getEventTarget(event);
        key = target.innerHTML;
        console.log("Keypressed: " + key);
        play(key);
        // Disable key
        var pressedKey = document.getElementById("letter-" + key);
        console.log("pressedKey: " + pressedKey);
        pressedKey.classList.add('key-disabled');
    }
}

function keypressed(event) {
    // Get character
    var key = event.charCode || event.keyCode; // Get the Unicode value
    key = String.fromCharCode(key); // Convert the value into a character
    // play game
    play(key);
}

function mobile_start() {
    mobileStart.onclick = function(event) {
        mobileStart.classList.add("hidden");
        mobileKeyboard.classList.remove("hidden");
        play("");
        console.log("clicked start");
    }
}

function if_mobile() {
    var w = window,
        d = document,
        de = d.documentElement,
        b = d.getElementsByTagName('body')[0],
        width = w.innerWidth || e.clientWidth || g.clientWidth,
        height = w.innerHeight || e.clientHeight || g.clientHeight;
    console.log("w.innerWidth || e.clientWidth || g.clientWidth" + width);

    if (width <= 768) {
        game.classList.add("is-mobile");
        mobile_start();
        build_keyboard();
        mobile_keypressed();
    }
}

if_mobile();