pragma solidity ^0.4.8;


import "./SafeMath.sol";
import "./EventfulMarket.sol";
import "./OracleUrls.sol";

contract OrdersManager is SafeMath, EventfulMarket, OracleUrls {

    uint constant minCollateral = 1 finney;

    int constant maxPremium = 2000;

    struct Order {
        string  symbol;
        Oracles oracle;
        bool    long;
        uint    collateral;
        uint8   leverage;
        bool    spot; // price is pegged to the oracle value
        int     premiumBp; // price premium to the spot price in basis points (10000bp == 100%)
        bool    oracleRequested;
        uint    strikeCents; // should only be set if spot == false
        uint    expiration; // timestamp
        address owner;
    }

    uint public lastOrderId;

    mapping (uint => Order) public orders;

    function createOrder(
        string symbol,
        Oracles oracle,
        bool   long,
        uint8  leverage,
        int    premiumBp,
        uint   strikeCents,
        uint   expiration
    ) payable returns (uint) {
        assert(strikeCents == 0 && premiumBp != 0 || strikeCents > 0 && premiumBp == 0);
        assert(premiumBp < maxPremium && premiumBp > (- maxPremium));
        assert(strikeCents == 0 || 2 * msg.value * strikeCents / strikeCents == 2 * msg.value);
        assert(msg.value >  minCollateral);
        assert(leverage  <=  10);

        Order memory order = Order(symbol, oracle, long, msg.value, leverage, strikeCents == 0, premiumBp, false, strikeCents, expiration, msg.sender);
        uint id = nextOrderId();

        CreateOrder(id);
        UpdateOrder(id);

        orders[id] = order;
        return id;
    }

    function cancelOrder(uint id) {
        Order order = orders[id];
        assert(order.owner == msg.sender);
        assert(order.owner.send(order.collateral));
        UpdateOrder(id);
        delete orders[id];
    }

    function nextOrderId() returns (uint) {
             return ++lastOrderId;
    }
}
