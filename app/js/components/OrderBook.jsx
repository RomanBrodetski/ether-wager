class OrderBook extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}
  }


  render() {
    return (
      <div>
        {this.props.orders.length === 0
          ? <p className="text-primary">There are no orders yet.</p>
          : <table className="table table-hover">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Collateral ETH</th>
                  <th>Strike Price</th>
                  <th>Expires</th>
                  <th>*Input*</th>
                  <th>*Action*</th>
                </tr>
              </thead>
              <tbody>
                {this.props.orders.map((order) => (
                  <OrderRow order={order} onTrade={this.props.onTrade} key={order.id} oracle={this.props.oracle}/>
                ))}
              </tbody>
            </table>
        }
      </div>
    );
  }
}
