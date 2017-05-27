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
    const timestamp = (new Date(this.state.timestamp).getTime())/1000;

    OrdersDAO.createOrder(
      this.state.collateral,
      this.props.symbol.symbol,
      this.props.symbol.oracle,
      this.state.long,
      this.state.limit,
      timestamp
    ).then(this.props.onTrade)
  }

  render() {
    const dateFromState = new Date(this.state.timestamp);
    const linkStyle = {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    };

    return (
      <div className="panel panel-default">
        <div className="panel-heading">Create Order for <strong>{this.props.symbol.symbol}</strong></div>
        <div className="panel-body">
          <form className="form">
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Current Oracle Value</label>
                  <input type="text" disabled className="form-control" value={this.props.oracle.price || "..."} />
                  <p className="help-block" style={linkStyle}>Url:
                  <a className="text-muted" href={this.props.oracle.url} target="_blank">{this.props.oracle.url || "..."}</a></p>
                  <p className="help-block" style={linkStyle}>JSON Path:
                  <span className="text-muted">{this.props.oracle.query || "..."}</span></p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Collateral</label>
                  <div className="input-group">
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
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Strike Price</label>
                  <div className="input-group">
                    <input onChange={this.handleInputChange} type="number" className="form-control" name="limit" placeholder="Price" value={this.state.limit} />
                    <span className="input-group-addon">$</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Expiration</label>
                  <div className="input-group">
                    <input onChange={this.handleInputChange} type="datetime-local" className="form-control" name="timestamp" placeholder="Timestamp" value={this.state.timestamp}/>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <button type="button" onClick={this.createOrder} className="btn btn-success">Create Order</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}