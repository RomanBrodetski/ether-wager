class OrderRow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      positionAmount: this.props.order.collateral / Math.pow(10, 18)
    };

    this.cancel = this.cancel.bind(this);
    this.trade = this.trade.bind(this);
    this.actions = this.actions.bind(this);
    this.setAmount = this.setAmount.bind(this);
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

  // TODO: use positionAmount for creating a position
  setAmount(event) {
    let maxAmount = this.props.order.collateral / Math.pow(10, 18);
    let positionAmount = (event.target.value <= maxAmount && event.target.value > 0) ? event.target.value : maxAmount;


    this.setState({
      positionAmount: positionAmount
    })
  }

  actions() {
    if (this.state.loading) {
      return "loading"
    } else {
      return (
        <div>
          <a href="#" onClick={this.trade} className="btn btn-default btn-sm">create position</a>
          {/* {this.props.order.owner == web3.eth.defaultAccount && <a href="#" onClick={this.cancel} className="btn btn-danger btn-sm">delete position</a>} */}
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
        <td>
          <input onChange={this.setAmount} onBlur={this.setAmount} className="form-control input-sm" type="number" placeholder="type your amount" style={{fontSize: '13px'}} value={this.state.positionAmount} min="0.01" max={this.props.order.collateral / Math.pow(10, 18)} step="0.01"/>
        </td>
        <td>{this.actions()}</td>
      </tr>
    );
  }
}
