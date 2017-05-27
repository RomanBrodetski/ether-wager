var ShowDecimals = 4


var Symbols = [
  {
    symbol: "AAPL",
    tv: "NASDAQ:AAPL",
    oracle: "Yahoo"
  },
  {
    symbol: "MSFT",
    tv: "NASDAQ:MSFT",
    oracle: "Yahoo"
  },
  {
    symbol: "TWTR",
    tv: "NYSE:TWTR",
    oracle: "Yahoo"
  }
]

ReactDOM.render(<App symbols={Symbols}/>, document.getElementById('root'));
