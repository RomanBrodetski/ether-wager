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
      return this.props.counters[sym].myShortOrders

  }

  long(sym) {
    if (this.props.counters[sym])
      return this.props.counters[sym].myLongOrders
  }

  spanIfPresent(value, symbolClass, title) {
    if (value && isFinite(value) && value > 0) {
      return(
        <span className={symbolClass} title={title}>
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
            <a href="" onClick={(e) => this.props.changeSymbol(e, symbolObj.symbol)}>
              {symbolObj.symbol}
              {this.spanIfPresent(this.totalOrders(symbolObj.symbol), "badge badgeGrey", "total orders")}
              {this.spanIfPresent(this.long(symbolObj.symbol), "badge badgeGreen", "my long orders and positions")}
              {this.spanIfPresent(this.short(symbolObj.symbol), "badge badgeOrange", "my short orders and positions")}
            </a>
          </li>
        ))}
      </ul>
    )
  }


}
