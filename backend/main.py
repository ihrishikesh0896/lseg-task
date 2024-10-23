from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app=Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "Home"
if __name__ == '__main__':
    app.run(debug=True)