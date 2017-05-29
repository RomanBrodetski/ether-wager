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

    // should this be also added to success variant 'this.props.onTrade'
    OrdersDAO
      .trade(this.props.order, new web3.BigNumber(this.state.positionAmount).times(Math.pow(10, 18)))
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

    this.setState({
      loading: true
    });

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
    const minCollateral = 0.05
    let col = this.props.order.collateralETH;
    let positionAmount = event.target.value >= col ? col :
                        (event.target.value >= col - minCollateral ? col - minCollateral :
                        (event.target.value <= minCollateral ? minCollateral : event.target.value)
                        );


    this.setState({
      positionAmount: MathUtils.round(positionAmount,4)
    })
  }

  actions() {
    if (this.state.loading) {
      return (
        <span>loading <i className="fa fa-spinner fa-spin" aria-hidden="true"></i></span>
      )
    } else {
      if (this.state.status === "fail") {
        return (
          <span><i className="glyphicon glyphicon-remove text-danger"></i> fail</span>
        )
      } else if (this.state.status === "success") {
        return (
          <span><i className="glyphicon glyphicon-ok text-success"></i> waiting for oracle</span>
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
        <td>{this.props.order.leverage}x</td>
        <td>{this.props.order.spot ? (
            this.props.oracle.price.toString() + (this.props.order.premiumBp > 100 ? " + " : " - ") + Math.abs(this.props.order.premiumBp - 100) + "% = " + MathUtils.round(this.props.oracle.price * this.props.order.premiumBp / 100, 2).toString()
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
