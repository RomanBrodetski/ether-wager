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
    this.trackedSymbols = this.trackedSymbols.bind(this)
    this.changeSymbol = this.changeSymbol.bind(this)
    this.loadInitialOrders()
    setInterval(this.loadSymbolOracles, 10000);

    this.computeCounters = this.computeCounters.bind(this);
  }

  handleBlockchainOrderEvent(event) {
    console.log("handleBlockchainOrderEvent")
    OrdersDAO.loadOrder(event.args.id.toNumber()).then((order) => {
      console.log(order)
      if (order) {
        console.log("upd")
        this.setState({
          orders: Object.assign(this.state.orders, {[order.id]: order})
        }, this.computeCounters)
      } else {
        console.log("rem")
        this.setState({
          orders: _.pick(this.state.orders, (value, key) => key !== event.args.id.toString())
        }, this.computeCounters)
      }
    })
  }

  handleBlockchainPositionEvent(event) {
    console.log("handleBlockchainPositionEvent")
    PositionsDAO.loadPosition(event.args.id.toNumber()).then((position) => {
      this.setState({
        positions: Object.assign(this.state.positions, {[position.id]: position})
      }, this.computeCounters)
    })
  }

  trackedSymbols() {
    return _.uniq(Object.values(this.state.positions || []).map((pos) => pos.symbol).concat([this.state.activeSymbol]))
  }

  loadSymbolOracles() {
    console.log("loadSymbolOracles")
    Promise.all(this.trackedSymbols().map((symbol) => {
      const symbolObj = this.state.symbols[symbol]
      return Oracles.getOracleInfo(symbolObj.oracleArg, symbolObj.oracleType).then((info) => Object.assign(info, {symbol: symbol}))
    }))
    .then((data) => {
      this.setState({
        oracles: Object.assign(this.state.oracles, _(data).indexBy("symbol"))
      })
    })
  }

  computeCounters() {
    this.setState({
      counters: _(Object.keys(this.state.symbols).map((symbol) =>
        Object.assign(this.state.counters[symbol] || {}, {
          symbol: symbol,
          totalOrders: Object.values(this.state.orders || {}).filter((o) => o.symbol == symbol).length,
          myLongOrders: Object.values(this.state.orders || {}).filter((o) => o.symbol == symbol && o.owner == web3.eth.accounts[0] && o.long).length,
          myShortOrders: Object.values(this.state.orders || {}).filter((o) => o.symbol == symbol && o.owner == web3.eth.accounts[0] && !o.long).length,
          longPositions: Object.values(this.state.positions || {}).filter((o) => o.symbol == symbol && o.own && o.long).length,
          shortPositions: Object.values(this.state.positions || {}).filter((o) => o.symbol == symbol && o.own && !o.long).length
        })
      )).indexBy("symbol")
    })
  }

  loadInitialOrders() {
    console.log("loadInitialOrders")
    OrdersDAO.loadOrders().then((orders) => {
      this.setState({
        orders: orders
      })
      CfdMarket.UpdateOrder({from: web3.eth.accounts}, 'latest').then(this.handleBlockchainOrderEvent.bind(this))
      this.computeCounters()
    })
    PositionsDAO.loadPositions().then((positions) => {
      // Filter positions
      this.setState({
        positions: positions
      })
      CfdMarket.UpdatePosition({from: web3.eth.accounts}, 'latest').then(this.handleBlockchainPositionEvent.bind(this))
      this.computeCounters()
    })
  }

  loadBlockchainData() {
    // noop, as we use blockchain events now
  }

  changeSymbol(e, symbol) {
    console.log("changeSymbol")
    e.preventDefault()
    this.setState({
      activeSymbol: symbol
    }, this.loadSymbolOracles)
  }

  render() {
    console.log("render main")
    return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <PositionsOverview
            loadBlockchainData={this.loadBlockchainData}
            oracles={this.state.oracles}
            activeSymbol={this.state.activeSymbol}
            positions={this.state.positions && _(this.state.positions).filter((pos) => pos.own)} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-2">
          <SelectSymbol
            counters={this.state.counters}
            changeSymbol={this.changeSymbol}
            activeSymbol={this.state.activeSymbol}
            symbols={this.props.symbols} />
        </div>
        <div className="col-md-7">
          <div className="panel panel-default">
            <div className="panel-heading">Open Orders for <strong>{this.state.symbols[this.state.activeSymbol].symbol}</strong></div>
            <div className="panel-body">
              <div className="row">
                <div className="col-md-12">
                  {
                    this.state.orders === undefined
                      ? <Loading />
                      : <OrderBook
                          oracle={this.state.oracles[this.state.activeSymbol] || {}}
                          orders={Object.values(this.state.orders).filter((order) => order.symbol === this.state.activeSymbol)}
                          onTrade={this.loadBlockchainData} />
                  }
                  <TradingView symbol={this.state.symbols[this.state.activeSymbol].tv} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="row">
            <div className="col-md-12">
              <CreateOrder
                oracle={this.state.oracles[this.state.activeSymbol] || {oracle: "...", price: "..."}}
                symbol={this.state.symbols[this.state.activeSymbol]}
                onTrade={this.loadBlockchainData} />
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}
