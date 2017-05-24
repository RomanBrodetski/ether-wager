var ShowDecimals = 4

var Symbols = [
  {
    symbol: "AAPL",
    tv: "NASDAQ:AAPL"
  },
  {
    symbol: "MSFT",
    tv: "NASDAQ:MSFT"
  },
  {
    symbol: "LNKD",
    tv: "NYSE:LNKD"
  }
]

ReactDOM.render(<App symbols={Symbols}/>, document.getElementById('root'));
