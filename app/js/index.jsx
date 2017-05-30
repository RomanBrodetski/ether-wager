var ShowDecimals = 4


var Symbols = [
  {
    caption: "AAPL",
    symbol: "AAPL",
    tv: "NASDAQ:AAPL",
    oracleArg: "AAPL",
    oracleType: "Yahoo",
    group: "stocks"
  },
  {
    caption: "MSFT",
    symbol: "MSFT",
    tv: "NASDAQ:MSFT",
    oracleArg: "MSFT",
    oracleType: "Yahoo",
    group: "stocks"
  },
  {
    caption: "AMZN",
    symbol: "AMZN",
    tv: "NASDAQ:AMZN",
    oracleArg: "AMZN",
    oracleType: "Yahoo",
    group: "stocks"
  },
  {
    caption: "TSLA",
    symbol: "TSLA",
    tv: "NASDAQ:TSLA",
    oracleArg: "TSLA",
    oracleType: "Yahoo",
    group: "stocks"
  },
  {
    caption: "NFLX",
    symbol: "NFLX",
    tv: "NASDAQ:NFLX",
    oracleArg: "NFLX",
    oracleType: "Yahoo",
    group: "stocks"
  },
  {
    caption: "ETH/USD",
    symbol: "ETH/USD",
    tv: "KRAKEN:ETHUSD",
    oracleArg: "ETH",
    oracleType: "CryptoUsd",
    group: "crypto/usd"
  },
  {
    caption: "BTC/USD",
    symbol: "BTC/USD",
    tv: "KRAKEN:XBTUSD",
    oracleArg: "BTC",
    oracleType: "CryptoUsd",
    group: "crypto/usd"
  },
  {
    caption: "DASH/USD",
    symbol: "DASH/USD",
    tv: "KRAKEN:DASHUSD",
    oracleArg: "DASH",
    oracleType: "CryptoUsd",
    group: "crypto/usd"
  },
  {
    caption: "ETC/USD",
    symbol: "ETC/USD",
    tv: "KRAKEN:ETCUSD",
    oracleArg: "ETC",
    oracleType: "CryptoUsd",
    group: "crypto/usd"
  },
  {
    caption: "LTC/USD",
    symbol: "LTC/USD",
    tv: "KRAKEN:LTCUSD",
    oracleArg: "LTC",
    oracleType: "CryptoUsd",
    group: "crypto/usd"
  },
  {
    caption: "XLM/USD",
    symbol: "XLM/USD",
    tv: "KRAKEN:XLMUSD",
    oracleArg: "XLM",
    oracleType: "CryptoUsd",
    group: "crypto/usd"
  },
  {
    caption: "XMR/USD",
    symbol: "XMR/USD",
    tv: "KRAKEN:XMRUSD",
    oracleArg: "XMR",
    oracleType: "CryptoUsd",
    group: "crypto/usd"
  },
  {
    caption: "ZEC/USD",
    symbol: "ZEC/USD",
    tv: "KRAKEN:ZECUSD",
    oracleArg: "ZEC",
    oracleType: "CryptoUsd",
    group: "crypto/usd"
  },
  {
    caption: "REP/USD",
    symbol: "REP/USD",
    tv: "KRAKEN:REPUSD",
    oracleArg: "REP",
    oracleType: "CryptoUsd",
    group: "crypto/usd"
  },
  {
    caption: "ETH/BTC",
    symbol: "ETH/BTC",
    tv: "KRAKEN:ETHXBT",
    oracleArg: "ETH",
    oracleType: "CryptoBtc",
    group: "crypto/btc"
  },
  {
    caption: "DASH/BTC",
    symbol: "DASH/BTC",
    tv: "KRAKEN:DASHXBT",
    oracleArg: "DASH",
    oracleType: "CryptoBtc",
    group: "crypto/btc"
  },
  {
    caption: "LTC/BTC",
    symbol: "LTC/BTC",
    tv: "KRAKEN:LTCXBT",
    oracleArg: "LTC",
    oracleType: "CryptoBtc",
    group: "crypto/btc"
  },
  {
    caption: "MLN/BTC",
    symbol: "MLN/BTC",
    tv: "KRAKEN:MLNXBT",
    oracleArg: "MLN",
    oracleType: "CryptoBtc",
    group: "crypto/btc"
  },
  {
    caption: "ZEC/BTC",
    symbol: "ZEC/BTC",
    tv: "KRAKEN:ZECXBT",
    oracleArg: "ZEC",
    oracleType: "CryptoBtc",
    group: "crypto/btc"
  },
]

ReactDOM.render(<App symbols={Symbols}/>, document.getElementById('root'));
