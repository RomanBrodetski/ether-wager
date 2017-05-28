class Position {
  constructor(blockchainPosition, id) {
    this.id = id
    this.symbol = blockchainPosition[0].toString()
    this.oracle = blockchainPosition[1].toString()
    this.shortAddress = blockchainPosition[2].toString()
    this.longAddress = blockchainPosition[3].toString()
    this.expiration = blockchainPosition[4].toNumber()
    this.priceCents = blockchainPosition[5].toNumber()
    this.collateral = blockchainPosition[6].toString()

    this.executed = blockchainPosition[7]
    this.oracleRequested = blockchainPosition[8]
    this.oracleComission = blockchainPosition[9].toNumber()
    this.expirationPriceCents = blockchainPosition[10].toNumber()
    this.longClaim = blockchainPosition[11].toNumber()
    this.shortClaim = blockchainPosition[12].toNumber()

    this.own = this.longAddress == web3.eth.defaultAccount || this.shortAddress == web3.eth.defaultAccount
    this.long = this.own && this.longAddress == web3.eth.defaultAccount
    this.price = this.priceCents / 100
    this.expirationPrice = this.expirationPriceCents / 100
    this.collateralETH = this.collateral / Math.pow(10, 18)
    this.oracleComissionETH = this.oracleComission / Math.pow(10, 18)
    this.canExecute = !this.executed && !this.oracleRequested && web3.eth.getBlock(web3.eth.blockNumber).timestamp > this.expiration
    this.state = this.computeState();
  }

  isNull() {
    return this.symbol == ""
  }

  computeState() {
    return (!this.executed && !this.canExecute && !this.oracleRequested && "active") ||
           (!this.executed && !this.canExecute && "waiting for oracle") ||
            (!this.executed && this.canExecute && "pending") ||
               (this.executed && this.canClaim() && "claim") || "closed"
  }

  stateOrder() {
    return (this.state() == "claim" && 1) ||
           (this.state() == "pending" && 2) ||
           (this.state() == "active" && 3) ||
           (this.state() == "closed" && 4)
  }

  canExecute() {
    return
  }

  canClaim() {
    return this.executed && ((this.long && this.longClaim > 0) || (!this.long && this.shortClaim > 0))
  }

  computationBasePrice(fallback) {
    return this.executed ? this.expirationPrice : fallback
  }

  PNL(oraclePrice) {
    return this.currentEquity(oraclePrice) - this.collateralETH
  }

  currentEquity(oraclePrice) {
    if (isFinite(oraclePrice)) {
      const p = this.computationBasePrice(oraclePrice)
      if (isFinite(p)) {
        var factor = p / this.price
        factor = Math.max(Math.min(factor, 2), 0)
        const long = factor * (this.collateralETH - this.oracleComissionETH / 2)
        const short = (this.collateralETH * 2) - long
        return this.long ? long : short
      }
    }
  }
}
