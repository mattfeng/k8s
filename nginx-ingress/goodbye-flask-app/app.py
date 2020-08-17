from flask import Flask, request

app = Flask(__name__)

@app.route("/")
def home():
    return "Please leave my website!"

@app.route("/goodbye")
def hello():
    name = request.args.get("name", "there")

    return f"Goodbye {name}!"
