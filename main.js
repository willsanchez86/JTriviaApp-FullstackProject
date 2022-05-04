var game_board = document.querySelector('#game-board');
var game_buttons = document.querySelectorAll('.qbutton');
var modalTitle = document.querySelector('.modal-title');
var modalQuestion = document.querySelector('.modal-question');
var modalAnswer = document.querySelector('.modal-answer');
var answerInput = document.querySelector('#myInput');
var modalTimer = document.querySelector('#question-timer span');
var filter = document.querySelector('#filter');
var message = document.querySelector('#message');
var playerScore = document.querySelector('#player-score');

document.querySelector(".start_round").addEventListener('click', playGame);

async function playGame() {
    var remaining_questions = 30;
    
    while(remaining_questions > 0) {
        // Storing response and converting to JSON
        // Questions Information
        const response = await fetch('/start_game');
        var game_data = await response.json();
        var data = game_data['board'];
    
        // Complete Answers List
        var answersList = game_data['filter_answers'];
    
        console.log(data);
        console.log(answersList);
    
        // Generate game categories
        var categories = document.querySelectorAll(".category span");
        for(let i = 0; i < categories.length; i++) {
            categories[i].textContent = data[0][i];
        }
    
        // Question Sequence Initiates
        game_board.addEventListener('click', function(e) {
        // Retrieve answers list from template
        autocomplete(document.getElementById("myInput"), answersList['answers']);
        if(e.target.className === 'qbutton') {
            var currentSquare = e.target;
            //Reset Modal Timer
            modalTimer.textContent = '30';
            document.getElementById('question-timer').style.color = 'yellow';
            answerInput.disabled=false;
    
            var row = parseInt(e.target.getAttribute('data-row'));
            var column = parseInt(e.target.getAttribute('data-column'));
            var prize = parseInt(e.target.textContent.replace('$', ''));
            // Display Modal Question
            displayQuestion(data, row, column, prize);
            // Start 30 second countdown
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
            // Submit Answer
            document.getElementById('submit-answer').addEventListener('click', checkAnswer(e));
            }
        })
    }
}