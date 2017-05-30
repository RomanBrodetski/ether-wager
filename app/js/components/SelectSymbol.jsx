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
        <Tooltip title={title}>
          <span className={symbolClass} style={{margin:'2px'}}>
            {value}
          </span>
        </Tooltip>
      )
    }
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          Underlying Asset
        </div>
        <div className="panel-body">
          <ul className="nav nav-pills nav-stacked">
            {Object.values(this.props.symbols).map((symbolObj) => (
              <li key={symbolObj.symbol} className={this.props.activeSymbol === symbolObj.symbol ? "active" : ""}>
                <a href="" onClick={(e) => this.props.changeSymbol(e, symbolObj.symbol)}>
                  {symbolObj.caption}
                  <span className='clearfix' style={{position:'relative',bottom:'2px',float:'right'}}>
                    {this.spanIfPresent(this.totalOrders(symbolObj.symbol), "label label-default", "total orders")}
                    {this.spanIfPresent(this.long(symbolObj.symbol), "label label-success", "my long orders")}
                    {this.spanIfPresent(this.short(symbolObj.symbol), "label label-warning", "my short orders")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }


}
