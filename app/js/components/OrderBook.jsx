class OrderBook extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}
  }


  render() {
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Type</th>
            <th>Col. ETH</th>
            <th>Str. Price</th>
            <th>Expires</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.props.orders.map((order) => (
            <OrderRow order={order} onTrade={this.props.onTrade} key={order.id}/>
          ))}
        </tbody>
      </table>
    );
  }
}
