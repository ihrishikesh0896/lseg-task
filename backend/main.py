from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import logging
from json import JSONDecodeError
from typing import List, Dict

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s:%(message)s')

def load_stock_data() -> List[Dict]:
    """Loads the stock data from a JSON file."""
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

print(stock_data)
@app.get("/")
def read_root():
    return {"message": "Home"}

@app.get("/api/stocks/{exchange_code}")
def get_stock(exchange_code: str):
    if not stock_data:
        raise HTTPException(status_code=500, detail="Stock data not available")

    try:
        for exchange in stock_data:
            if not isinstance(exchange, dict):
                continue
            code = exchange.get('code', '')
            if code.lower() == exchange_code.lower():
                top_stocks = exchange.get('topStocks', [])
                return top_stocks
        raise HTTPException(status_code=404, detail="Stock exchange not found")
    except Exception as e:
        logging.error(f"An error occurred in get_stock: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
