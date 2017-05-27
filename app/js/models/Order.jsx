class Order {
  constructor(blockchainOrder, id) {
    this.id = id
    this.symbol = blockchainOrder[0].toString()
    this.oracle = blockchainOrder[1].toString()
    this.long = blockchainOrder[2]
    this.collateral = blockchainOrder[3].toNumber()
    this.limitCents = blockchainOrder[4].toNumber()
    this.timestampLimit = blockchainOrder[5].toNumber()
    this.owner = blockchainOrder[6].toString()

    this.limit = this.limitCents / 100
  }

  isNull() {
    return this.symbol == ""
  }
}
