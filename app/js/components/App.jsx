class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.loadBlockchainData()
  }

  loadBlockchainData() {
    OrdersDAO.loadOrders().then((orders) => {
      this.setState({
        orders: orders
      })
    })
  }

  render() {
    return (
       <div>
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                  <a className="navbar-brand" href="#">CFD Market</a>
              </div>
              <ul className="nav navbar-nav">

              </ul>
            </div>
          </nav>
          <div className="container-fluid">
            <div className="col-md-8">
              {(this.state.orders === undefined) ? (
                <h1>Loading...</h1>
              ) : (
                <OrderBook orders={this.state.orders}/>
              )}
            </div>
          </div>
        </div>
    )
  }


}
