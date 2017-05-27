class SelectSymbol extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.totalOrders = this.totalOrders.bind(this)
    this.short = this.short.bind(this)
    this.long = this.long.bind(this)
  }

  totalOrders(sym) {
    if (this.props.counters[sym])
      return this.props.counters[sym].totalOrders
  }

  short(sym) {
    if (this.props.counters[sym])
      return this.props.counters[sym].myShortOrders + this.props.counters[sym].shortPositions

  }

  long(sym) {
    if (this.props.counters[sym])
      return this.props.counters[sym].myLongOrders + this.props.counters[sym].longPositions
  }

  spanIfPresent(value, classs, title) {
    if (value && isFinite(value) && value > 0) {
      return(
        <span className={classs} title={title}>
          {value}
        </span>
      )
    }
  }

  render() {
    return (
      <ul className="nav nav-pills nav-stacked">
        {Object.values(this.props.symbols).map((symbolObj) => (
          <li key={symbolObj.symbol} className={this.props.activeSymbol == symbolObj.symbol ? "active" : ""}>
            <a href="#" onClick={(e) => this.props.changeSymbol(e, symbolObj.symbol)}>
              {symbolObj.symbol}
              {this.spanIfPresent(this.totalOrders(symbolObj.symbol), "badge", "total orders")}
              {this.spanIfPresent(this.long(symbolObj.symbol), "badge", "my long orders and positions")}
              {this.spanIfPresent(this.short(symbolObj.symbol), "badge", "my short orders and positions")}
            </a>
          </li>
        ))}
      </ul>
    )
  }


}
