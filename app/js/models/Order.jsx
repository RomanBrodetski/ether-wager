class Order {
  constructor(blockchainOrder, id) {
    this.id = id

    this.symbol = web3.toUtf8(blockchainOrder[0].toString())
    this.oracle = blockchainOrder[1].toString()
    this.long = blockchainOrder[2]
    this.collateral = blockchainOrder[3].toNumber()
    this.leverage = blockchainOrder[4].toNumber()
    this.premiumBp = blockchainOrder[5].toNumber() / 100
    this.limitCents = blockchainOrder[6].toNumber()
    this.timestampLimit = blockchainOrder[7].toNumber()
    this.owner = blockchainOrder[8].toString()

    this.spot = this.premiumBp != 0
    this.limit = this.limitCents / 100
    this.collateralETH = this.collateral / Math.pow(10, 18)
  }

  isNull() {
    return this.symbol === ""
  }
}
