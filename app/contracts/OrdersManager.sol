pragma solidity ^0.4.8;


import "./SafeMath.sol";
import "./EventfulMarket.sol";
import "./OracleUrls.sol";

contract OrdersManager is SafeMath, EventfulMarket, OracleUrls {

    uint constant minCollateral = 1 finney;

    struct Order {
        string symbol;
        Oracles oracle;
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
        Oracles oracle,
        bool   long,
        uint   limitCents,
        uint   expiration
    ) payable returns (uint) {
        assert(2 * msg.value * limitCents / limitCents == 2 * msg.value);
        assert(msg.value >  minCollateral);

        Order memory order = Order(symbol, oracle, long, msg.value, limitCents, expiration, msg.sender);
        uint id = nextOrderId();

        CreateOrder(id);
        UpdateOrder(id);

        orders[id] = order;
        return id;
    }

    function cancelOrder(uint id) {
        Order order = orders[id];
        assert(order.owner == msg.sender);
        if (!order.owner.send(order.collateral))
            throw;
        UpdateOrder(id);
        delete orders[id];
    }

    function nextOrderId() returns (uint) {
             return ++lastOrderId;
    }
}
