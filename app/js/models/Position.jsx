class Position {
  constructor(blockchainPosition, id, blockchainEx, oracleRequested) {
    this.id = id
    this.symbol = web3.toUtf8(blockchainPosition[0].toString())
    this.oracle = blockchainPosition[1].toString()
    this.shortAddress = blockchainPosition[2].toString()
    this.longAddress = blockchainPosition[3].toString()
    this.expiration = blockchainPosition[4].toNumber()
    this.priceCents = blockchainPosition[5].toNumber()
    this.collateral = blockchainPosition[6].toString()
    this.leverage = blockchainPosition[7].toNumber()

    this.executed = blockchainPosition[8]
    this.oracleComission = blockchainPosition[9].toNumber()
    this.expirationPriceCents = blockchainEx[0].toNumber()
    this.longClaim = blockchainEx[1].toNumber()
    this.shortClaim = blockchainEx[2].toNumber()

    this.oracleRequested = oracleRequested
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

        const total = (2 * this.collateralETH - this.oracleComissionETH)
        const base = total / 2
        const long = Math.min(base + (base * p / this.price - base) * this.leverage, total)
        return this.long ? long : (total - long)
      }
    }
  }
}
