var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
    backdrop: 'static',
    keyboard: false,
    show: false
})
var modalTitle = document.querySelector('.modal-title');
var modalQuestion = document.querySelector('.modal-question');
var modalAnswer = document.querySelector('.modal-answer');
var answerInput = document.getElementById('myInput');
var modalTimer = document.querySelector('#question-timer span');
var filter = document.getElementById('filter');
var start_btn = document.querySelector(".start_round");
var end_btn = document.querySelector('.end_round');
var qbuttons = document.querySelectorAll('.qbutton');


localStorage.setItem('score', '0');

//--------------------Event Listeners--------------------//

// Start New Game
start_btn.addEventListener('click', playGame);
// Check Modal Answer
document.getElementById('answerForm').addEventListener('submit', checkAnswer);


async function playGame() {

    // Switch Game Buttons
    toggleStartEndBtn()

    document.querySelector('.end_round').addEventListener('click', function() {
        if(confirm('Are you sure you want to end current game? All progress will be lost!')) {
            document.location.reload();
        }
    })

    // Storing response and converting to JSON
    const response = await fetch('/start_game');
    var gameData = await response.json();
    // Store Game in Local Storage
    storeGameInLocalStorage(gameData);

    // Generate game board
    let game_board = document.querySelector('#game-board');
    let categories = document.querySelectorAll(".category span");
    let gameButtons = document.querySelectorAll('.qbutton');
    generateGameBoard(categories, gameButtons);

    // Question Sequence Initiates
    game_board.addEventListener('click', function(e) {
        // Retrieve answers list from template
        const answersList = JSON.parse(localStorage.getItem('filter_answers'));
//        autocomplete(document.getElementById("myInput"), answersList);
        if(e.target.className === 'qbutton') {
            var currentSquare = e.target;
            autocomplete(document.getElementById("myInput"), answersList);
            localStorage.setItem('prize', e.target.textContent.replace('$', ''));


            //Reset Modal
            answerInput.value = '';
            const message = document.querySelector('#modalMessage');
            message.style.display = 'none';
            modalTimer.textContent = '30';
            document.getElementById('question-timer').style.color = 'yellow';
            answerInput.disabled = false;
            document.querySelector('.close').disabled = true;


            // Display Modal Question
            displayQuestion(currentSquare, categories);
            myModal.show();
            // Start 30 second countdown
            let countSeconds = 30;
            let timer = setInterval(() => {
                countSeconds--;
                if(countSeconds < 10) {
                    modalTimer.textContent = `0${countSeconds}`;
                } else {
                    modalTimer.textContent = String(countSeconds);
                }
                if(countSeconds <= 0) {
                    document.getElementById('question-timer').style.color = 'red';
                    setMessage(message, `Out of Time! The correct answer is ${modalAnswer.textContent}`, 'red');
                    updateScore(subtract);
                    answerInput.disabled = true;
                    currentSquare.disabled = true;
                    currentSquare.style.opacity = 0;
                    clearInterval(timer);
                    document.querySelector('.close').disabled = false;
                }
            }, 1000);

            // Form Submission
            let modalForm = document.querySelector('#answerForm');
            let newCheckAnswer = function() { checkAnswer(e, currentSquare); };

            modalForm.addEventListener('submit', function(){
                if(answerInput.value !== '' ) {
                    document.querySelector('.close').disabled = false;
                    currentSquare.style.opacity = 0;
                    currentSquare.disabled = true;
                    clearInterval(timer);
                }
            });
        }
    })
}

//--------------------GAME FUNCTIONS--------------------//

// Button Toggle
function toggleStartEndBtn() {
    if(!start_btn.disabled) {
        // Disable start_round button and Enable End Game Button
        start_btn.disabled = true;
        start_btn.style.display = 'none';
        
        end_btn.disabled = false;
        end_btn.style.display = 'block';
    } else {
        // Opposite
        end_btn.disabled = true;
        end_btn.style.display = 'none';

        start_btn.disabled = false;
        start_btn.style.display = 'block';
    }
}

// Store the Game in Local Storage
function storeGameInLocalStorage (gameData){
    // Store Comprehensive Answers List
    gameData['filter_answers']
    localStorage.setItem('filter_answers', JSON.stringify(gameData['filter_answers']));

    // Store Categories
    localStorage.setItem('categories', JSON.stringify(gameData['board'][0]));

    // Store Game questions and answers
    var storeQuestions = [];
    var storeAnswers = [];

    for(let i = 1; i < 6; i++) {
        for(let j = 0; j < 6; j++) {
            storeQuestions.push(gameData['board'][i][j]['question']);
            storeAnswers.push(gameData['board'][i][j]['answer']);
        }
    }

    localStorage.setItem('questions', JSON.stringify(storeQuestions));
    localStorage.setItem('answers', JSON.stringify(storeAnswers));
}

