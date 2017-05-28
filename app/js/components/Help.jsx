class Help extends React.Component {
  render() {
    return (
      <div className="modal fade" id="help" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="myModalLabel">Ether Wager Help</h4>
            </div>
            <div className="modal-body">
              <h5> Overview </h5>
              <p>
                Wager Bay is a decentralised over-the-counter exchange for
                <a href="https://en.wikipedia.org/wiki/Contract_for_difference">CFD</a>
                 trading. Built on ethereum, there is no middle man or counterparty risk.
              </p>
              <h5> Contracts for Difference </h5>
              <p>
                There are two parties in any position. They bet on the opposite directions of the chosen asset's price.
                At the
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
