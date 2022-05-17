# JTrivia!

## Usage

### Installation And Startup
* cd to the directory where requirements.txt is located
* activate your virtualenv
* run: pip install -r requirements.txt in your shell
* Setup Flask App:
  * On Command Prompt/Bash:
      run: set FLASK_APP=main.py
  * On powershell
      run: $env:FLASK_APP = "main.py"
* run: flask run


### Gameplay
* You will be presented with six categories and five clues for each category. Each clue will be listed by it's "dollar value."
* Click on a clue to reveal it's question and a form to submit your answer.
* If you have answered correctly, the clue's dollar value will be add to your score. If you have answered incorrectly, the dollar value will be taken away from your score.

## Development


