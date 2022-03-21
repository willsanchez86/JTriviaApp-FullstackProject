from flask import Flask, render_template, request, flash, redirect, url_for
from flask_bootstrap import Bootstrap
import os

# Generate secret key for Flask App configuration
# print(os.urandom(24))

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
Bootstrap(app)

@app.route('/')
def home():
    return render_template('index.html')






if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)