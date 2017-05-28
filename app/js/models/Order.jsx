class Order {
  constructor(blockchainOrder, id) {
    this.id = id
    this.symbol = blockchainOrder[0].toString()
    this.oracle = blockchainOrder[1].toString()
    this.long = blockchainOrder[2]
    this.collateral = blockchainOrder[3].toNumber()
    this.leverage = blockchainOrder[4].toNumber()
    this.spot = blockchainOrder[5]
    this.premiumBp = blockchainOrder[6].toNumber() / 100
    this.oracleRequested = blockchainOrder[7]
    this.limitCents = blockchainOrder[8].toNumber()
    this.timestampLimit = blockchainOrder[9].toNumber()
    this.owner = blockchainOrder[10].toString()

    this.limit = this.limitCents / 100
  }

  isNull() {
    return this.symbol == ""
  }
}
