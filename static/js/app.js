var game_board = document.getElementById('game-board');
var modalTitle = document.querySelector('.modal-title');
var modalQuestion = document.querySelector('.modal-question');

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

    // Add Event Listener for gameboard functionality
    game_board.addEventListener('click', function(e) {
    if(e.target.className === 'button') {
        var row = parseInt(e.target.getAttribute('data-row'));
        var column = parseInt(e.target.getAttribute('data-column'));
    }
    modalTitle.textContent = data[0][column];
    modalQuestion.textContent = data[row][column]['question'];
    console.log(modalQuestion);
})
}

