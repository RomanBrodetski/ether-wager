class DefaultScreen extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-offset-2 col-md-8">
            <div className="panel panel-default">
              <div className="panel-body">
                <div className="jumbotron text-center mb0">
                  <h1>Not connected to Ethereum</h1>
                  <br />
                  <br />
                  <p>Ether Wager is currently deployed in <strong>Kovan</strong> test ethereum network.
                     Please make sure that it is selected in your browser extention or your Ethereum node is connected to it.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
