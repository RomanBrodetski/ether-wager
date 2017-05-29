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
      limit: "",
      isLoading: false,
      status: "none",
      spot: true,
      premium: "",
      leverage: "1"
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDirectionChange = this.handleDirectionChange.bind(this);
    this.handleSpotChange = this.handleSpotChange.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.formIsValid = this.formIsValid.bind(this);
  }

  handleInputFocus() {
    this.setState({
      status: "none"
    });
  }

  handleInputChange(event) {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const name = event.target.name;

    if (name === "date") {
      let now = new Date().getTime();
      let dateSet = new Date(value).getTime();

      this.setState({
        date: value //> now ? value : this.state.date
      });
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  handleDirectionChange(event) {
    this.setState({
      long: event.target.value === "long"
    })
  }

  handleSpotChange(event) {
    this.setState({
      spot: event.target.value === "spot"
    })
  }

  createOrder() {
    const timestamp = (new Date(this.state.date).getTime()) / 1000;

    this.setState({
      isLoading: true
    });

    OrdersDAO.createOrder(
      this.state.collateral,
      this.props.symbol.symbol,
      this.props.symbol.oracle,
      this.state.long,
      this.state.spot,
      this.state.premium,
      this.state.limit,
      timestamp,
      this.state.leverage
    ).then(
      () => this.setState({
        isLoading: false,
        collateral: "",
        limit: "",
        status: "success"
      }),
      () => this.setState({
        isLoading: false,
        status: "fail"
      })
    );
  }

  formIsValid() {
    return (!this.state.isLoading &&
      this.state.collateral >= 0.05 &&
      this.state.collateral.length &&
      (this.state.limit.length && !this.state.spot || this.state.premium && this.state.spot) &&
      this.state.date.length)
  }

  render() {
    const linkStyle = {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    };
    let today = new Date();

    console.log("rerender")

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
                <div className="radio">
                  <label className="radio-inline">
                    <input onFocus={this.handleInputFocus} onChange={this.handleDirectionChange} type="radio" name="direction" value="long" checked={this.state.long} /> long
                  </label>
                  <label className="radio-inline">
                    <input onFocus={this.handleInputFocus} onChange={this.handleDirectionChange} type="radio" name="direction" value="short" checked={!this.state.long} /> short
                  </label>
                </div>
                <div className="form-group">
                  <label>Collateral</label>
                  <div className="input-group">
                    <input onFocus={this.handleInputFocus} onChange={this.handleInputChange} type="number" className="form-control" name="collateral" placeholder="Collateral" value={this.state.collateral} min="0.05" step="0.01"/>
                    <span className="input-group-addon">ETH</span>
                  </div>
                </div>
                <div className="radio">
                  <label className="radio-inline">
                    <input onFocus={this.handleInputFocus} onChange={this.handleSpotChange} type="radio" name="spot" value="fixed" checked={!this.state.spot}  /> Fixed Price
                  </label>
                  <label className="radio-inline">
                    <input onFocus={this.handleInputFocus} onChange={this.handleSpotChange} type="radio" name="spot" value="spot" checked={this.state.spot} /> Spot Price
                    &nbsp;<Tooltip title="The strike price will be computed at the position create time based on the spot price provided by oracle and the percentage in the box below. Value of 100% corresponds to the strike price being equal to spot price." />
                  </label>
                </div>
                {this.state.spot
                  ? <div className="form-group">
                      <div className="input-group">
                        <input onChange={this.handleInputChange} type="number" className="form-control" name="premium" placeholder="Percentage of spot price" value={this.state.premium} step="1" min="90" max="110"/>
                        <span className="input-group-addon"><i className="fa fa-percent" aria-hidden="true"></i></span>
                      </div>
                    </div>
                  : <div className="form-group">
                      <div className="input-group">
                        <input onChange={this.handleInputChange} type="number" className="form-control" name="limit" placeholder="Price" value={this.state.limit} min="0.01" step="1"/>
                        <span className="input-group-addon"><i className="fa fa-usd" aria-hidden="true"></i></span>
                      </div>
                    </div>
                }
                <div className="form-group">
                  <label>Leverage</label>
                  <div className="radio">
                    <label className="radio-inline">
                      <input onFocus={this.handleInputFocus} onChange={this.handleInputChange} type="radio" name="leverage" value="1" checked={this.state.leverage === "1"} /> 1x
                    </label>
                    <label className="radio-inline">
                      <input onFocus={this.handleInputFocus} onChange={this.handleInputChange} type="radio" name="leverage" value="2" checked={this.state.leverage === "2"} /> 2x
                    </label>
                    <label className="radio-inline">
                      <input onFocus={this.handleInputFocus} onChange={this.handleInputChange} type="radio" name="leverage" value="3" checked={this.state.leverage === "3"} /> 3x
                    </label>
                    <label className="radio-inline">
                      <input onFocus={this.handleInputFocus} onChange={this.handleInputChange} type="radio" name="leverage" value="5" checked={this.state.leverage === "5"} /> 5x
                    </label>
                    <label className="radio-inline">
                      <input onFocus={this.handleInputFocus} onChange={this.handleInputChange} type="radio" name="leverage" value="10" checked={this.state.leverage === "10"} /> 10x
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Expiration</label>
                  <div className="input-group">
                    <input onFocus={this.handleInputFocus} onChange={this.handleInputChange} type="datetime-local" className="form-control" name="date" placeholder="Set your date" value={this.state.date} />
                  </div>
                </div>
                <button onClick={this.createOrder} disabled={!this.formIsValid()} className="btn btn-success" type="button">
                  <span>Create Order </span>
                  {this.state.isLoading && <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>}
                </button>
                {this.state.status === "fail" && <p><i className="glyphicon glyphicon-remove text-danger"></i> the order was not created</p>}
                {this.state.status === "success" && <p><i className="glyphicon glyphicon-ok text-success"></i> the order is successfully created</p>}
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
