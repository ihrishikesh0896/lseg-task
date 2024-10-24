import React, { useState } from "react";
import { FaRobot } from "react-icons/fa6";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import "./App.css";

const App = () => {
  const [exchange, setExchange] = useState(null);
  const [stocks, setStocks] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);

  const exchanges = [
    { code: "LSE", name: "London Stock Exchange" },
    { code: "NYSE", name: "New York Stock Exchange" },
    { code: "NASDAQ", name: "Nasdaq" },
  ];
  const handleExchangeSelect = (exchangeCode, exchangeName) => {
    setExchange(exchangeName);
    axios
      .get(`http://localhost:5000/api/stocks/${exchangeCode}`)
      .then((response) => {
        setStocks(response.data);
        setSelectedStock(null);
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
      });
  };

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  const handleCleanUp = () => {
    setStocks(null);
    setSelectedStock(null);
    setExchange(null);
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <FaRobot /> LSEF chatbot
        </div>
        <div className="chat-messages" id="chatMessages">
          <span className="message bot">
            Hello! Welcome to LSEG. I'm here to help you.
          </span>
          <Card style={{ width: "50rem" }}>
            <Card.Header className="header">
              Please select a Stock Exchange.
            </Card.Header>
            <ListGroup variant="flush">
              {exchanges.map((ex) => (
                <ListGroup.Item
                  className="text-center"
                  key={ex.code}
                  onClick={() => handleExchangeSelect(ex.code, ex.name)}
                >
                  {ex.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
          <div className="result-block">
            {exchange && <span className="stocks-message">{exchange}</span>}
          </div>
          {stocks && (
            <Card style={{ width: "50rem" }}>
              <Card.Header className="header">
                Please select a stock.
              </Card.Header>
              <ListGroup variant="flush">
                {stocks.map((stock) => (
                  <ListGroup.Item
                    className="text-center"
                    key={stock.code}
                    onClick={() => handleStockSelect(stock)}
                  >
                    {stock.stockName}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          )}
          <div className="result-block">
            {selectedStock && (
              <span className="stocks-message">{selectedStock.stockName}</span>
            )}
          </div>

          {selectedStock && (
            <Card style={{ width: "50rem" }}>
              <Card.Header className="header">
                Stock Price of {selectedStock.stockName} is Price: $
                {selectedStock.price} Please select an option.
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item
                  className="text-center"
                  onClick={() => handleCleanUp()}
                >
                  Main Menu
                </ListGroup.Item>
                <ListGroup.Item
                  className="text-center"
                  onClick={() => setSelectedStock(null)}
                >
                  Go Back
                </ListGroup.Item>
              </ListGroup>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
