class Positions extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}
  }


  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>State</th>
            <th>Type</th>
            <th>Symbol</th>
            <th>Str. Price</th>
            <th>Price</th>
            <th>Collateral</th>
            <th>PNL</th>
            <th>Oracle Comission</th>
            <th>Expiration</th>
          </tr>
        </thead>
        <tbody>
          {_(this.props.positions).sortBy((p) => p.state()).map((position) => (
            <PositionRow onTrade={this.props.onTrade} key={position.id} position={position} oracle={this.props.oracles[position.symbol]}/>
          ))}
        </tbody>
      </table>
    );
  }
}
