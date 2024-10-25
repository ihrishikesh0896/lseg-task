from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import logging
from json import JSONDecodeError

app = Flask(__name__)
CORS(app)

# Configure logging to include the time, level, and message
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s:%(message)s')

@app.route('/')
def index():
    return "Home"

def load_stock_data():
    try:
        with open('db/stock-data.json') as f:
            data = json.load(f)
            if not isinstance(data, list):
                logging.error("Error: Stock data is not a list.")
                return []
            return data
    except FileNotFoundError:
        logging.error("Error: 'db/stock-data.json' file not found.")
        return []
    except JSONDecodeError as e:
        logging.error(f"Error parsing JSON file: {e}")
        return []
    except Exception as e:
        logging.error(f"An unexpected error occurred while loading stock data: {e}")
        return []

stock_data = load_stock_data()

@app.route('/api/stocks/<string:exchange_code>', methods=['GET'])
def get_stock(exchange_code):
    if not stock_data:
        return jsonify({"error": "Stock data not available"}), 500

    try:
        for exchange in stock_data:
            if not isinstance(exchange, dict):
                continue
            code = exchange.get('code', '')
            if code.lower() == exchange_code.lower():
                top_stocks = exchange.get('topStocks', [])
                return jsonify(top_stocks)
        return jsonify({"error": "Stock exchange not found"}), 404
    except Exception as e:
        logging.error(f"An error occurred in get_stock: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
