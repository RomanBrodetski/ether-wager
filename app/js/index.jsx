var ShowDecimals = 4

var Symbols = [
  {
    symbol: "AAPL",
    tv: "NASDAQ:AAPL",
    oracle: "http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=1min&apikey=P9ZM"
  },
  {
    symbol: "MSFT",
    tv: "NASDAQ:MSFT",
    oracle: "http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=P9ZM"
  },
  {
    symbol: "TWTR",
    tv: "NASDAQ:TWTR",
    oracle: "http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=TWTR&interval=1min&apikey=P9ZM"
  }
]

ReactDOM.render(<App symbols={Symbols}/>, document.getElementById('root'));
