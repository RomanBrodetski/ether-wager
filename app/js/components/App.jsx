class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeSymbol: this.props.symbols[0].symbol,
      symbols: _(this.props.symbols).indexBy("symbol")
    }
    this.loadBlockchainData = this.loadBlockchainData.bind(this)
    this.loadBlockchainData()
  }

  loadBlockchainData() {
    OrdersDAO.loadOrders().then((orders) => {
      this.setState({
        orders: orders
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
            <div className="col-md-1">
              <ul className="nav nav-pills nav-stacked">
                {Object.values(this.props.symbols).map((symbolObj) => (
                  <li key={symbolObj.symbol} className={this.state.activeSymbol == symbolObj.symbol ? "active" : ""}>
                    <a href="#" onClick={(e) => this.changeSymbol(e, symbolObj.symbol)}>{symbolObj.symbol}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-6">
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

             <div className="col-md-2">
              <CreateOrder symbol={this.state.activeSymbol} onTrade={this.loadBlockchainData}/>
             </div>
          </div>
        </div>
    )
  }


}
