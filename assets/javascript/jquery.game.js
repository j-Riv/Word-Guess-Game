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
var game = $('#Game'),
    gameDisplay = $('#GameDisplay'),
    hangmanImg = $('#TheHangman'),
    gameMsg = $('#GameMsg'),
    winsDisplay = $('#WinsDisplay'),
    currentWord = $('#CurrentWord'),
    guessesDisplay = $('#GuessesDisplay'),
    usedLettersDisplay = $('#UsedLettersDisplay'),
    gameEndDisplay = $('#GameEndedDisplay'),
    wordDisplay = $('#TheWord'),
    gameEndMsg = $('#EndMsg');

function main(event) {
    // Get character
    var key = event.charCode || event.keyCode; // Get the Unicode value
    key = String.fromCharCode(key); // Convert the value into a character
    var guessCount = guessesDisplay.text(); // Guesses left
    // Update message after first key press
    gameMsg.text('');
    // Game started
    if (game.hasClass('game-started')) {
        // Check if key pressed is a letter
        if (is_letter(key)) {
            // Check if the letter has been used
            // If letter hasn't been used play the game
            if ($.inArray(key, usedLettersList) == -1) {
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
        gameDisplay.removeClass('hidden');
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
    hangmanImg.attr('src', './assets/images/hangman-start.png');
    // Get Saved Wins if they exist & set them
    var wins = sessionStorage.getItem('gameWins');
    if (isNaN(wins) || wins === null) {
        wins = 0;
        sessionStorage.setItem("gameWins", 0);
    }
    winsDisplay.text(wins);
    // Draw out blank word
    var wordLength = word.length,
        underscores = '';
    for (var i = 0; i < wordLength; i++) {
        underscores += '<span id="u-' + i + '">_</span>';
    }
    // Insert underscores
    currentWord.append(underscores);
    guessesDisplay.text(guessesAllowed);

    if (gameDisplay.hasClass('hidden')) {
        gameDisplay.removeClass('hidden');
    }
    // Game is Ready
    if (game.hasClass('game-ended')) {
        gameEndDisplay.addClass('hidden');
        game.removeClass('game-ended');
    }
    game.addClass('game-started');
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
    $('#u-' + idx).text(l);
}

function update_used_letters(l) {
    var s = "<span>" + l + "</span>";
    usedLettersDisplay.append(s);
}

function update_guesses_remaining() {
    var remaining = guessesDisplay.text();
    remaining = parseInt(remaining) - 1;
    if (remaining == 0) {
        setTimeout(function() { end_game("lost", word); }, 1000);
    }
    guessesDisplay.text(remaining);
    update_image(remaining + 1);
}

function end_game(status, word) {
    game.addClass('game-ended');
    gameDisplay.addClass('hidden');
    // Retro.sx
    var sound = "";
    if (status == "Win") {
        var gamesWon = parseInt(sessionStorage.getItem("gameWins"));
        gamesWon = gamesWon + 1;
        sessionStorage.setItem("gameWins", gamesWon);
        gameEndMsg.text('YOU WIN!');
        sound = "./assets/sounds/win.mp3";
    } else {
        gameEndMsg.text('Game Over!')
        sound = "./assets/sounds/player-down.mp3";
    }
    var audio = new Audio(sound);
    audio.play();
    wordDisplay.text(word);
    gameMsg.text('Press any key to get started!');
    gameEndDisplay.removeClass('hidden');
    game.removeClass('game-started');
    currentWord.empty();
}

function is_letter(key) {
    var objRegExp = /^[a-z]+$/;
    return objRegExp.test(key);
}

function reset_game() {
    usedLettersDisplay.text('');
    usedLettersList.length = 0;
    letterCount = 0;
}

function update_image(n) {
    if (n > 0) {
        hangmanImg.attr("src", "./assets/images/hangman-" + n + ".png");
    }
}