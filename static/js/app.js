var game_board = document.querySelector('#game-board');
var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
    backdrop: 'static',
    keyboard: false,
    show: false
})
var modalTitle = document.querySelector('.modal-title');
var modalQuestion = document.querySelector('.modal-question');
var modalAnswer = document.querySelector('.modal-answer');
var answerInput = document.querySelector('#myInput');
var modalTimer = document.querySelector('#question-timer span');
var filter = document.querySelector('#filter');
var message = document.querySelector('#message');

localStorage.setItem('score', '0');

console.log(myModal);
// Submit Answer
document.querySelector('#answerForm').addEventListener('submit', checkAnswer);
document.querySelector(".start_round").addEventListener('click', playGame);

async function playGame() {

    // Storing response and converting to JSON
    const response = await fetch('/start_game');
    var gameData = await response.json();
    console.log(gameData['board']);
    // Store Game in Local Storage
    storeGameInLocalStorage(gameData);

    // Generate game board
    var categories = document.querySelectorAll(".category span");
    var gameButtons = document.querySelectorAll('.qbutton');
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
            message.style.display = 'none';
            modalTimer.textContent = '30';
            document.getElementById('question-timer').style.color = 'yellow';
            answerInput.disabled =false;
            var modalSubmitButton = document.getElementById('submit');
            modalSubmitButton.disabled = false;




            // Display Modal Question
            displayQuestion(currentSquare, categories);
            myModal.show();
            // Start 30 second countdown
            timer(modalTimer);
            let modalForm = document.querySelector('#answerForm');
            let newCheckAnswer = function() { checkAnswer(e, currentSquare); };
            modalForm.addEventListener('submit', function(){
                answerInput.disabled = true;
                currentSquare.style.opacity = 0;
                currentSquare.disabled = true;
            });
        }
    })
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

// TImer
function timer(modalTimer) {
    var countSeconds = parseInt(modalTimer.textContent);
    var countDown = setInterval(()=>{
        countSeconds--;
        if(countSeconds < 10) {
            modalTimer.textContent = `0${countSeconds}`;
        } else {
            modalTimer.textContent = String(countSeconds);
        }
        if(countSeconds <= 0) {
            document.getElementById('question-timer').style.color = 'red';
            clearInterval(countDown);
        }
    },1000)
}

// Submit Answer & Check Results
function checkAnswer(e, currentSquare) {
    e.preventDefault();
    var reward = parseInt(localStorage.getItem('prize'));
    var totalScore = parseInt(localStorage.getItem('score'));
    console.log(`Prize: ${reward}`);

    if(answerInput.value === '') {
        setMessage('Enter your answer before submitting', 'red');
    } else {
        // Correct Answer
        if(answerInput.value.toUpperCase() === modalAnswer.textContent) {
            setMessage(`${answerInput.value.toUpperCase()} is Correct!`, 'green');
            var newTotal = reward + totalScore;
        } else { // Incorrect Answer
            setMessage(`WRONG! The correct answer is ${modalAnswer.textContent}`, 'red');
            var newTotal = totalScore - reward;
        }
    }

    document.querySelector('#player-score').textContent = `${newTotal}`;
    localStorage.setItem('score', newTotal);
}

function setMessage(msg, color) {
        message.textContent = msg;
        message.style.color = color;
        message.style.display = 'block';
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
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
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