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


    function trade(uint id) {
        Order order = orders[id];
        assert(msg.value == order.collateral)
        // assert(msg.sender != order.owner)
        delete orders[id];

        Trade memory
    }


    function


}
