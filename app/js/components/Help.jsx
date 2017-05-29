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
                Ether Wager is a decentralised over-the-counter exchange for <a href="https://en.wikipedia.org/wiki/Contract_for_difference">CFD</a> trading.
                Built on Ethereum, it evaluates any middle man or counterparty risk.
              </p>
              <h5> Contracts for Difference </h5>
              <p>
                There are two parties in any position. They bet equal amount on the opposite directions of the chosen asset's price.
                After the expiration time, the contract can be exercised by any user. At that time, the collateral is distributed among parties
                in accordance to the price movement: the party that bet on the price going up gets the amount equal to the collateral times the price change.
                The other party gets the rest amount of the collateral.
              </p>
              <p>
                Thus, the "long" party's profit and loss is equal to the price change in percentage.
                If the price at least doubles, the party that bet on the price rise gets the whole collateral. For the "short" party to get the whole collateral
                the price has to fall to zero.
              </p>
              <p>
                Parties can agree on a leverage. It acts as a simple multiplier to the profit/loss at the exercise time.
              </p>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Leverage</th>
                      <th>Collateral, each</th>
                      <th>Strike Price</th>
                      <th>Exercise Price</th>
                      <th>Long Equity</th>
                      <th>Short Equity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1x</td>
                      <td>1</td>
                      <td>100</td>
                      <td>120</td>
                      <td>1.2</td>
                      <td>0.8</td>
                    </tr>
                    <tr>
                      <td>1x</td>
                      <td>1</td>
                      <td>100</td>
                      <td>80</td>
                      <td>0.8</td>
                      <td>1.2</td>
                    </tr>
                    <tr>
                      <td>1x</td>
                      <td>1</td>
                      <td>75</td>
                      <td>100</td>
                      <td>1.25</td>
                      <td>0.75</td>
                    </tr>
                    <tr>
                      <td>1x</td>
                      <td>1</td>
                      <td>7</td>
                      <td>10</td>
                      <td>~1.43</td>
                      <td>~0.57</td>
                    </tr>
                    <tr>
                      <td>1x</td>
                      <td>1</td>
                      <td>10</td>
                      <td>7</td>
                      <td>0.7</td>
                      <td>1.3</td>
                    </tr>
                    <tr>
                      <td>1x</td>
                      <td>1</td>
                      <td>7</td>
                      <td>20</td>
                      <td>2</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>2x</td>
                      <td>1</td>
                      <td>100</td>
                      <td>120</td>
                      <td>1.4</td>
                      <td>0.6</td>
                    </tr>
                    <tr>
                      <td>2x</td>
                      <td>1</td>
                      <td>100</td>
                      <td>150</td>
                      <td>2</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>2x</td>
                      <td>1</td>
                      <td>50</td>
                      <td>46</td>
                      <td>0.84</td>
                      <td>1.16</td>
                    </tr>
                    <tr>
                      <td>5x</td>
                      <td>1</td>
                      <td>100</td>
                      <td>110</td>
                      <td>1.5</td>
                      <td>0.5</td>
                    </tr>
                    <tr>
                      <td>5x</td>
                      <td>1</td>
                      <td>70</td>
                      <td>65</td>
                      <td>~0.64</td>
                      <td>~1.36</td>
                    </tr>
                  </tbody>
                </table>
                <h5> Placing an Order </h5>
                <p>
                  To open a position, two parties should agree on its properties. This is achieved with an on-chain order ledger.
                  Everyone can create an order and if someone is interested, they can accept it, clicking the <i>Trade</i> button.
                  At this moment the position is created.
                  To place an order, one has to fill in the following fields:
                </p>
                  <ul>
                    <li>
                      <b>Collateral</b> - this is the maximum amount user can lose. The profit is also limited with this amount.
                    </li>
                    <li>
                      <b>Direction</b> - user has to chose if they want to open a <i>long</i> or <i>short</i>
                    </li>
                    <li>
                      <b>Strike Price</b> - the price that is used as the base price at the contract exercise time.
                      Can be set as a fixed amount, or as a percentage to the spot price.
                      In this case, the strike price is computed automatically at the contract (not order) creation time.
                      This is not the same as setting the fixed strike price equal to the current asset price, as the price can change between the order creation
                      and the contract creation. In general, it is recommended to set the dynamic strike prices, but be aware that this requires an extra request to the oracle, which results in additional gas fees.
                    </li>
                    <li>
                      <b>Leverage</b>
                    </li>
                    <li>
                      <b>Expiration</b> - after this time anyone can exercise the contract, which will result in the P&L being computed and locked.
                    </li>
                  </ul>
                <h5> Exercising a Position </h5>
                <p>
                  Once the expiration time passes, the parties can exercise the position. Once this is done,
                  the current asset price is obtained from the oracle, and the profit or loss is computed for both parties. After that, the parties can
                  claim their adjusted collateral.
                </p>
                <h5> Oracle </h5>
                <p>
                  <a href="http://www.oraclize.it/" target="_blank">Oraclize</a> service is used to obtain assets prices on-chain.
                  Its comission (0.01$ + gas prices) is payed from the collateral. The exact urls and json pathes that are passed
                  to the Oraclized can be seen in the order creation panel.
                </p>
                <h5> Fees </h5>
                <p>
                  Currently there are no fees. Taker fee of 0.3% may be introduced in the future.
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
