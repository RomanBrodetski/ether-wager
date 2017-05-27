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
    this.loadBlockchainData()
    this.loadSymbolOracles()

    this.choosePositions = this.choosePositions.bind(this);
    this.toggle = this.toggle.bind(this);
    this.switchTabs = this.switchTabs.bind(this);

    CfdMarket.OracleRespond({from: web3.eth.accounts}, 'latest').then(this.handleBlockchainTradeEvent.bind(this))
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
    return (
       <div>
          <nav className="navbar navbar-default mb0">
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
              <a role="button" className="col-md-12" onClick={this.toggle} href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                My positions overview
                {
                  this.state.ui.myPositionsOpen
                  ? <span className="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
                  : <span className="glyphicon glyphicon-chevron-up" aria-hidden="true"></span>
                }
              </a>
            </div>
            <div className="row">
              <div className={this.state.ui.myPositionsOpen ? "collapse.in" : "collapse"}>
                <div className="well">
                  <ul className="nav nav-tabs" role="tablist">
                    <li role="presentation" className={this.state.ui.currentTab === "allPositions" ? "active" : ""}><a href="#" name="allPositions" onClick={this.switchTabs}>All my positions</a></li>
                    <li role="presentation" className={this.state.ui.currentTab === "isActive" ? "active" : ""}><a href="#" name="isActive" onClick={this.switchTabs}>Active positions</a></li>
                    <li role="presentation" className={this.state.ui.currentTab === "needsAttention" ? "active" : ""}><a href="#" name="needsAttention" onClick={this.switchTabs}>Pending / Claim / Waiting for oracle</a></li>
                    <li role="presentation" className={this.state.ui.currentTab === "isClosed" ? "active" : ""}><a href="#" name="isClosed" onClick={this.switchTabs}>Closed</a></li>
                  </ul>

                  <div>
                    {this.state.positions === undefined
                      ? <div className="tab-content"><h1>Loading...</h1></div>
                      : <div className="tab-content">
                          <div role="tabpanel" className="tab-pane active">
                            <Positions
                              onTrade={this.loadBlockchainData}
                              oracles={this.state.oracles}
                              symbol={this.state.activeSymbol}
                              positions={this.choosePositions(this.state.positions)} />
                          </div>
                        </div>
                    }
                  </div>
                </div>
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
                <h4>Open Orders</h4>
                <div className="row">
                  <div className="col-md-12">
                    {
                      this.state.orders === undefined
                        ? <h1>Loading...</h1>
                        : <OrderBook
                            orders={this.state.orders.filter((order) => order.symbol === this.state.activeSymbol)}
                            onTrade={this.loadBlockchainData} />
                    }
                    <div>
                      <TradingView symbol={this.state.symbols[this.state.activeSymbol].tv} />
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
