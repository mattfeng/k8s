from flask import Flask, request

app = Flask(__name__)

@app.route("/")
def home():
    return "Welcome to my website!"

@app.route("/hello")
def hello():
    name = request.args.get("name", "there")

    return f"Hello {name}!"
