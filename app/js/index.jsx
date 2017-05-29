var ShowDecimals = 4


var Symbols = [
  {
    caption: "AAPL",
    symbol: "AAPL",
    tv: "NASDAQ:AAPL",
    oracleArg: "AAPL",
    oracleType: "Yahoo"
  },
  {
    caption: "MSFT",
    symbol: "MSFT",
    tv: "NASDAQ:MSFT",
    oracleArg: "MSFT",
    oracleType: "Yahoo"
  },
  {
    caption: "AMZN",
    symbol: "AMZN",
    tv: "NASDAQ:AMZN",
    oracleArg: "AMZN",
    oracleType: "Yahoo"
  },
  {
    caption: "TSLA",
    symbol: "TSLA",
    tv: "NASDAQ:TSLA",
    oracleArg: "TSLA",
    oracleType: "Yahoo"
  },
  {
    caption: "NFLX",
    symbol: "NFLX",
    tv: "NASDAQ:NFLX",
    oracleArg: "NFLX",
    oracleType: "Yahoo"
  },
  {
    caption: "ETH/USD",
    symbol: "ETH/USD",
    tv: "KRAKEN:ETHUSD",
    oracleArg: "ETH",
    oracleType: "CryptoUsd"
  },
  {
    caption: "BTC/USD",
    symbol: "BTC/USD",
    tv: "KRAKEN:XBTUSD",
    oracleArg: "BTC",
    oracleType: "CryptoUsd"
  },
  {
    caption: "DASH/USD",
    symbol: "DASH/USD",
    tv: "KRAKEN:DASHUSD",
    oracleArg: "DASH",
    oracleType: "CryptoUsd"
  },
  {
    caption: "ETC/USD",
    symbol: "ETC/USD",
    tv: "KRAKEN:ETCUSD",
    oracleArg: "ETC",
    oracleType: "CryptoUsd"
  },
  {
    caption: "LTC/USD",
    symbol: "LTC/USD",
    tv: "KRAKEN:LTCUSD",
    oracleArg: "LTC",
    oracleType: "CryptoUsd"
  },
  {
    caption: "XLM/USD",
    symbol: "XLM/USD",
    tv: "KRAKEN:XLMUSD",
    oracleArg: "XLM",
    oracleType: "CryptoUsd"
  },
  {
    caption: "XMR/USD",
    symbol: "XMR/USD",
    tv: "KRAKEN:XMRUSD",
    oracleArg: "XMR",
    oracleType: "CryptoUsd"
  },
  {
    caption: "ZEC/USD",
    symbol: "ZEC/USD",
    tv: "KRAKEN:ZECUSD",
    oracleArg: "ZEC",
    oracleType: "CryptoUsd"
  },
  {
    caption: "REP/USD",
    symbol: "REP/USD",
    tv: "KRAKEN:REPUSD",
    oracleArg: "REP",
    oracleType: "CryptoUsd"
  },
  {
    caption: "ETH/BTC",
    symbol: "ETH/BTC",
    tv: "KRAKEN:ETHXBT",
    oracleArg: "ETH",
    oracleType: "CryptoBtc"
  },
  {
    caption: "DASH/BTC",
    symbol: "DASH/BTC",
    tv: "KRAKEN:DASHXBT",
    oracleArg: "DASH",
    oracleType: "CryptoBtc"
  },
  {
    caption: "LTC/BTC",
    symbol: "LTC/BTC",
    tv: "KRAKEN:LTCXBT",
    oracleArg: "LTC",
    oracleType: "CryptoBtc"
  },
  {
    caption: "MLN/BTC",
    symbol: "MLN/BTC",
    tv: "KRAKEN:MLNXBT",
    oracleArg: "MLN",
    oracleType: "CryptoBtc"
  },
  {
    caption: "ZEC/BTC",
    symbol: "ZEC/BTC",
    tv: "KRAKEN:ZECXBT",
    oracleArg: "ZEC",
    oracleType: "CryptoBtc"
  },
]

ReactDOM.render(<App symbols={Symbols}/>, document.getElementById('root'));
