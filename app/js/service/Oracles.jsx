class Oracles {
  static getSymbolByBlockchain(oracleArg, oracleType) {
    return _(Symbols).find((symbol) => symbol.oracleArg == oracleArg && Oracles.toBlockchain(symbol.oracleType) == oracleType).symbol
  }

  static elements() {
    return ["Yahoo", "CryptoUsd", "CryptoBtc"]
  }

  static toBlockchain(oracle) {
    return _(this.elements()).indexOf(oracle);
  }

  static fromBlockchain(index) {
    return this.elements()[oracle];
  }

  static getOracleInfo(symbol, oracle) {
    return CfdMarket.buildOracleUrl(symbol, this.toBlockchain(oracle))
            .then((r) => {
              const url = r.match(/json\((.*)\)/)[1]
              const jsonpath = r.match(/\)\.(.*)/)[1]
              return $.getJSON(url).then((json) => {
                return {
                  url: url,
                  query: jsonpath,
                  price: jsonPath(json, jsonpath)
                }
              })
            })
  }
}
