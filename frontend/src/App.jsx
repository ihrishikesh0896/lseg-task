import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [exchange, setExchange] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  const exchanges = [
    { code: 'LSE', name: 'London Stock Exchange' },
    { code: 'NYSE', name: 'New York Stock Exchange' },
    { code: 'NASDAQ', name: 'Nasdaq' }
  ];

  // Fetch stock data based on exchange selection
  const handleExchangeSelect = (exchangeCode) => {
    setExchange(exchangeCode);
    axios.get(`http://localhost:5000/api/stocks/${exchangeCode}`)
      .then((response) => {
        setStocks(response.data);
        setSelectedStock(null);
      })
      .catch((error) => {
        console.error('Error fetching stock data:', error);
      });
  };

  // Handle stock selection to display the stock price
  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="app">
      <h1>Stock Exchange Chatbot</h1>
      {!exchange && (
        <div className="menu">
          <h2>Select a Stock Exchange</h2>
          {exchanges.map((ex) => (
            <button key={ex.code} onClick={() => handleExchangeSelect(ex.code)}>
              {ex.name}
            </button>
          ))}
        </div>
      )}
      {exchange && !selectedStock && (
        <div className="stocks-menu">
          <h2>Top 5 Stocks in {exchange}</h2>
          {stocks.map((stock) => (
            <button key={stock.code} onClick={() => handleStockSelect(stock)}>
              {stock.stockName}
            </button>
          ))}
          <button onClick={() => setExchange(null)}>Go to Home Menu</button>
        </div>
      )}
      {selectedStock && (
        <div className="stock-details">
          <h2>{selectedStock.stockName} - Price: ${selectedStock.price}</h2>
          <button onClick={() => setSelectedStock(null)}>Back to Stock Menu</button>
          <button onClick={() => setExchange(null)}>Go to Home Menu</button>
        </div>
      )}
    </div>
  );
};

export default App;
