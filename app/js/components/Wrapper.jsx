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

  checkTestnetConnection() {
    web3.eth.getBlock(0, (e,r) => {
      if (CfdMarket.address == "0x474d10bfb138bd64b93187c24e0df32c34561eeb") { //kovan
        if (r.hash == "0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9") {
          this.checkAccountUnlocked()
        } else {
          this.setState({
            status: "wrong_network_kovan"
          })
        }
      } else {
        if (CfdMarket.address == "0xda8f2767f9f7e4e7b5c043af87721302682232ad") { //rinkeby
          if (r.hash == "0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177") {
            this.checkAccountUnlocked()
          } else {
            this.setState({
              status: "wrong_network_rinkeby"
            })
          }
        }
      }
    })
  }

  checkConnection() {
    if (web3.currentProvider.isConnected()) {
      this.checkTestnetConnection()
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
