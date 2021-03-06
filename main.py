from flask import (
    Flask,
    render_template,
    request,
    flash,
    redirect,
    url_for,
    jsonify,
)
from flask_bootstrap import Bootstrap
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, select
from flask_login import (
    UserMixin,
    login_user,
    LoginManager,
    login_required,
    current_user,
    logout_user,
)
import random
import os
from dotenv import load_dotenv

load_dotenv()


# Generate secret key for Flask App configuration
# print(os.urandom(24))

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
Bootstrap(app)


##CONNECT TO DB
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///jeopardy.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


##CREATE TABLE IN DB
class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    # Attributes below will be updated in later version that includes multiplayer online gameplay
    games_won = db.Column(db.Integer, nullable=False)
    games_played = db.Column(db.Integer, nullable=False)
    total_winnings_USD = db.Column(db.Integer, nullable=False)


db.create_all()

## MUST ALSO CREATE MODELS FOR EXISTING TABLES WITHIN DB
class Category(db.Model):
    __tablename__ = "categories"
    category = db.Column(db.String(255), primary_key=True, nullable=False)
    num_questions = db.Column(db.Integer, nullable=False)


class Question(db.Model):
    __tablename__ = "questions"
    question_id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255), nullable=False)
    answer = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(255), nullable=False)


@app.route("/")
def home():
    # Query for highest scores in db
    leaderboard = db.session.execute(
        select(User.username, User.total_winnings_USD)
        .order_by(User.total_winnings_USD.desc())
        .limit(5)
    )

    leaders = [(row.username, row.total_winnings_USD) for row in leaderboard]

    return render_template("index.html", current_user=current_user, leaders=leaders)


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        user = User.query.filter_by(username=username).first()

        if not user or not check_password_hash(user.password, password):
            flash("invalid username and/or password")
            return redirect(url_for("login"))
        else:
            login_user(user)
            flash(f"Welcome {username}!")
            return redirect(url_for("home"))

    return render_template("login.html", current_user=current_user)


@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username_input = request.form.get("username")
        email_input = request.form.get("email")
        # Hash and salt password
        hash_and_salted_password = generate_password_hash(
            request.form.get("password"), method="pbkdf2:sha256", salt_length=8
        )

        # Check if email already in db
        if User.query.filter_by(email=email_input).first():
            flash("You've already signed up with that email, log in instead!")
            return redirect(url_for("login"))
        # Check if username already in db
        elif User.query.filter_by(username=username_input).first():
            flash("Username already taken, please choose a new one.")
            return redirect(url_for("register"))

        else:
            # Add new user into Users table
            new_user = User(
                username=username_input,
                email=email_input,
                password=hash_and_salted_password,
                games_won=0,
                games_played=0,
                total_winnings_USD=0,
            )

            db.session.add(new_user)
            db.session.commit()

            login_user(new_user)
            flash("Registration Successful!")

            return redirect(url_for("home"))

    return render_template("register.html", current_user=current_user)


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("home"))


@app.route("/new_game")
@login_required
def new_game():
    return render_template("game.html", current_user=current_user)


@app.route("/start_game", methods=["GET", "POST"])
@login_required
def start_game():
    # Retrieve list of answers to autocomplete the answerInput filter
    answer_query = db.session.execute(select(Question.answer).limit(500))
    answers_list = [row.answer for row in answer_query]

    # Join the tables to search for categories
    cat_query = db.session.execute(
        select(Question.question, Question.answer, Category.category)
        .join(Category, Question.category == Category.category)
        .order_by(func.random())
        .group_by(Category.category)
        .limit(6)
    )
    unique_categories = [row.category for row in cat_query]

    # Creates a list containing 5 lists, each of 6 items, all set to 0
    w, h = 6, 6
    game_board = [[0 for x in range(w)] for y in range(h)]

    # Load the Categories in the first row of game_board
    for i in range(len(unique_categories)):
        game_board[0][i] = unique_categories[i]

    # Add questions for each category
    for i in range(len(unique_categories)):
        question_query = db.session.execute(
            select(Question.question, Question.answer, Question.category)
            .where(Question.category == unique_categories[i])
            .limit(5)
        )
        # Create separate list because returned query object is not iterable
        questions = [
            {"question": row.question, "answer": row.answer} for row in question_query
        ]
        for j in range(len(questions)):
            game_board[j + 1][i] = questions[j]
            if questions[j]["answer"] not in answers_list:
                answers_list.append(questions[j]["answer"])

    game_data = {"board": game_board, "filter_answers": answers_list}
    return jsonify(game_data)  # serialize and use JSON headers


@app.route("/finish_game/<string:final_score>", methods=["GET", "POST"])
@login_required
def finish_game(final_score):

    final_score = int(final_score)

    if current_user.total_winnings_USD < final_score:
        current_user.total_winnings_USD = final_score
        db.session.commit()

    response = {"message": "Success"}

    return jsonify(response)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
