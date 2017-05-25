class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeSymbol: this.props.symbols[0].symbol,
      symbols: _(this.props.symbols).indexBy("symbol"),
      prices: {}
    }
    this.loadBlockchainData = this.loadBlockchainData.bind(this)
    this.loadSymbolPrices = this.loadSymbolPrices.bind(this)
    this.changeSymbol = this.changeSymbol.bind(this)
    this.loadBlockchainData()
    this.loadSymbolPrices()
  }

  loadSymbolPrices() {
    Object.values(this.state.symbols).forEach((symbolObj) => {
      YahooAPI.requestPrice(symbolObj.symbol)
        .then((price) => this.setState({
          prices: Object.assign(this.state.prices, {[symbolObj.symbol]: price})
        }))
    })
  }

  loadBlockchainData() {
    OrdersDAO.loadOrders().then((orders) => {
      this.setState({
        orders: orders
      })
    })
    PositionsDAO.loadPositions().then((positions) => {
      this.setState({
        positions: positions
      })
    })
  }

  changeSymbol(e, symbol) {
    e.preventDefault()
    this.setState({
      activeSymbol: symbol
    })
  }

  render() {
    return (
       <div>
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                  <a className="navbar-brand" href="#">CFD Market</a>
              </div>
              <ul className="nav navbar-nav">
              </ul>
            </div>
          </nav>
          <div className="container-fluid">
            <div className="col-md-2">
              <SelectSymbol changeSymbol={this.changeSymbol} activeSymbol={this.state.activeSymbol} symbols={this.props.symbols} />
            </div>
            <div className="col-md-5">
              {(this.state.orders === undefined) ? (
                <h1>Loading...</h1>
              ) : (
                <OrderBook
                  orders={this.state.orders.filter((order) => order.symbol === this.state.activeSymbol)}
                  onTrade={this.loadBlockchainData}/>
              )}
              <div>
                <TradingView symbol={this.state.symbols[this.state.activeSymbol].tv} />
              </div>
            </div>
            <div className="col-md-5">
              <div className="row">
                <CreateOrder price={this.state.prices[this.state.activeSymbol] || "..."} symbol={this.state.symbols[this.state.activeSymbol]} onTrade={this.loadBlockchainData}/>
              </div>
              <div className="row">
                <h4> My Positions </h4>
               {(this.state.positions === undefined) ? (
                  <h1>Loading...</h1>
                ) : (
                  <Positions prices={this.state.prices} symbol={this.state.activeSymbol} positions={this.state.positions}/>
                )}
              </div>
            </div>
          </div>
        </div>
    )
  }


}
