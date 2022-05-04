const inputs = document.querySelectorAll('.form__input');

inputs.forEach(function(entry) {
    entry.addEventListener('keyup', validate);
});

// Validate function that includes all form inputs
function validate(e) {
    const input = e.target;

    if(input.id === 'email') {
        validateEmail(input);
    } else if(input.id === 'username') {
        validateUser(input);
    } else if(input.id === 'password') {
        validatePassword(input);
    }
}

// In order to ensure that all input fields (for both login and register pages) are valid at the same time and haven't reverted back, we needed to iterate over the nodelist to output an array of balls --> then re-enable the button only when all of the bools were true
document.querySelector('form').addEventListener('keyup', function() {
    let checks = [];
    inputs.forEach((input) => checks.push(input.classList.contains('is-valid')));
    let passed = checks.every((item) => item === true);

    if(passed) {
        document.querySelector('.form__button').disabled = false;
    } else {
        document.querySelector('.form__button').disabled = true;
    }
});


// Email validation
function validateEmail(input) {
    const email = input;
    const message = document.getElementById('emailMessage');
    // Requirements: Starts with characters, includes @, includes browser, and .extension less than 5 letters to finish
    const re = /^([a-zA-z0-9_\-\.]+)@([a-zA-z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

    // Check if email input is empty
    if(email.value === '') {
        setMessage(message, '*Required*', '#cc3333')
        email.classList.remove('is-valid');
    // Check if email meets requirements
    } else if(!re.test(email.value)) {
        setMessage(message, 'Please Enter a Valid Email', '#cc3333')
        email.classList.remove('is-valid');
    } else {
        message.style.display = 'none';
        email.classList.add('is-valid');
    }
}

// User Validation -- Only requires that input field is not empty
function validateUser(input) {
    const entry = input;
    const message = document.getElementById('userMessage');

    if(entry.value === '') {
        setMessage(message, '*Required*', '#cc3333')
        entry.classList.remove('is-valid');
    } else {
    message.style.display = 'none';
    entry.classList.add('is-valid');
    }
}

// Password Validation
function validatePassword(input) {
    const title = document.querySelector('.form__title').textContent;
    const password = input;
    const message = document.getElementById('passwordMessage');

    // Check if password input is empty
    if(title === 'Login') {

        if(password.value === '') {
            setMessage(message, '*Required*', '#cc3333')
            password.classList.remove('is-valid');
        } else {
            message.style.display = 'none';
            password.classList.add('is-valid');
        }

    } else {
        document.getElementById('passwordRequirements').style.display = 'block';
        let lowercase = false;
        let uppercase = false;
        let digit = false;
        let special = false;
        let min = false;

        // Check all requirements
        // At least one uppercase
        if(password.value.match(/[A-Z]/)) {
            document.getElementById('upper').style.color = 'green';
            uppercase = true;
        } else {
            document.getElementById('upper').style.color = 'red';
            uppercase = false;
        }
        // At least one lowercase
        if(password.value.match(/[a-z]/)) {
            document.getElementById('lower').style.color = 'green';
            lowercase = true;
        } else {
            document.getElementById('lower').style.color = 'red';
            lowercase = false;
        }
        // At least one number
        if(password.value.match(/\d/)) {
            document.getElementById('digit').style.color = 'green';
            digit = true;
        } else {
            document.getElementById('digit').style.color = 'red';
            digit = false;
        }
        // At least one special character
        if(password.value.match(/[●!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/)) {
            document.getElementById('special').style.color = 'green';
            special = true;
        } else {
            document.getElementById('special').style.color = 'red';
            special = false;
        }
        // At least 8 characters
        if(password.value.match(/^.{8,32}$/)) {
            document.getElementById('min8').style.color = 'green';
            min = true;
        } else {
            document.getElementById('min8').style.color = 'red';
            min = false;
        }


        // Passed all checks and password is valid
        if(lowercase && uppercase && digit && special && min) {
            password.classList.add('is-valid');
        } else {
            password.classList.remove('is-valid');
        }
    }
}


// Set Message helper function
function setMessage(element, msg, color) {
    element.textContent = msg;
    element.style.color = color;
    element.style.display = 'block';
}


// Password masking and unmasking functions
function showHidePassword(element) {
    const passwordField = document.getElementById('password');
    const label = element.parentElement.previousElementSibling;
    if(passwordField.type === 'password') {
        passwordField.type = 'text';
        label.style.top = '0px';
        element.classList.add('fa-eye-slash');
    } else {
        element.classList.remove('fa-eye-slash');
        passwordField.type = 'password';
    }
    passwordField.focus();
    passwordField.addEventListener('blur', hideIcon);
}

function showIcon(element) {
    element.removeEventListener('blur', hideIcon);
    const icon = document.getElementById('togglePassword');
    icon.style.display = 'block';
    icon.setAttribute("onclick", "showHidePassword(this)");
}

function hideIcon() {
    const passwordField = document.getElementById('password');
    passwordField.type = 'password';
    const icon = document.getElementById('togglePassword');
    icon.style.display = 'none';
    icon.removeAttribute("onclick", "showHidePassword(this)");
    icon.classList.remove('fa-eye-slash');

}