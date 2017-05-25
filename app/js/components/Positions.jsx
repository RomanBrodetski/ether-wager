class Positions extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}
    this.currentEquity = this.currentEquity.bind(this)
    this.PNL = this.PNL.bind(this)
    this.PNLPerc = this.PNLPerc.bind(this)
    this.execute = this.execute.bind(this)
  }

  currentEquity(position) {
    const p = position.computationBasePrice(this.props.prices[position.symbol])
    if (isFinite(p)) {
      var factor = p / position.price
      factor = Math.min(factor, 2)
      factor = Math.max(factor, 0)
      if (!position.long)
        factor = 1 / factor
      return MathUtils.round(factor * position.collateralETH, 5)
    }
  }

  PNL(position) {
    return MathUtils.round(this.currentEquity(position) - position.collateralETH, 3)
  }

  PNLPerc(position) {
    return `${MathUtils.round(this.PNL(position) / position.collateralETH * 100, 2)}%`
  }

  execute(e, position) {
    e.preventDefault()
    PositionsDAO
      .execute(position)
      .then(this.props.onTrade)
  }

  claim(e, position) {
    e.preventDefault()
    PositionsDAO
      .claim(position)
      .then(this.props.onTrade)
  }

  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Symbol</th>
            <th>Str. Price</th>
            <th>Price</th>
            <th>Collateral</th>
            <th>PNL</th>
            <th>Expiration</th>
          </tr>
        </thead>
        <tbody>
          {this.props.positions.map((position) => (
            <tr key={position.id} className={this.PNL(position) > 0 ? "success" : "danger"}>
              <td>{position.long ? "LONG" : "SHORT"}</td>
              <td>{position.symbol}</td>
              <td>{position.price}</td>
              <td>
                {position.executed ? (
                  <div>
                    <span title="Oracle price at execution time" className="glyphicon glyphicon-lock"></span>
                    {position.expirationPrice}
                  </div>
                ) : (
                  this.props.prices[position.symbol]
                )}
              </td>
              <td>{position.collateralETH}</td>
              <td>{this.PNL(position)} ({this.PNLPerc(position)}) </td>
              <td>{position.canExecute() ? (
                  <a className="btn btn-info" href="#" onClick={(e) => this.execute(e, position)}>expire</a>
                ) : (
                  position.canClaim() ? (
                      <a className="btn btn-info" href="#" onClick={(e) => this.claim(e, position)}>claim</a>
                    ) : (
                      position.expiration
                    )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
