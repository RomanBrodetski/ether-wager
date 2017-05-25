class OrderBook extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}
    this.cancel = this.cancel.bind(this)
    this.trade = this.trade.bind(this)
  }

  trade(e, order) {
    e.preventDefault()
    OrdersDAO
      .trade(order)
      .then(this.props.onTrade)
  }

  cancel(e, id) {
    e.preventDefault()
    OrdersDAO
      .cancel(id)
      .then(this.props.onTrade)
  }

  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Symbol</th>
            <th>Vol. ETH</th>
            <th><i>Limit</i></th>
            <th>Good until</th>
          </tr>
        </thead>
        <tbody>
          {this.props.orders.map((order) => (
            <tr key={order.id} className={order.long ? "success" : "danger"}>
              <td>{order.long ? "LONG" : "SHORT"}</td>
              <td>{order.symbol}</td>
              <td>{order.collateral / Math.pow(10, 18)}</td>
              <td>{order.limit}</td>
              <td>{order.timestampLimit}</td>
              <td>
                <a href="#" onClick={(e) => this.trade(e, order)}>
                  <span className="glyphicon glyphicon-send"></span>
                </a>
              </td>
              <td>
                {order.owner == web3.eth.defaultAccount &&
                  (<a href="#" onClick={(e) => this.cancel(e, order.id)}>
                    <span className="glyphicon glyphicon-remove"></span>
                   </a>)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