function generateGameBoard(categories, gameButtons) {
    // Parse a list from local storage and iterate through each item to add Category
    var storageCategories = JSON.parse(localStorage.getItem('categories'));
    for(let i = 0; i < categories.length; i++) {
        categories[i].textContent = storageCategories[i];
    }
    // Parse answers and questions lists from local storage and iterate through each to add values to buttons
    var storageQuestions = JSON.parse(localStorage.getItem('questions'));
    var storageAnswers = JSON.parse(localStorage.getItem('answers'));
    for(let i = 0; i < gameButtons.length; i++) {
        gameButtons[i].setAttribute('question', storageQuestions[i]);
        gameButtons[i].setAttribute('answer', storageAnswers[i]);
    }
}

// Display Question in Modal
function displayQuestion(currentSquare, categories) {
    var col = parseInt(currentSquare.getAttribute('data-column'));
    modalTitle.textContent = categories[col].textContent;
    modalQuestion.textContent = currentSquare.getAttribute('question');
    modalAnswer.textContent = currentSquare.getAttribute('answer');
}


// Submit Answer & Check Results
function checkAnswer(e) {
    e.preventDefault();
    const message = document.querySelector('#modalMessage');
    if(answerInput.value === '') {
        setMessage(message, 'Enter your answer before submitting', 'red');
    } else {
        // Correct Answer
        if(answerInput.value.toUpperCase() === modalAnswer.textContent) {
            setMessage(message, `${answerInput.value.toUpperCase()} is Correct!`, 'green');
            updateScore(add);
        } else { // Incorrect Answer
            setMessage(message, `WRONG! The correct answer is ${modalAnswer.textContent}`, 'red');
            updateScore(subtract);
        }
        answerInput.disabled = true;
    }
}

function setMessage(element, msg, color) {
        element.textContent = msg;
        element.style.color = color;
        element.style.display = 'block';
}

function updateScore(func) {
    let totalScore = parseInt(localStorage.getItem('score'));
    let reward = parseInt(localStorage.getItem('prize'));
    let newTotal = func(totalScore, reward);
    document.querySelector('#player-score').textContent = `${newTotal}`;
    localStorage.setItem('score', newTotal);
    // Check if no questions remain
    remainingQuestions();
}

// Helper Functions to calculate new score
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function remainingQuestions() {
    let answered = 0;

    // Iterate over nodelist and count how many questions were answererd
    for(let i = 0; i < qbuttons.length; i++) {
        if(qbuttons.item(i).disabled === true) {
            answered++;
        }
    }

    if(answered === 29) {
        gameComplete();
    }
}

// Game Finished --> Sends asynchronous request to backend for updating Data
async function gameComplete() {
    let finalScore = localStorage.getItem('score');

    await fetch(`/finish_game/${finalScore}`)
        .then(response => response.json())
        .then(data => {
            if(data) {
                gameOverMessage();
            }
        })
        .catch(err => console.log(err));
}


function gameOverMessage() {
    // Clear current body
    document.querySelector('.score').style.display = 'none';
    document.getElementById('game-board').style.display = 'none';
    document.querySelector('.end_round').style.display = 'none';

    // Generate and Display Game Over Message
    document.getElementById('game-over').innerHTML = `
    <div class="row"style="margin-top: 10vh;">
        <h1 class="mx-auto">GAME OVER</h1>
    </div>
    <div class="row">
        <h3 class="mx-auto">Would you like to Play Again?</h3>
    </div>
    <div class="row" style="margin-bottom: 60vh;">
        <button class="start_round btn btn-primary mx-auto mt-3" onclick="document.location.reload()">START NEW GAME</button>
        <button class="end_round btn btn-danger mx-auto mt-3" onclick="window.location.replace('/')">END GAME</button>
    </div>
    `;
}

/***************************************************************************************
*    Title: <title of program/source code>
*    Author: <author(s) names>
*    Date: 3/25/022
*    Availability: https://www.w3schools.com/howto/howto_js_autocomplete.asp
*
***************************************************************************************/
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        // ! FOLLOWING LINE MODIFIED TO INCLUE ALL MATCHING LIST ITEMS, NOT JUST THE FIRST LETTER
        if ((arr[i].toUpperCase()).includes(val.toUpperCase())) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
        }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
        } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
        } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
        }
        }
    });
    function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
    }
    }
    function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
    }
    }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}