class OrderBook extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}
  }


  render() {
    return (
      <div>
        {this.props.orders.length === 0
          ? <p className="text-primary">There are no orders yet</p>
          : <table className="table table-hover">
              <thead>
                <tr>
                  <th>Type <Tooltip title="The maker's direction of the proposed position." /></th>
                  <th>Collateral ETH </th>
                  <th>Leverage</th>
                  <th>Strike Price</th>
                  <th>Expires</th>
                  <th> <Tooltip title="Desired collateral for partial trades. Partial trade is only possible if the residual value is more than the minimum collateral " /></th>
                  <th></th>
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
