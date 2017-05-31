class OrderRow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      status: "none",
      positionAmount: this.props.order.collateral / Math.pow(10, 18)
    };

    this.cancel = this.cancel.bind(this);
    this.trade = this.trade.bind(this);
    this.actions = this.actions.bind(this);
    this.setAmount = this.setAmount.bind(this);
    this.price = this.price.bind(this);
    this.input = this.input.bind(this);
  }


  trade(e) {
    e.preventDefault()

    this.setState({
      status: "loading"
    });

    OrdersDAO
      .trade(this.props.order, new web3.BigNumber(this.state.positionAmount).times(Math.pow(10, 18)))
      .then(
        () => this.setState({
          status: "oracle"
        })
      );
  }

  cancel(e, id) {
    e.preventDefault()

    this.setState({
      status: "loading"
    });

    OrdersDAO.cancel(this.props.order.id);
  }

  setAmount(event) {
    const minCollateral = 0.05
    let col = this.props.order.collateralETH;
    let positionAmount = col < minCollateral * 2 ? col :
                        (event.target.value >= col ? col :
                        (event.target.value >= col - minCollateral ? col - minCollateral :
                        (event.target.value <= minCollateral ? minCollateral : event.target.value)
                        ));


    this.setState({
      positionAmount: MathUtils.round(positionAmount, 4)
    })
  }

  input() {
    if (this.state.status == "none" && !this.props.order.own) {
      return (
        <input onChange={this.setAmount} onBlur={this.setAmount} className="form-control input-sm" type="number" placeholder="type your amount" style={{fontSize: '13px'}} value={this.state.positionAmount} min="0.01" max={this.props.order.collateral / Math.pow(10, 18)} step="0.01"/>
      )
    }
  }

  actions() {
    if (this.state.status == "loading") {
      return (
        <span>processing <i className="fa fa-spinner fa-spin" aria-hidden="true"></i></span>
      )
    } else if (this.state.status === "oracle") {
      return (
        <span>waiting for oracle <i className="fa fa-spinner fa-spin"></i></span>
      )
    } else {
      if (this.props.order.own) {
        return (
          <a href="#" onClick={this.cancel} className="btn btn-danger btn-sm">cancel order</a>
        )
      } else {
        return (
          <a href="#" onClick={this.trade} className="btn btn-default btn-sm">trade</a>
        )
      }
    }
  }

  price() {
    if (this.props.order.spot) {
      if (this.props.oracle.price) {
        const sign = this.props.order.premiumBp > 100 ? "+" : "-"
        const result = MathUtils.round(this.props.oracle.price * this.props.order.premiumBp / 100, 4)
        return `${this.props.oracle.price} ${sign} ${Math.abs(this.props.order.premiumBp - 100)}% = ${result}`
      } else {
        return (<i className="fa fa-spinner fa-spin" aria-hidden="true"></i>)
      }
    } else {
      return (
        <div>
          {this.props.order.limit}
          <span className="glyphicon glyphicon-lock" style={{paddingLeft: '5px', color: '#aaa', fontSize: '11px'}}></span>
        </div>
      )
    }
  }

  render() {
    console.log("render order row")
    let date = new Date(this.props.order.timestampLimit * 1000);
    let options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };

    return (
      <tr>
        <td><span  className={"label label-" + (this.props.order.long ? "success" : "warning")}> {this.props.order.long ? "LONG" : "SHORT"}</span></td>
        <td>{this.props.order.collateral / Math.pow(10, 18)}</td>
        <td>{this.props.order.leverage}x</td>
        <td>{this.price()}</td>
        <td>{date.toLocaleDateString('de-DE', options)}</td>
        <td>{this.input()}</td>
        <td>{this.actions()}</td>
      </tr>
    );
  }
}
