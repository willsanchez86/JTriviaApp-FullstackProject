from flask import Flask, render_template, request, flash, redirect, url_for, jsonify
from flask_bootstrap import Bootstrap
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, select, distinct

from flask_login import UserMixin, login_user, LoginManager, login_required, current_user, logout_user
import random
import os


# Generate secret key for Flask App configuration
# print(os.urandom(24))

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
Bootstrap(app)

##CONNECT TO DB
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///jeopardy.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app (app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


##CREATE TABLE IN DB
class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String (100), unique=True, nullable=False)
    email = db.Column(db.String (100), unique=True, nullable=False)
    password = db.Column(db.String (100), nullable=False)
    # Attributes below will be updated in later version that includes multiplayer online gameplay
    games_won = db.Column(db.Integer, nullable=False)
    games_played = db.Column(db.Integer, nullable=False)
    total_winnings = db.Column(db.Integer, nullable=False)

# db.create_all()

## MUST ALSO CREATE MODELS FOR EXISTING TABLES WITHIN DB
class Category(db.Model):
    __tablename__ = "categories"
    category = db.Column(db.String (255), primary_key=True, nullable=False)
    num_questions = db.Column(db.Integer, nullable=False)


class Question(db.Model):
    __tablename__ = "questions"
    question_id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255), nullable=False)
    answer = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(255), nullable=False)



@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')
        print(username, password)
        return redirect(url_for('home'))
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('/'))


@app.route('/new_game')
def new_game():
    return render_template('game.html')


@app.route('/start_game', methods=['GET', 'POST'])
def start_game():
    # Retrieve list of answers to autocomplete the answerInput filter
    answer_query = db.session.execute(select(Question.answer).limit(500))
    answers_list = [row.answer for row in answer_query]

    # Join the tables to search for categories
    cat_query = db.session.execute(
        select(Question.question, Question.answer, Category.category).
        join(Category, Question.category == Category.category).
        order_by(func.random()).
        group_by(Category.category).
        limit(6)
    )
    unique_categories = [row.category for row in cat_query]

    # Creates a list containing 5 lists, each of 8 items, all set to 0
    w, h = 6, 6
    game_board = [[0 for x in range(w)] for y in range(h)]

    # Load the Categories in the first row of game_board
    for i in range(len(unique_categories)):
        game_board[0][i] = unique_categories[i]

    # Add questions for each category
    for i in range(len(unique_categories)):
        question_query = db.session.execute(
            select(Question.question, Question.answer, Question.category).
            where(Question.category == unique_categories[i]).
            limit(5)
        )
        # Create separate list because returned query object is not iterable
        questions = [{'question': row.question, 'answer': row.answer} for row in question_query]
        for j in range(len(questions)):
            game_board[j+1][i] = questions[j]
            if questions[j]['answer'] not in answers_list:
                answers_list.append(questions[j]['answer'])

    game_data = {
        'board': game_board,
        'filter_answers': answers_list
    }
    return jsonify(game_data)  # serialize and use JSON headers




if __name__ == "__main__":
    app.run (host='0.0.0.0', port=5000)
