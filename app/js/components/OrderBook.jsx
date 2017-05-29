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
                  <th>Type <Tooltip title="Tooltip text" /></th>
                  <th>Collateral ETH <Tooltip title="Tooltip text" /></th>
                  <th>Strike Price <Tooltip title="Tooltip text" /></th>
                  <th>Expires <Tooltip title="Tooltip text" /></th>
                  <th></th>
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
