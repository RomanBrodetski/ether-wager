class Oracles {
  static toBlockchain(oracle) {
    return _(["Yahoo", "CryptoUsd", "CryptoBtc"]).indexOf(oracle);
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
