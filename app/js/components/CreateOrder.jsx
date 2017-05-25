class CreateOrder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      collateral: "",
      long: true,
      timestamp: "",
      limit: ""
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleDirectionChange = this.handleDirectionChange.bind(this)
    this.createOrder = this.createOrder.bind(this)

  }

 handleInputChange(event) {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }

  handleDirectionChange(event) {
    this.setState({
      long: event.target.value == "long"
    })
  }

  createOrder() {
    OrdersDAO.createOrder(
      this.state.collateral,
      this.props.symbol.symbol,
      this.state.long,
      this.state.limit,
      this.state.timestamp
    ).then(this.props.onTrade)
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Create Order</div>
        <div className="panel-body">
          <form className="form">
            <div className="col-md-6">
              <div className="form-group">
                <label>Symbol</label>
                <input type="text" disabled className="form-control" value={this.props.symbol.symbol} />
              </div>
              <div className="form-group">
                <label>Current Oracle Value</label>
                <input type="text" disabled className="form-control" value={this.props.price} />
              </div>
              <div className="form-group">
                <label>Oracle URL</label>
                <input type="text" disabled className="form-control" value={this.props.symbol.oracle} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <div className="input-group">
                  <label>Collateral</label>
                  <input onChange={this.handleInputChange} type="number" className="form-control" name="collateral" placeholder="Collateral" value={this.state.collateral} />
                  <span className="input-group-addon">ETH</span>
                </div>
              </div>
              <div className="radio">
                <label className="radio-inline">
                  <input onChange={this.handleDirectionChange} type="radio" name="direction" value="long" checked={this.state.long} /> long
                </label>
                <label className="radio-inline">
                  <input onChange={this.handleDirectionChange} type="radio" name="direction" value="short" checked={!this.state.long} /> short
                </label>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <label>Strike Price</label>
                  <input onChange={this.handleInputChange} type="number" className="form-control" name="limit" placeholder="Price" value={this.state.limit} />
                  <span className="input-group-addon">$</span>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <label>Expiration</label>
                  <input onChange={this.handleInputChange} type="number" className="form-control" name="timestamp" placeholder="Timestamp" value={this.state.timestamp}/>
                </div>
              </div>
            </div>
             <button type="button" onClick={this.createOrder} className="btn btn-default">Create Order</button>
          </form>
        </div>
      </div>
    )
  }
}
