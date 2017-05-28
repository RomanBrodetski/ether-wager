class OrderRow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      status: "none",
      positionAmount: this.props.order.collateral / Math.pow(10, 18)
    };

    this.cancel = this.cancel.bind(this);
    this.trade = this.trade.bind(this);
    this.actions = this.actions.bind(this);
    this.setAmount = this.setAmount.bind(this);
  }


  trade(e) {
    e.preventDefault()

    this.setState({
      loading: true
    });

    // shoukd this be also added to success variant 'this.props.onTrade'
    OrdersDAO
      .trade(this.props.order)
      .then(
        () => this.setState({
          loading: false,
          status: "success"
        }),
        () => this.setState({
          loading: false,
          status: "fail"
        })
      );
  }

  cancel(e, id) {
    e.preventDefault()
    
    OrdersDAO
      .cancel(this.props.order.id)
      .then(
        () => this.setState({
          loading: false,
          status: "success"
        }),
        () => this.setState({
          loading: false,
          status: "fail"
        })
      );
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
      return (<span>loading <i className="fa fa-spinner fa-spin" aria-hidden="true"></i></span>)
    } else {
      if (this.state.status === "fail") {
        return (
          <span><i className="glyphicon glyphicon-remove text-danger"></i> fail</span>
        )
      } else if (this.state.status === "success") {
        return (
          <span><i className="glyphicon glyphicon-ok text-success"></i> success</span>
        )
      } else {
        return (
          <div>
            <a href="#" onClick={this.trade} className="btn btn-default btn-sm">trade</a>
            {/* {this.props.order.owner == web3.eth.defaultAccount && <a href="#" onClick={this.cancel} className="btn btn-danger btn-sm">delete order</a>} */}
          </div>
        )
      }
    }
  }

  render() {
    let date = new Date(this.props.order.timestampLimit * 1000);
    let options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };

    return (
      <tr>
        <td><span  className={"label label-" + (this.props.order.long ? "success" : "warning")}> {this.props.order.long ? "LONG" : "SHORT"}</span></td>
        <td>{this.props.order.collateral / Math.pow(10, 18)}</td>
        <td>{this.props.order.spot ? (
            this.props.oracle.price.toString() + (this.props.order.premiumBp > 0 ? " + " : " - ") + Math.abs(this.props.order.premiumBp) + "% = " + MathUtils.round(this.props.oracle.price * (1 + this.props.order.premiumBp / 100), 2).toString()
          ) : (
            <div>
              {this.props.order.limit}
              <span className="glyphicon glyphicon-lock" style={{paddingLeft: '5px', color: '#aaa', fontSize: '11px'}}></span>
            </div>
          )}</td>
        <td>{date.toLocaleDateString('de-DE', options)}</td>
        <td>
          <input onChange={this.setAmount} onBlur={this.setAmount} className="form-control input-sm" type="number" placeholder="type your amount" style={{fontSize: '13px'}} value={this.state.positionAmount} min="0.01" max={this.props.order.collateral / Math.pow(10, 18)} step="0.01"/>
        </td>
        <td>{this.actions()}</td>
      </tr>
    );
  }
}
