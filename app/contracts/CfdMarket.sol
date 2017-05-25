pragma solidity ^0.4.8;

import "./SafeMath.sol";
import "./EventfulMarket.sol";
import "./OrdersManager.sol";
import "./vendor/oraclizeAPI.sol";


contract CfdMarket is OrdersManager, usingOraclize {

    struct Position {
        string symbol;
        address short;
        address long;
        uint expiration;
        uint priceCents;
        uint collateral; // each
        bool executed;
        uint expirationPrice;
        uint longClaim;
        uint shortClaim;
    }

    uint public lastPositionId;

    mapping (uint => Position) public positions;

    mapping(bytes32 => uint) public myidToPositionId;

    function trade(uint orderId) payable returns (uint) {
        Order order = orders[orderId];
        assert(order.collateral > 0);
        assert(msg.value == order.collateral);
        // assert(msg.sender != order.owner)

        Position memory position = Position(
            order.symbol,
            order.long ? msg.sender : order.owner,
            order.long ? order.owner : msg.sender,
            order.expiration,
            order.limitCents,
            order.collateral,
            false,
            0,
            0,
            0
        );

        uint positionId = nextPositionId();
        positions[positionId] = position;
        delete orders[orderId];
        return positionId;
    }

    function claim(uint positionId) {
        Position pos = positions[positionId];

        if (!pos.executed) throw;
        if (pos.longClaim > 0 && msg.sender == pos.long) {
            pos.longClaim = 0;
            if (!pos.long.send(pos.longClaim)) throw;
        } else if (pos.shortClaim > 0 && msg.sender == pos.long) {
            pos.shortClaim = 0;
            if (!pos.short.send(pos.shortClaim)) throw;
        } else throw;

        positions[positionId] = pos;
    }

    function __callback(bytes32 myId, string res) {
        if (msg.sender != oraclize_cbAddress()) throw;

        uint positionId = myidToPositionId[myId];
        delete myidToPositionId[myId];

        if (positionId == 0) throw;

        Position pos = positions[positionId];
        uint currentPriceCents = parseInt(res, 2);

        pos.expirationPrice = currentPriceCents;
        pos.executed = true;

        pos.longClaim = min(pos.collateral * currentPriceCents / pos.priceCents, pos.collateral * 2);
        pos.shortClaim = pos.collateral * 2 - pos.longClaim;

        positions[positionId] = pos;
    }

    function execute(uint positionId) {
        Position pos = positions[positionId];
        // assert(time passed)
        assert(!pos.executed);

        string memory url = strConcat(
            "https://query.yahooapis.com/v1/public/yql?q=select%20Ask,Bid%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22",
            pos.symbol,
            "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="
        );

        string memory query = strConcat(
            "json(",
            url,
            ").query.results.quote.Ask"
        );

        bytes32 myId = oraclize_query("URL", query);
        myidToPositionId[myId] = positionId;
    }


    function nextPositionId() internal returns (uint) {
             return ++lastPositionId;
    }
}
