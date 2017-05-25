pragma solidity ^0.4.8;


import "./SafeMath.sol";
import "./EventfulMarket.sol";

contract OrdersManager is SafeMath, EventfulMarket {

    uint constant minCollateral = 1 finney;

    struct Order {
        string symbol;
        bool long;
        uint collateral;
        uint limitCents;
        uint expiration;
        address owner;
    }

    uint public lastOrderId;

    mapping (uint => Order) public orders;

    function createOrder(
        string symbol,
        bool   long,
        uint   limitCents,
        uint   expiration
    ) payable returns (uint) {
        assert(msg.value >  minCollateral);

        Order memory order = Order(symbol, long, msg.value, limitCents, expiration, msg.sender);
        uint id = nextOrderId();

        CreateOrder(id);

        orders[id] = order;
        return id;
    }

    function cancelOrder(uint id) {
        Order order = orders[id];
        assert(order.owner == msg.sender);
        if (!order.owner.send(order.collateral))
            throw;
        delete orders[id];
    }

    function nextOrderId() returns (uint) {
             return ++lastOrderId;
    }
}
