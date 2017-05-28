class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeSymbol: this.props.symbols[0].symbol,
      symbols: _(this.props.symbols).indexBy("symbol"),
      oracles: {},
      counters: {},
      ui: {
        myPositionsOpen: true,
        currentTab: "allPositions",
      }
    }
    this.loadBlockchainData = this.loadBlockchainData.bind(this)
    this.loadSymbolOracles = this.loadSymbolOracles.bind(this)
    this.changeSymbol = this.changeSymbol.bind(this)
    this.loadInitialOrders()
    this.loadSymbolOracles()

    this.choosePositions = this.choosePositions.bind(this);
    this.computeCounters = this.computeCounters.bind(this);
    this.toggle = this.toggle.bind(this);
    this.switchTabs = this.switchTabs.bind(this);
  }

  switchTabs(event) {
    this.setState({
      ui: Object.assign(this.state.ui, { currentTab: event.target.name })
    })
  }

  toggle(event) {
    this.setState({
      ui: Object.assign(this.state.ui, { myPositionsOpen: !this.state.ui.myPositionsOpen })
    })
  }

  handleBlockchainOrderEvent(event) {
    OrdersDAO.loadOrder(event.args.id.toNumber()).then((order) => {
      this.setState({
        orders: Object.assign(this.state.orders, {[order.id]: order})
      })
      this.computeCounters();
    })
  }

  handleBlockchainPositionEvent(event) {
    PositionsDAO.loadPosition(event.args.id.toNumber()).then((position) => {
      this.setState({
        positions: Object.assign(this.state.positions, {[position.id]: position})
      })
      this.computeCounters();
    })
  }

  loadSymbolOracles() {
    Object.values(this.state.symbols).forEach((symbolObj) => {
      Oracles.getOracleInfo(symbolObj.symbol, symbolObj.oracle).then((info) => {
        this.setState({
          oracles: Object.assign(this.state.oracles, {[symbolObj.symbol]: info})
        })
        CfdMarket.UpdatePosition({from: web3.eth.accounts}, 'latest').then(this.handleBlockchainPositionEvent.bind(this))
        CfdMarket.UpdateOrder({from: web3.eth.accounts}, 'latest').then(this.handleBlockchainOrderEvent.bind(this))
      })
    })
  }

  computeCounters() {
    this.setState({
      counters: _(Object.keys(this.state.symbols).map((symbol) =>
        Object.assign(this.state.counters[symbol] || {}, {
          symbol: symbol,
          totalOrders: Object.values(this.state.orders || {}).filter((o) => o.symbol == symbol).length,
          myLongOrders: Object.values(this.state.orders || {}).filter((o) => o.symbol == symbol && o.owner == web3.eth.defaultAccount && o.long).length,
          myShortOrders: Object.values(this.state.orders || {}).filter((o) => o.symbol == symbol && o.owner == web3.eth.defaultAccount && !o.long).length,
          longPositions: Object.values(this.state.positions || {}).filter((o) => o.symbol == symbol && o.own && o.long).length,
          shortPositions: Object.values(this.state.positions || {}).filter((o) => o.symbol == symbol && o.own && !o.long).length
        })
      )).indexBy("symbol")
    })
  }

  loadInitialOrders() {
    OrdersDAO.loadOrders().then((orders) => {
      this.setState({
        orders: orders
      })
      this.computeCounters()
    })
    PositionsDAO.loadPositions().then((positions) => {
      // Filter positions
      this.setState({
        positions: positions
      })
      this.computeCounters()
    })
  }

  loadBlockchainData() {
    // noop, as we use blockchain events now
  }

  changeSymbol(e, symbol) {
    e.preventDefault()
    this.setState({
      activeSymbol: symbol
    })
  }

  choosePositions(positions, type) {
    if (this.state.ui.currentTab === "allPositions") {
      return positions;
    } else if (this.state.ui.currentTab === "isActive") {
      return positions.filter((el) => ( el.state() === "active" ));
    } else if (this.state.ui.currentTab === "needsAttention") {
      return positions.filter((el) => ( el.state() === "pending" || el.state() === "waiting for oracle" || el.state() === "claim" ));
    } else if (this.state.ui.currentTab === "isClosed") {
      return positions.filter((el) => ( el.state() === "closed" ));
    }
  }

  render() {
    const loading = (
      <div className="tab-content"><h5 className="text-center"><i className="fa fa-spinner fa-spin" aria-hidden="true"></i> Loading</h5></div>
    );

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
            <div className="row">
              <div className="col-md-12">
                <div className="panel panel-default">
                  <div className="panel-heading" onClick={this.toggle}>
                    <span>
                      My positions overview
                      {
                        this.state.ui.myPositionsOpen
                        ? <span className="glyphicon glyphicon-menu-down" aria-hidden="true" style={{paddingLeft: '5px', fontSize: '11px'}}></span>
                        : <span className="glyphicon glyphicon-menu-up" aria-hidden="true" style={{paddingLeft: '5px', fontSize: '11px'}}></span>
                      }
                    </span>
                  </div>

                  <div className={this.state.ui.myPositionsOpen ? "panel-body" : "hidden panel-body"}>
                    <ul className="nav nav-tabs" role="tablist">
                      <li role="presentation" className={this.state.ui.currentTab === "allPositions" ? "active" : ""}><a href="#" name="allPositions" onClick={this.switchTabs}>All my positions</a></li>
                      <li role="presentation" className={this.state.ui.currentTab === "isActive" ? "active" : ""}><a href="#" name="isActive" onClick={this.switchTabs}>Active positions</a></li>
                      <li role="presentation" className={this.state.ui.currentTab === "needsAttention" ? "active" : ""}><a href="#" name="needsAttention" onClick={this.switchTabs}>Waiting for action</a></li>
                      <li role="presentation" className={this.state.ui.currentTab === "isClosed" ? "active" : ""}><a href="#" name="isClosed" onClick={this.switchTabs}>Closed</a></li>
                    </ul>

                    <div>
                      {this.state.positions === undefined
                        ? loading
                        : <div className="tab-content">
                            <div role="tabpanel" className={this.state.ui.currentTab === "allPositions" ? "tab-pane active" : "tab-pane"}>
                              {Object.values(this.state.positions).length === 0
                                ? <p className="text-primary" style={{marginTop: '1em'}}>You don't have any positions yet</p>
                                : <Positions
                                  onTrade={this.loadBlockchainData}
                                  oracles={this.state.oracles}
                                  symbol={this.state.activeSymbol}
                                  positions={Object.values(this.state.positions)} />
                               }
                            </div>
                            <div role="tabpanel" className={this.state.ui.currentTab === "isActive" ? "tab-pane active" : "tab-pane"}>
                              {Object.values(this.state.positions).filter((el) => ( el.state() === "active" )).length === 0
                                ? <p className="text-primary" style={{marginTop: '1em'}}>You don't have any active positions yet</p>
                                : <Positions
                                    onTrade={this.loadBlockchainData}
                                    oracles={this.state.oracles}
                                    symbol={this.state.activeSymbol}
                                    positions={Object.values(this.state.positions).filter((el) => ( el.state() === "active" ))} />
                                }
                            </div>
                            <div role="tabpanel" className={this.state.ui.currentTab === "needsAttention" ? "tab-pane active" : "tab-pane"}>
                              {Object.values(this.state.positions).filter((el) => ( el.state() === "pending" || el.state() === "waiting for oracle" || el.state() === "claim" )).length === 0
                                ? <p className="text-primary" style={{marginTop: '1em'}}>You don't have waiting for action positions yet</p>
                                : <Positions
                                    onTrade={this.loadBlockchainData}
                                    oracles={this.state.oracles}
                                    symbol={this.state.activeSymbol}
                                    positions={Object.values(this.state.positions).filter((el) => ( el.state() === "pending" || el.state() === "waiting for oracle" || el.state() === "claim" ))} />
                                }
                            </div>
                            <div role="tabpanel" className={this.state.ui.currentTab === "isClosed" ? "tab-pane active" : "tab-pane"}>
                              {Object.values(this.state.positions).filter((el) => ( el.state() === "closed" )).length === 0
                                ? <p className="text-primary" style={{marginTop: '1em'}}>You don't have any closed positions yet</p>
                                : <Positions
                                    onTrade={this.loadBlockchainData}
                                    oracles={this.state.oracles}
                                    symbol={this.state.activeSymbol}
                                    positions={Object.values(this.state.positions).filter((el) => ( el.state() === "closed" ))} />
                                }
                            </div>
                          </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-2">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    List of Symbols
                  </div>
                  <div className="panel-body">
                    <SelectSymbol
                      counters={this.state.counters}
                      changeSymbol={this.changeSymbol}
                      activeSymbol={this.state.activeSymbol}
                      symbols={this.props.symbols} />
                  </div>
                </div>
              </div>

              <div className="col-md-7">
                <div className="panel panel-default">
                  <div className="panel-heading">Open Orders for <strong>{this.state.symbols[this.state.activeSymbol].symbol}</strong></div>
                  <div className="panel-body">
                    <div className="row">
                      <div className="col-md-12">
                        {
                          this.state.orders === undefined
                            ? loading
                            : <OrderBook
                                orders={Object.values(this.state.orders).filter((order) => order.symbol === this.state.activeSymbol)}
                                onTrade={this.loadBlockchainData} />
                        }
                        <div>
                          <TradingView symbol={this.state.symbols[this.state.activeSymbol].tv} />
                        </div>
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
        </div>
    )
  }


}
