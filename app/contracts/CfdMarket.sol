pragma solidity ^0.4.8;

import "./SafeMath.sol";
import "./EventfulMarket.sol";
contract CfdMarket is SafeMath, EventfulMarket {

    uint constant minCollateral = 1 finney;

    struct Order {
        string symbol;
        bool long;
        uint collateral;
        uint takerFee;
        address owner;
    }

    uint public lastOrderId;

    mapping (uint => Order) public orders;

    function createOrder(
        string symbol,
        bool   long,
        uint   takerFee
    ) payable returns (uint) {
        assert(msg.value >  0);
        assert(takerFee  >= 0);
        assert(takerFee  <= msg.value / 2);

        Order memory order = Order(symbol, long, msg.value, takerFee, msg.sender);
        uint id = nextId();

        CreateOrder(id);

        orders[id] = order;
        return id;
    }

    function nextId() internal returns (uint) {
             return ++lastOrderId;
    }
}
