pragma solidity ^0.4.8;

import "./SafeMath.sol";
import "./EventfulMarket.sol";
import "./OrdersManager.sol";

contract CfdMarket is OrdersManager {

    struct Trade {
        string symbol;
        address short;
        address long;
        uint timestampLimit;
        uint price;
        uint collateral; // each
    }

    uint public lastTradeId;

    mapping (uint => Trade) public trades;


    function trade(uint orderId) payable returns (uint) {
        Order order = orders[orderId];
        assert(msg.value == order.collateral);
        // assert(msg.sender != order.owner)
        delete orders[orderId];

        Trade memory trade = Trade(
            order.symbol,
            order.long ? msg.sender : order.owner,
            order.long ? order.owner : msg.sender,
            order.timestampLimit,
            order.limit,
            order.collateral
        );

        uint tradeId = nextTradeId();
        trades[tradeId] = trade;
        return tradeId;
    }


    function nextTradeId() internal returns (uint) {
             return ++lastTradeId;
    }
}
