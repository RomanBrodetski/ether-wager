class Order {
  constructor(blockchainOrder, id) {
    this.id = id
    this.symbol = blockchainOrder[0].toString()
    this.long = blockchainOrder[1].toString()
    this.collateral = blockchainOrder[2].toNumber()
    this.takerFee = blockchainOrder[3].toNumber()
  }

  isNull() {
    return this.symbol == ""
  }
}
