class CreateOrder extends React.Component {
  constructor(props) {
    super(props)

    let defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    defaultDate.setMinutes(0);

    this.state = {
      collateral: "",
      long: true,
      date: defaultDate.toISOString().slice(0, -8),
      limit: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDirectionChange = this.handleDirectionChange.bind(this);
    this.createOrder = this.createOrder.bind(this);
    // this.nextWeek = this.nextWeek.bind(this);
  }

  nextWeek(today) {
    nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
    return nextweek;
  }

  handleInputChange(event) {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const name = event.target.name;

    if (name === "date") {
      let now = new Date().getTime();
      let dateSet = new Date(value).getTime();

      this.setState({
        date: dateSet > now ? value : this.state.date
      });
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  handleDirectionChange(event) {
    this.setState({
      long: event.target.value == "long"
    })
  }

  createOrder() {
    const timestamp = (new Date(this.state.date).getTime())/1000;

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
    const linkStyle = {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    };

    let today = new Date();

    return (
      <div className="panel panel-primary">
        <div className="panel-heading">Create Order for <strong>{this.props.symbol.symbol}</strong></div>
        <div className="panel-body">
          <form className="form">
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Current Oracle Value</label>
                  <input type="text" disabled className="form-control" value={this.props.oracle.price || "..."} />
                  <div className="text-muted" style={linkStyle}>
                    Url:
                    <a className="text-muted" href={this.props.oracle.url} target="_blank"> {this.props.oracle.url || "..."}</a>
                  </div>
                  <div className="text-muted" style={linkStyle}>
                    JSON Path:
                    <span> {this.props.oracle.query || "..."}</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Collateral</label>
                  <div className="input-group">
                    <input onChange={this.handleInputChange} type="number" className="form-control" name="collateral" placeholder="Collateral" value={this.state.collateral} min="0.01" step="0.01"/>
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
                  <label>Strike Price</label>
                  <div className="input-group">
                    <input onChange={this.handleInputChange} type="number" className="form-control" name="limit" placeholder="Price" value={this.state.limit} min="0.01" step="1"/>
                    <span className="input-group-addon">$</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Expiration</label>
                  <div className="input-group">
                    <input onChange={this.handleInputChange} type="datetime-local" className="form-control" name="date" placeholder="Timestamp" value={this.state.date} />
                  </div>
                </div>
                <button type="button" onClick={this.createOrder} className="btn btn-success">Create Order</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
