class OrderRow extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }
    this.cancel = this.cancel.bind(this)
    this.trade = this.trade.bind(this)
    this.actions = this.actions.bind(this)
  }


  trade(e) {
    e.preventDefault()
    OrdersDAO
      .trade(this.props.order)
      .then(this.props.onTrade)
    this.setState({
      loading: true
    })
  }

  cancel(e, id) {
    e.preventDefault()
    OrdersDAO
      .cancel(this.props.order.id)
      .then(this.props.onTrade)
    this.setState({
      loading: true
    })
  }

  actions() {
    if (this.state.loading) {
      return "loading"
    } else {
      return (
        <div>
           <a href="#" onClick={this.trade}>
              <span className="glyphicon glyphicon-send"></span>
          </a>
          <div>
            {(this.props.order.owner == web3.eth.defaultAccount) &&
            (<a href="#" onClick={this.cancel}>
              <span className="glyphicon glyphicon-remove"></span>
             </a>)}
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <tr>
        <td><span  className={"label label-" + (this.props.order.long ? "success" : "danger")}> {this.props.order.long ? "LONG" : "SHORT"}</span></td>
        <td>{this.props.order.collateral / Math.pow(10, 18)}</td>
        <td>{this.props.order.limit}</td>
        <td>{this.props.order.timestampLimit}</td>
        <td>{this.actions()}</td>
      </tr>
    );
  }
}
