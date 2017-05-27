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
          <a href="#" onClick={this.trade} className="btn btn-default btn-sm">create position</a>
          {this.props.order.owner == web3.eth.defaultAccount && <a href="#" onClick={this.cancel} className="btn btn-danger btn-sm">delete position</a>}
        </div>
      )
    }
  }

  render() {
    let date = new Date(this.props.order.timestampLimit * 1000);
    let options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };

    return (
      <tr>
        <td><span  className={"label label-" + (this.props.order.long ? "success" : "warning")}> {this.props.order.long ? "LONG" : "SHORT"}</span></td>
        <td>{this.props.order.collateral / Math.pow(10, 18)}</td>
        <td>{this.props.order.limit}</td>
        <td>{date.toLocaleDateString('de-DE', options)}</td>
        <td>{this.actions()}</td>
      </tr>
    );
  }
}
