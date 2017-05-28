class Positions extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}
  }


  render() {
    return (
      <div>
        {this.props.positions.length === 0
          ? <p className="text-primary" style={{marginTop: '1em'}}>You don't have this positions yet</p>
          : <table className="table table-hover mb0">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Type</th>
                  <th>Symbol</th>
                  <th>Strike Price</th>
                  <th>Price</th>
                  <th>Collateral</th>
                  <th>PNL</th>
                  <th>Oracle Comission</th>
                  <th>Expiration</th>
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
