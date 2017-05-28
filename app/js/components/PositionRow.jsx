class PositionRow extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }

    this.PNLPerc = this.PNLPerc.bind(this)
    this.execute = this.execute.bind(this)
    this.claim = this.claim.bind(this)
    this.oraclePrice = this.oraclePrice.bind(this)
    this.expiresColumn = this.expiresColumn.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.position.state() != this.props.position.state()) {
      this.setState({
        loading: false
      })
    }
  }

  PNLPerc() {
    return `${MathUtils.round(this.props.position.PNL(this.oraclePrice()) / this.props.position.collateralETH * 100, 2)}%`
  }

  oraclePrice() {
    return this.props.oracle && this.props.oracle.price || "..."
  }

  execute(e) {
    e.preventDefault()
    PositionsDAO
      .execute(this.props.position)
      .then(this.props.onTrade)

    this.setState({
      loading: true
    })
  }

  claim(e) {
    e.preventDefault()
    PositionsDAO
      .claim(this.props.position)
      .then(this.props.onTrade)

    this.setState({
      loading: true
    })
  }

  expiresColumn() {
    if (this.state.loading) {
      return (
        <span className="loader">loading</span>
      )
    } else if (this.props.position.canExecute()) {
      return (
        <a className="btn btn-warning btn-sm" href="#" onClick={(e) => this.execute(e)}>expire</a>
      )
    } else if (this.props.position.canClaim()) {
      return (
        <a className="btn btn-success btn-sm" href="#" onClick={(e) => this.claim(e)}>claim</a>
      )
    } else {
      return this.props.position.expiration
    }
  }

  render() {
    // className={this.props.position.state() === "closed" ? "" : (this.props.position.PNL(this.oraclePrice()) > 0 ? "success" : "danger")}
    return (
      <tr>
        <td>{this.props.position.state()}</td>
        <td><span className={"label label-" + (this.props.position.long ? "success" : "danger")}>{this.props.position.long ? "LONG" : "SHORT"}</span></td>
        <td>{this.props.position.symbol}</td>
        <td>{this.props.position.price}</td>
        <td>
          {this.props.position.executed ? (
            <div>
              {this.props.position.expirationPrice}
              <span title="Oracle price at execution time" className="glyphicon glyphicon-lock" style={{paddingLeft: '5px', color: '#aaa', fontSize: '11px'}}></span>
            </div>
          ) : (
            this.oraclePrice(this.props.position)
          )}
        </td>
        <td>{this.props.position.collateralETH}</td>
        <td><span className={this.props.position.PNL(this.oraclePrice()) > 0 ? "text-success" : "text-danger"}>
          {MathUtils.round(this.props.position.PNL(this.oraclePrice()), 4)} ({this.PNLPerc()})
          {this.props.position.executed && <span className="glyphicon glyphicon-lock" style={{paddingLeft: '5px', color: '#aaa', fontSize: '11px'}}></span>}
        </span></td>
        <td>
            {this.props.position.oracleRequested ? this.props.position.oracleComissionETH : "?"}
        </td>
        <td>
            {this.expiresColumn()}
        </td>
      </tr>
    );
  }
}
