class NetworkError extends React.Component {

  title() {
    switch (this.props.status) {
      case 'disconnected':
        return "Not connected to Ethereum"
      case 'wrong_network':
        return "Not connected to Kovan"
      case 'locked':
        return "Please unlock your account"
      case 'loading':
        return "Loading..."
    }
  }

  caption() {
    switch (this.props.status) {
      case 'disconnected':
        return (
          <p>Looks like you are not connected to <strong>Ethereum</strong>. Please install Metamask browser extension or use a local RPC node and <a href="/">try again</a>.</p>
        )
      case 'wrong_network':
        return (
          <div><p>Looks like you are not connected to the <strong>Kovan</strong> testnet. Please select Kovan in Metamask or run parity with
          the following keys:</p>
          <pre>parity --chain kovan --rpccorsdomain "*"</pre>
          <p><a href="/">try again</a></p>
          </div>
        )
      case 'locked':
        return (
          <p>Please enter your password in Metamask and <a href="/">try again</a>.</p>
        )
      case 'loading':
        return ("")
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-offset-2 col-md-8">
            <div className="panel panel-default">
              <div className="panel-body">
                <div className="jumbotron text-center mb0">
                  <h1>{this.title()}</h1>
                  <br />
                  <br />
                  {this.caption()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
