class Positions extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}
  }


  render() {
    return (
      <div>
        {this.props.positions.length === 0
          ? <p className="text-primary" style={{marginTop: '1em'}}>There are no positions here yet</p>
          : <table className="table table-hover mb0">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Type </th>
                  <th>Symbol</th>
                  <th>Leverage</th>
                  <th>Strike Price <Tooltip title="The price that will be used to compute the P&N at the Exercise time" /></th>
                  <th>Price <Tooltip title="Current or Exercise oracle price" /></th>
                  <th>Collateral</th>
                  <th>PNL <Tooltip title="Current or Exercise profit or loss. Please note that only already payed oracle comission is taken into account." /></th>
                  <th>Oracle Comission <Tooltip title="Total oracle comission payed for this position. There may be one or two oracle calls, depending on the type of order." /></th>
                  <th>Expiration </th>
                </tr>
              </thead>
              <tbody>
                {this.props.positions.map((position) => (
                  <PositionRow onTrade={this.props.onTrade} key={position.id} position={position} oracle={this.props.oracles[position.symbol]}/>
                ))}
              </tbody>
            </table>
          }
        </div>
      );
  }
}
