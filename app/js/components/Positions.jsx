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
                  <th>State <Tooltip title="Tooltip text" /></th>
                  <th>Type <Tooltip title="Tooltip text" /></th>
                  <th>Symbol <Tooltip title="Tooltip text" /></th>
                  <th>Strike Price <Tooltip title="Tooltip text" /></th>
                  <th>Price <Tooltip title="Tooltip text" /></th>
                  <th>Collateral <Tooltip title="Tooltip text" /></th>
                  <th>PNL <Tooltip title="Tooltip text" /></th>
                  <th>Oracle Comission <Tooltip title="Tooltip text" /></th>
                  <th>Expiration <Tooltip title="Tooltip text" /></th>
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
