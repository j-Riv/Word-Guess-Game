function game_init() {
    game = {
        wordList: [
            "Windows",
            "MacOs",
            "Linux",
            "Ubuntu",
            "Keyboard",
            "Monitor",
            "Mouse",
            "Bluetooth",
            "Motherboard",
            "USB",
            "Processor",
            "Memory",
            "Ram",
            "GPU",
            "Fans",
            "SSD",
            "HDD",
            "CPU"
        ],
        word: null,
        letterCount: 0,
        usedLettersList: [],
        guessCount: 6,
        wins: 0,
        isMobile: false,
        message: "Press any key to get started!",
        hasStarted: false,
        hasEnded: false
    }
}

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

function play_game(key) {
    // Game object not set
    if (game.word == null) {
        // Set game object
        game.word = game.wordList[Math.floor(Math.random() * game.wordList.length)];
        setup();
        // console.log("Word: " + game.word);
    } else {
        // Play
        // console.log("Key: " + key);
        // Updates all on screen displays
        if (game.hasStarted) {
            // Check if key pressed is a letter
            if (is_letter(key)) {
                // Check if the letter has been used
                // If letter hasn't been used play the game
                var isUsedLetter = game.usedLettersList.includes(key);
                if (!isUsedLetter) {
                    // If letter hasn't been used & player has not run out of guesses, play the game
                    if (game.guessCount > 0) {
                        // Do stuff & update completed letters count
                        var index = [],
                            key = key.toLowerCase();
                        game.word = game.word.toLowerCase();
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
                            // If all letters completed end game w/ win
                            if (game.letterCount == game.word.length) {
                                end_game("Win");
                            }
                        } else {
                            update_used_letters(key);
                            // update_guesses_remaining();
                            game.guessCount = game.guessCount - 1;
                            if (game.guessCount === 0) {
                                end_game("Lost");
                            }
                        }
                    } else {
                        // Game over
                        setTimeout(function() { end_game("Lost"); }, 1000);
                    }
                    // Update used letters list
                    game.usedLettersList.push(key);
                }
                // Update all displays
                update();
            }
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
    // console.log("Word: " + game.word);
    if (gameContainer.classList.contains("is-mobile")) {
        game.isMobile = true;
    }
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
    } else {
        game.wins = wins;
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
    if (game.isMobile) {
        mobileKeyboard.classList.remove("hidden");
    }
    // Hide end game display if shown
    if (game.hasEnded) {
        gameEndDisplay.classList.add("hidden");
        game.hasEnded = false;
    }
    // Add class to body
    game.hasStarted = true;
    gameMsg.textContent = "";
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
    game.hasEnded = true;
    gameDisplay.classList.add("hidden");
    if (game.isMobile) {
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
    gameMsg.textContent = game.message;
    gameEndDisplay.classList.remove("hidden");
    game.hasStarted = false;
    // Reset Game
    reset_game();
}

// Resets Game Object
function reset_game() {
    game.word = null;
    game.letterCount = 0;
    game.usedLettersList.length = 0;
    game.guessCount = 6;
    if (game.isMobile) {
        reset_keyboard();
    }
}

// Helper Methods
function is_letter(key) {
    var objRegExp = /^[a-z]+$/;
    return objRegExp.test(key);
}

// HTML Canvas Methods
var limeGreen = "#99f927",
    hangman = document.getElementById("HangmanCanvas"),
    ctx = hangman.getContext('2d');

ctx.beginPath();
ctx.strokeStyle = limeGreen;
ctx.lineWidth = 2;
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
// Body parts
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

// Desktop Methods
// Detects keyboard keypress
// Locks keyboard after keypress to prevent fast keypress
var locked = false;

function keypressed(e) {
    console.log("Locked: " + locked);
    if (!locked) {
        locked = true;
        play_game(e.key);
    }
    setTimeout(function() { locked = false; }, 200);
}

// Mobile Methods
// Builds the mobile keyboard
function build_keyboard() {
    var keyRows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ];
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
        play_game(key);
        // Disable key
        var pressedKey = document.getElementById("letter-" + key);
        pressedKey.classList.add('key-disabled');
    }
}

// Mobile start
function mobile_start() {
    banner.onclick = function(event) {
        mobileKeyboard.classList.remove("hidden");
        play_game("");
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
    // console.log("w.innerWidth || e.clientWidth || g.clientWidth" + width);
    // if mobile run mobile functions
    if (width <= 768) {
        console.log("Is Mobile");
        gameContainer.classList.add("is-mobile");
        mobile_start();
        build_keyboard();
        mobile_keypressed();
    }
}

// Check if mobile
mobile_check();

game_init();