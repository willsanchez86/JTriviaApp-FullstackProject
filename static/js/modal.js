function modalQuestion(e, game_board, currentSquare, categories, answersList) {

    //-------------------Create Question Modal---------------------//
    // Modal Div
    const myModal = document.createElement('div');
    myModal.classList.add('modal');
    myModal.classList.add('fade');
    myModal.setAttribute('id', 'myModal');
    myModal.setAttribute('tabindex', '-1');
    myModal.setAttribute('role', 'dialog');
    game_board.appendChild(myModal);
    // Modal Dialog
    const modalDialog = document.createElement('div');
    modalDialog.classname = 'modal-dialog';
    modalDialog.setAttribute('role', 'document');
    myModal.appendChild(modalDialog);
    // Modal Content -- Contains Header/Body/Footer
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalDialog.appendChild(modalContent);

        // Header
    const header = document.createElement('div');
    header.className = 'modal-header';
    modalContent.appendChild(header);

            // Header-Modal Title
    const modalTitle = document.createElement('h5');
    modalTitle.className = 'modal-title';
    modalTitle.setAttribute('id', 'myModalTitle');
    var col = parseInt(currentSquare.getAttribute('data-column'));
    modalTitle.appendChild(document.createTextNode(categories[col].textContent));
    header.appendChild(modalTitle);

            // Header Modal Timer
    const modalTimer = document.createElement('h5');
    modalTimer.className = 'modal-title';
    modalTimer.setAttribute('id', 'question-timer');
    modalTimer.appendChild(document.createTextNode(':30'));
    header.appendChild(modalTimer);

            // Header Close Button
    const closeButton = document.createElement('button');
    closeButton.setAttribute('type', 'button');
    closeButton.className = 'close';
    closeButton.setAttribute('data-dismiss', 'modal'); // ADJUST THIS FUNCTION IF SOLUTION DOES NOT WORK
    closeButton.setAttribute('aria-label', 'Close');
    header.appendChild(closeButton);
    const x = document.createElement('span');
    x.setAttribute('aria-hidden', 'true');
    x.appendChild(document.createTextNode('x'));
    closeButton.appendChild(x);

        // Body
    const body = document.createElement('div');
    body.className = 'modal-body';
    modalContent.appendChild(body);

            // Body Question-Answer
    const modalQuestion = document.createElement('p');
    modalQuestion.className = 'modal-question';
    modalQuestion.appendChild(document.createTextNode(currentSquare.getAttribute('question')));
    body.appendChild(modalQuestion);

    const modalAnswer = document.createElement('p');
    modalAnswer.className = 'modal-answer';
    modalAnswer.appendChild(document.createTextNode(currentSquare.getAttribute('answer')));
    body.appendChild(modalAnswer);

        // Submit Form --- setting without ID
    const form = document.createElement('form');
    form.setAttribute('autocomplete', 'off');
    modalContent.appendChild(form);
            //Form Contents
    const formDiv = document.createElement('div');
    formDiv.className = 'autocomplete';
    formDiv.setAttribute('style', 'width:300px;');
    form.appendChild(formDiv);

    const answerInput = document.createElement('input'); // Creating without ID or name
    answerInput.setAttribute('type', 'text');
    answerInput.setAttribute('placeholder', 'Enter your Answer');
    formDiv.appendChild(answerInput);

    const message = document.createElement('p'); // Creating without ID
    message.appendChild(document.createTextNode(''));
    formDiv.appendChild(message);

    const formSubmitButton = document.createElement('input'); // Creating without ID
    formSubmitButton.setAttribute('type', 'submit');
    form.appendChild(formSubmitButton);

        // Footer
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    modalContent.appendChild(footer);

    // Initialize BootStrap Modal Object and Show
//    var currModal = new bootstrap.Modal(myModal, {
//    backdrop: 'static',
//    keyboard: false,
//    show: false
//    })

    console.log(myModal);

    myModal.style.display = 'block';
    modalDialog.style.display = 'block';
    modalContent.style.display = 'block';
    autocomplete(answerInput, answersList);
    // Start Timer
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

    // Form Submission
    let newCheckAnswer = function() { checkAnswer(e, currentSquare, playerScore); };
    form.addEventListener('submit', newCheckAnswer, false);
}