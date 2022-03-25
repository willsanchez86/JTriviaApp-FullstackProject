var game_board = document.getElementById('game-board');
var modalTitle = document.querySelector('.modal-title');
var modalQuestion = document.querySelector('.modal-question');
var modalAnswer = document.querySelector('.modal-answer');
var modalTimer = document.querySelector('#question-timer span');

document.querySelector(".start_round").addEventListener('click', getGameData);

async function getGameData() {

    // Storing response
    const response = await fetch('/start_game');

    // Storing data in form of JSON
    var data = await response.json();
    console.log(data)
    console.log(data[1][0]['answer']);


    // Generate game categories
    var categories = document.querySelectorAll(".category span");
    for(let i = 0; i < categories.length; i++) {
        categories[i].textContent = data[0][i];
        console.log(categories[i]);
    }

    // Add Event Listener for gameboard functionality --> Start Game once clicked
    game_board.addEventListener('click', function(e) {
    if(e.target.className === 'button') {
        var row = parseInt(e.target.getAttribute('data-row'));
        var column = parseInt(e.target.getAttribute('data-column'));
        var prize = parseInt(e.target.textContent.replace('$', ''));
        // Display Modal Question and start timer
        displayQuestion(data, row, column, prize);
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
})
}

// Answer Question function in modal
function displayQuestion(data, row, column) {
    modalTitle.textContent = data[0][column];
    modalQuestion.textContent = data[row][column]['question'];
    modalAnswer.textContent = data[row][column]['answer'];
}



