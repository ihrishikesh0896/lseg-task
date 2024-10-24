from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app=Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "Home"
with open('db/stock-data.json') as f:
    stock_data = json.load(f)

@app.route('/api/stocks/<string:exchange_code>', methods=['GET'])
def get_stock(exchange_code):
    for exchange in stock_data:
        # print(exchange_code)
        if exchange['code'].lower() == exchange_code.lower():
            return jsonify(exchange['topStocks'])
    return jsonify({"error": "Stock exchange not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)