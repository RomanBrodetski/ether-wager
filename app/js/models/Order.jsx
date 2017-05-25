class Order {
  constructor(blockchainOrder, id) {
    this.id = id
    this.symbol = blockchainOrder[0].toString()
    this.long = blockchainOrder[1]
    this.collateral = blockchainOrder[2].toNumber()
    this.limitCents = blockchainOrder[3].toNumber()
    this.timestampLimit = blockchainOrder[4].toNumber()
    this.owner = blockchainOrder[5].toString()

    this.limit = this.limitCents / 100
  }

  isNull() {
    return this.symbol == ""
  }
}
