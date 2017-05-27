class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeSymbol: this.props.symbols[0].symbol,
      symbols: _(this.props.symbols).indexBy("symbol"),
      oracles: {},
      counters: {}
    }
    this.loadBlockchainData = this.loadBlockchainData.bind(this)
    this.loadSymbolOracles = this.loadSymbolOracles.bind(this)
    this.changeSymbol = this.changeSymbol.bind(this)
    this.loadBlockchainData()
    this.loadSymbolOracles()

    CfdMarket.OracleRespond({from: web3.eth.accounts}, 'latest').then(this.handleBlockchainTradeEvent.bind(this))
  }

  handleBlockchainTradeEvent() {
    console.log("oracle responded");
    this.loadBlockchainData();
  }

  loadSymbolOracles() {
    Object.values(this.state.symbols).forEach((symbolObj) => {
      Oracles.getOracleInfo(symbolObj.symbol, symbolObj.oracle)
        .then((info) => this.setState({
          oracles: Object.assign(this.state.oracles, {[symbolObj.symbol]: info})
        }))
    })
  }

  loadBlockchainData() {
    OrdersDAO.loadOrders().then((orders) => {
      this.setState({
        orders: orders,
        counters: _(Object.keys(this.state.symbols).map((symbol) =>
            Object.assign(this.state.counters[symbol] || {}, {
              symbol: symbol,
              totalOrders: orders.filter((o) => o.symbol == symbol).length,
              myLongOrders: orders.filter((o) => o.symbol == symbol && o.owner == web3.eth.defaultAccount && o.long).length,
              myShortOrders: orders.filter((o) => o.symbol == symbol && o.owner == web3.eth.defaultAccount && !o.long).length
            })
          )).indexBy("symbol")
      })
    })
    PositionsDAO.loadPositions().then((positions) => {
      this.setState({
        positions: positions,
        counters: _(Object.keys(this.state.symbols).map((symbol) =>
            Object.assign(this.state.counters[symbol] || {}, {
              symbol: symbol,
              longPositions: positions.filter((o) => o.symbol == symbol && o.own && o.long).length,
              shortPositions: positions.filter((o) => o.symbol == symbol && o.own && !o.long).length
            })
          )).indexBy("symbol")
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
              <SelectSymbol counters={this.state.counters} changeSymbol={this.changeSymbol} activeSymbol={this.state.activeSymbol} symbols={this.props.symbols} />
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
                <h4> My Positions </h4>
               {(this.state.positions === undefined) ? (
                  <h1>Loading...</h1>
                ) : (
                  <Positions onTrade={this.loadBlockchainData} oracles={this.state.oracles} symbol={this.state.activeSymbol} positions={this.state.positions}/>
                )}
              </div>
              <div className="row">
                <CreateOrder oracle={this.state.oracles[this.state.activeSymbol] || {oracle: "...", price: "..."}} symbol={this.state.symbols[this.state.activeSymbol]} onTrade={this.loadBlockchainData}/>
              </div>

            </div>
          </div>
        </div>
    )
  }


}
