class SelectSymbol extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <ul className="nav nav-pills nav-stacked">
        {Object.values(this.props.symbols).map((symbolObj) => (
          <li key={symbolObj.symbol} className={this.props.activeSymbol == symbolObj.symbol ? "active" : ""}>
            <a href="#" onClick={(e) => this.props.changeSymbol(e, symbolObj.symbol)}>{symbolObj.symbol} <span className="badge">4</span></a>
          </li>
        ))}
      </ul>
    )
  }


}
