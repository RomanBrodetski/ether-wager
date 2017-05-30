class Order {
  constructor(blockchainOrder, id) {
    console.log("order constructor invoked. Here is is")
    console.log(blockchainOrder)
    this.id = id
    this.symbolArg = web3.toUtf8(blockchainOrder[0].toString())
    this.oracle = blockchainOrder[1].toNumber()

    this.symbol = Oracles.getSymbolByBlockchain(this.symbolArg, this.oracle)

    this.long = blockchainOrder[2]
    this.collateral = blockchainOrder[3].toNumber()
    this.leverage = blockchainOrder[4].toNumber()
    this.premiumBp = blockchainOrder[5].toNumber() / 100
    this.limitMilis = blockchainOrder[6].toNumber()
    this.timestampLimit = blockchainOrder[7].toNumber()
    this.owner = blockchainOrder[8].toString()

    this.spot = this.premiumBp != 0
    this.limit = this.limitMilis / 10000
    this.collateralETH = this.collateral / Math.pow(10, 18)
  }

  isNull() {
    return this.symbol === ""
  }
}
