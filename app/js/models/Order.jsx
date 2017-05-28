class Order {
  constructor(blockchainOrder, id) {
    this.id = id
    this.symbol = blockchainOrder[0].toString()
    this.oracle = blockchainOrder[1].toString()
    this.long = blockchainOrder[2]
    this.collateral = blockchainOrder[3].toNumber()
    this.spot = blockchainOrder[4]
    this.premiumBp = blockchainOrder[5].toNumber() / 100
    this.oracleRequested = blockchainOrder[6]
    this.limitCents = blockchainOrder[7].toNumber()
    this.timestampLimit = blockchainOrder[8].toNumber()
    this.owner = blockchainOrder[9].toString()

    this.limit = this.limitCents / 100
  }

  isNull() {
    return this.symbol == ""
  }
}
