class Wrapper extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      status: "disconnected"
    }
    this.checkConnection()
  }

  checkAccountUnlocked() {
    if (web3.eth.accounts[0]) {
      this.setState({
        status: "connected"
      })
    } else {
      this.setState({
        status: "locked"
      })
    }
  }

  checkKovanConnection() {
    web3.eth.getBlock(0, (e,r) => {
      if (true || r.hash == "0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9") {
        this.checkAccountUnlocked()
      } else {
        this.setState({
          status: "wrong_network"
        })
      }
    })
  }

  checkConnection() {
    if (web3.currentProvider.isConnected()) {
      this.checkKovanConnection()
    } else {
      this.setState({
        status: "disconnected"
      })
    }
  }

  render() {
    console.log("render wrapper")
    return (
       <div>
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                <a className="navbar-brand ether-wager" href="#">Ether Wager</a>
              </div>
              <ul className="nav navbar-nav pull-right">
                <li>
                  <a href="#" data-toggle="modal" data-target="#help">Help</a>
                </li>
              </ul>
            </div>
          </nav>
          <Help />
          {
            (this.state.status == "connected")
            ? <App symbols={this.props.symbols}/>
            : <NetworkError status={this.state.status}/>
          }
        </div>
    )
  }
}
