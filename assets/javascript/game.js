var word_list = [
    "Keyboard",
    "Monitor",
    "Mouse",
    "Bluetooth",
    "Motherboard",
    "USB"
];
var used_letters_list = [];
// Variables
var word = '';
var game = document.getElementById("Game"),
    game_display = document.getElementById("DisplayWrapper"),
    letter_count = 0,
    msg = document.getElementById("Msg"),
    wins_display = document.getElementById("GameWins"),
    current_word = document.getElementById("CurrentWord"),
    guesses_remaining = document.getElementById("GuessesRemaining"),
    used_letters = document.getElementById("UsedLetters"),
    game_end_banner = document.getElementById("GameEnded"),
    word_banner = document.getElementById("TheWord"),
    end_msg = document.getElementById("EndMsg");

var guesses = 5;

function main(event) {
    // Get character
    var key = event.charCode || event.keyCode; // Get the Unicode value
    key = String.fromCharCode(key); // Convert the value into a character
    var guess_count = guesses_remaining.innerText; // Guesses left
    // Update message after first key press
    update_msg();
    // Game started
    if (game.classList.contains("game-started")) {
        // Check if key pressed is a letter
        if (is_letter(key)) {
            // Check if the letter has been used
            // If letter hasn't been used play the game
            var is_used_letter = used_letters_list.includes(key);
            if (is_used_letter != true) {
                // If letter hasn't been used & player has not run out of guesses, play the game
                if (guess_count > 0) {
                    // Do stuff & update completed letters count
                    letter_count = do_stuff(word, key, letter_count);
                } else {
                    // Game over
                    end_game("lost", word);
                }
                // Update used letters list
                used_letters_list.push(key);
            }
        }
    } else {
        // Select random word from list
        word = word_list[Math.floor(Math.random() * word_list.length)];
        // Setup game
        game_setup(word);
    }
}

function game_setup(word) {
    // Reset
    reset_game();
    console.log("The Word: " + word);
    // Get Saved Wins if they exist & set them
    var wins = sessionStorage.getItem('gameWins');
    if (isNaN(wins) || wins === null) {
        wins = 0;
        sessionStorage.setItem("gameWins", 0);
    }
    wins_display.innerHTML = wins;
    // Draw out blank word
    var word_char = word.length,
        underscores = '';
    for (var i = 0; i < word_char; i++) {
        underscores += '<span id="u-' + i + '">_</span>';
    }
    // Insert underscores
    current_word.innerHTML = underscores;
    guesses_remaining.innerHTML = guesses;

    if (game_display.classList.contains("hidden")) {
        game_display.classList.remove("hidden");
    }
    // Game is Ready
    if (game.classList.contains("game-ended")) {
        game_end_banner.classList.add("hidden");
        game.classList.remove("game-ended");
    }
    game.classList.add("game-started");
}

function update_msg() {
    // Change Notification
    msg.innerHTML = "Game has started";
}

function do_stuff(word, letter, letter_count) {
    var word_length = word.length,
        index = [],
        letter = letter.toUpperCase(),
        word = word.toUpperCase();
    for (var i = 0; i < word_length; i++) {
        var character = word.charAt(i);
        if (character == letter) {
            index.push(i);
        }
    }
    var index_length = index.length;
    // if character in word
    if (index_length > 0) {
        // if character in word more than once
        if (index_length > 1) {
            for (var x = 0; x < index_length; x++) {
                update_current_word(index[x], letter);
                letter_count = letter_count + 1;
            }
        } else {
            update_current_word(index[0], letter);
            letter_count = letter_count + 1;
        }
        update_used_letters(letter);
    } else {
        update_used_letters(letter);
        update_guesses_remaining();
    }
    // If all letters completed
    if (letter_count == word_length) {
        end_game("Win", word);
    }
    return letter_count;
}

function update_current_word(idx, l) {
    document.getElementById("u-" + idx).innerHTML = l;
}

function update_used_letters(l) {
    var span = document.createElement('span');
    span.innerHTML = l;
    used_letters.appendChild(span);
}

function update_guesses_remaining() {
    var remaining = guesses_remaining.innerText;
    remaining = parseInt(remaining) - 1;
    guesses_remaining.innerHTML = remaining;
}

function end_game(status) {
    game.classList.add("game-ended");
    game_display.classList.add("hidden");
    if (status == "Win") {
        var game_wins = parseInt(sessionStorage.getItem("gameWins"));
        console.log("saved end: " + game_wins);
        game_wins = game_wins + 1;
        console.log("saved added: " + game_wins);
        sessionStorage.setItem("gameWins", game_wins);
        end_msg.innerHTML = "YOU WIN!";
    } else {
        end_msg.innerHTML = "GAME OVER!";
    }
    word_banner.innerHTML = word;
    game_end_banner.classList.remove("hidden");
    game.classList.remove("game-started");
}

function is_letter(key) {
    var objRegExp = /^[a-z]+$/;
    return objRegExp.test(key);
}

function reset_game() {
    used_letters.innerHTML = '';
    used_letters_list.length = 0;
    letter_count = 0;
}