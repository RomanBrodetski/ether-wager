class OrderBook extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Vol. ETH</th>
            <th>Fee</th>
          </tr>
        </thead>
        <tbody>
          {this.props.orders.map((order) => (
            <tr>
              <td>{order.symbol}</td>
              <td>{order.collateral}</td>
              <td>{order.takerFee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
