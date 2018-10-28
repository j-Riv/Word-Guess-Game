// // Sessions
// sessionStorage.setItem('game_wins', '0');
// var data = sessionStorage.getItem('game_wins');
// console.log("data: " + data);
// // See if we have an autosave value
// // (this will only happen if the page is accidentally refreshed)
// if (sessionStorage.getItem("autosave")) {
//     // Restore the contents of the text field
//     field.value = sessionStorage.getItem("autosave");
// }

var word_list = [
    "Keyboard",
    "Monitor",
    "Mouse",
    "Bluetooth",
    "Motherboard",
    "USB"
];
// Variables
var word = '';
var game = document.getElementById("Game"),
    game_display = document.getElementById("DisplayWrapper"),
    letters_completed = 0,
    msg = document.getElementById("Msg"),
    wins = document.getElementById("GameWins"),
    current_word = document.getElementById("CurrentWord"),
    guesses_remaining = document.getElementById("GuessesRemaining"),
    used_letters = document.getElementById("UsedLetters"),
    game_win_banner = document.getElementById("GameWin"),
    game_over_banner = document.getElementById("GameOver");

var guesses = 5;

function main(event) {
    // Get character
    var key = event.charCode || event.keyCode; // Get the Unicode value
    key = String.fromCharCode(key); // Convert the value into a character
    console.log(key);
    // Guesses Left
    var remaining_guesses = guesses_remaining.innerText;
    // Game started
    if (game.classList.contains("game-started")) {
        if (remaining_guesses > 0) {
            update_msg();
            letters_completed = do_stuff(word, key, letters_completed);
        } else {
            // Game over
            game_over();
        }
    } else {
        // Select random word from list
        word = word_list[Math.floor(Math.random() * word_list.length)];
        console.log("Word: " + word);
        game_setup(word);
    }
}

function game_setup(word) {
    // Draw out blank word
    var word_char = word.length;
    var underscores = '';
    console.log("Word Char: " + word_char);
    for (var i = 0; i < word_char; i++) {
        underscores += '<span id="u-' + i + '">_</span>';
    }
    console.log("Underscores: " + underscores);
    // Insert underscores
    current_word.innerHTML = underscores;
    guesses_remaining.innerHTML = guesses;
    // Game is Ready
    game.classList.add("game-started");
}

function update_msg() {
    // Change Notification
    msg.innerHTML = "Game has started.";
}

function do_stuff(word, letter, letters_completed) {
    console.log("Letters Completed: " + letters_completed);
    var index = [],
        letter = letter.toUpperCase(),
        word = word.toUpperCase();
    console.log("word length: " + word.length);
    // index = word.indexOf(letter);
    for (var i = 0; i < word.length; i++) {
        var character = word.charAt(i);
        if (character == letter) {
            index.push(i);
        }
    }
    console.log("index length: " + index.length);
    // if character in word
    if (index.length > 0) {
        if (index.length > 1) {
            console.log(index);
            for (var x = 0; x < index.length; x++) {
                update_current_word(index[x], letter);
                letters_completed = letters_completed + 1;
            }
        } else {
            update_current_word(index[0], letter);
            letters_completed = letters_completed + 1;
        }
    } else {
        update_used_letters(letter);
        update_guesses_remaining();
    }
    console.log("ds Letters completed: " + letters_completed);
    if (letters_completed == word.length) {
        game_win();
    }
    return letters_completed;
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
    console.log("remaining " + remaining);
    remaining = parseInt(remaining) - 1;
    guesses_remaining.innerHTML = remaining;
}

function game_over() {
    var height = game_display.clientHeight;
    game.classList.add("game-ended");
    game_over_banner.style.height = height;
    game_display.style.display = "none";
    game_over_banner.style.display = "block";
}

function game_win() {
    // sessionStorage.setItem("game_wins", "");
    var height = game_display.clientHeight;
    game.classList.add("game-ended");
    game_win_banner.style.height = height;
    game_display.style.display = "none";
    game_win_banner.style.display = "block";
}