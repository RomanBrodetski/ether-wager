class Position {
  constructor(blockchainPosition, id) {
    this.id = id
    this.symbol = blockchainPosition[0].toString()
    this.shortAddress = blockchainPosition[1].toString()
    this.longAddress = blockchainPosition[2].toString()
    this.expiration = blockchainPosition[3].toNumber()
    this.priceCents = blockchainPosition[4].toNumber()
    this.collateral = blockchainPosition[5].toString()
    this.executed = blockchainPosition[6]
    this.expirationPriceCents = blockchainPosition[7].toNumber()
    this.longClaim = blockchainPosition[8].toNumber()
    this.shortClaim = blockchainPosition[9].toNumber()

    this.long = this.longAddress == web3.eth.defaultAccount
    this.price = this.priceCents / 100
    this.expirationPrice = this.expirationPriceCents / 100
    this.collateralETH = this.collateral / Math.pow(10, 18)
  }

  isNull() {
    return this.symbol == ""
  }

  canExecute() {
    return !this.executed && web3.eth.getBlock(web3.eth.blockNumber).timestamp > this.expiration
  }

  canClaim() {
    return this.executed && ((this.long && this.longClaim > 0) || (!this.long && this.shortClaim > 0))
  }

  computationBasePrice(fallback) {
    return this.executed ? this.expirationPrice : fallback
  }
}
