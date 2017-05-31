class SelectSymbol extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: _(_(Object.values(this.props.symbols)).groupBy('group')).mapObject(() => {
        return true;
      })
    }
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

  toggle(e, group) {
    e.preventDefault
    // opened: {
      // crypto/btc: true
      // crypto/usd: true
      // stocks: true
    // }
    this.setState({
      opened: Object.assign(this.state.opened, { [group]: !this.state.opened[group]})
    })
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
          <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
            { _(_(Object.values(this.props.symbols)).groupBy('group')).map((group) => (
              <div key={group[0].group}>
                <div className="panel-heading" style={{borderBottom:'1px solid #dddddd',cursor:'pointer'}} onClick={(e) => this.toggle(e, group[0].group)}>
                  <h4 className="panel-title">
                    {group[0].group}
                  </h4>
                </div>
                <div className={this.state.opened[group[0].group] ? "panel-collapse collapse in" : "panel-collapse collapse"}>
                  <ul className="nav nav-pills nav-stacked">
                    {Object.values(group).map((symbolObj) => (
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
            ))}
          </div>
        </div>
      </div>
    )
  }


}
