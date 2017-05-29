class PositionsOverview extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      myPositionsOpened: true,
      currentTab: "allPositions"
    }

    this.toggle = this.toggle.bind(this);
    this.switchTabs = this.switchTabs.bind(this);
  }

  switchTabs(event) {
    event.preventDefault();

    this.setState({
      currentTab: event.target.name
    })
  }

  toggle(event) {
    event.preventDefault();

    this.setState({
      myPositionsOpened: !this.state.myPositionsOpened
    })
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading" onClick={this.toggle} style={{cursor:'pointer'}}>
          <span>
            My positions overview
            {
              this.state.myPositionsOpened
              ? <span className="glyphicon glyphicon-menu-down" aria-hidden="true" style={{paddingLeft: '5px', fontSize: '11px'}}></span>
              : <span className="glyphicon glyphicon-menu-up" aria-hidden="true" style={{paddingLeft: '5px', fontSize: '11px'}}></span>
            }
          </span>
        </div>

        <div className={this.state.myPositionsOpened ? "panel-body" : "hidden panel-body"}>
          <ul className="nav nav-tabs" role="tablist">
            <li role="presentation" className={this.state.currentTab === "allPositions" ? "active" : ""}><a href="" name="allPositions" onClick={this.switchTabs}>All my positions</a></li>
            <li role="presentation" className={this.state.currentTab === "isActive" ? "active" : ""}><a href="" name="isActive" onClick={this.switchTabs}>Active positions</a></li>
            <li role="presentation" className={this.state.currentTab === "needsAttention" ? "active" : ""}><a href="" name="needsAttention" onClick={this.switchTabs}>Waiting for action</a></li>
            <li role="presentation" className={this.state.currentTab === "isClosed" ? "active" : ""}><a href="" name="isClosed" onClick={this.switchTabs}>Closed</a></li>
          </ul>

          <div>
            {this.props.positions === undefined
              ? <Loading />
              : <div className="tab-content">
                  <div role="tabpanel" className={this.state.currentTab === "allPositions" ? "tab-pane active" : "tab-pane"}>
                    <Positions
                      onTrade={this.props.loadBlockchainData}
                      oracles={this.props.oracles}
                      symbol={this.props.activeSymbol}
                      positions={Object.values(this.props.positions)} />
                  </div>
                  <div role="tabpanel" className={this.state.currentTab === "isActive" ? "tab-pane active" : "tab-pane"}>
                    <Positions
                      onTrade={this.props.loadBlockchainData}
                      oracles={this.props.oracles}
                      symbol={this.props.activeSymbol}
                      positions={Object.values(this.props.positions).filter((el) => ( el.state === "active" ))} />
                  </div>
                  <div role="tabpanel" className={this.state.currentTab === "needsAttention" ? "tab-pane active" : "tab-pane"}>
                    <Positions
                      onTrade={this.props.loadBlockchainData}
                      oracles={this.props.oracles}
                      symbol={this.props.activeSymbol}
                      positions={Object.values(this.props.positions).filter((el) => ( el.state === "pending" || el.state === "waiting for oracle" || el.state === "claim" ))} />
                  </div>
                  <div role="tabpanel" className={this.state.currentTab === "isClosed" ? "tab-pane active" : "tab-pane"}>
                    <Positions
                      onTrade={this.props.loadBlockchainData}
                      oracles={this.props.oracles}
                      symbol={this.props.activeSymbol}
                      positions={Object.values(this.props.positions).filter((el) => ( el.state === "closed" ))} />
                  </div>
                </div>
            }
          </div>
        </div>
      </div>
    )
  }
}
