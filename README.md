# JTrivia!
### Overview
Based on the popular game show Jeopardy, this application's gameplay was implemented using raw JavaScript (no libraries) for DOM Manipulation through event handlers. This database contains nearly 50,000 questions to keep users on their toes and constantly entertained. 

<strong>Disclaimer:</strong>  -Trivia is a non-profit web app created solely for educational purposes. Database contains questions from JeopardyQuestions.com, which was created by fans, for fans. The Jeopardy! game show and all elements thereof, including but not limited to copyright and trademark thereto, are the property of Jeopardy Productions, Inc. and are protected under law. This website is not affiliated with, sponsored by, or operated by Jeopardy Productions, Inc.

<a href="https://will-jtrivia.herokuapp.com/"><img src="https://img.shields.io/badge/-DEMO-4E69C8?style=for-the-badge&logo=appveyor;link=https://will-jtrivia.herokuapp.com/" alt="DEMO"></a>


### Features
* Scrapy application used to scrape 50,000 questions into the Sqlite3 Database
* Python/Flask Back-End 
* Autocomplete text box helps prevent incorrect answers due to incorrect spelling, which keeps the gameplay more authentic without the need for multiple choice questions
* Registration & Authentication utilize both JavaScript(requirement validation) and then Python(hashing, check, and granting access)
* Leaderboard to compare against other competitors


### Installation And Startup
```bash
Clone the repository and change directory into it:
  
git clone https://github.com/willsanchez86/JTriviaApp=FullstackProject.git 
cd JTriviaApp=FullstackProject
  
Activate Virtual Environment
  
pip install - r requirements.txt
  
Setup Flask App:
  * On Command Prompt/Bash:
      set FLASK_APP=main.py
  * On Powershell:
      $env:FLASK_APP = "main.py"
      
flask run
```




### Usage & Details
* Register a new account, or sign in for existing user
* Navigate to the New Game page via the Navbar
* Click "Start New Game" button to begin playing

<strong>Gameplay:</strong>
ISSUE: Do not refresh page during gameplay, all progress will be lost!

* You will be presented with six categories and five clues for each category. Each clue will be listed by it's "dollar value"
* Click on a clue to reveal it's question and a form to submit your answer
* You have 30 seconds to answer each question. Close button is disabled on question box until an answer has been submitted, or the time has run out
* If you have answered correctly, the question's dollar value will be added to your score. If you have answered incorrectly, the dollar value will be taken away from your score
* Game is over when no questions remain

### Future Releases
* Refresh will not remove game data, and features will be implemented to store and re-store previous game progress upon reload
* Front-End will likely be rebuilt using React for clearner, dynamic rendering
* Live, multiplayer Gameplay



### Credits
* Questions scraped from https://jeopardyquestions.com , a site that was created by fans-for fans. 
* Answer Autocomplete functionality was customized from <a href="https://www.w3schools.com/howto/howto_js_autocomplete.asp">w3schools</a>
