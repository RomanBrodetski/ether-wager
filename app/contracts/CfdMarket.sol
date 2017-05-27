pragma solidity ^0.4.8;

import "./SafeMath.sol";
import "./EventfulMarket.sol";
import "./OrdersManager.sol";
import "./OracleUrls.sol";
import "./vendor/oraclizeAPI.sol";


contract CfdMarket is OrdersManager {

    struct Position {
        string symbol;
        Oracles oracle;
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
            order.oracle,
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
            if (!pos.long.send(pos.longClaim)) throw;
            pos.longClaim = 0;
        } else if (pos.shortClaim > 0 && msg.sender == pos.long) {
            if (!pos.short.send(pos.shortClaim)) throw;
            pos.shortClaim = 0;
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

        OracleRespond(positionId);

        positions[positionId] = pos;
    }

    function getOraclePrice() returns (uint) {
        return oraclize.getPrice("URL");
    }

    function execute(uint positionId) {
        Position pos = positions[positionId];
        // assert(time passed)
        assert(!pos.executed);

        bytes32 myId = oraclize_query("URL", buildOracleUrl(pos.symbol, pos.oracle));
        myidToPositionId[myId] = positionId;
    }


    function nextPositionId() internal returns (uint) {
             return ++lastPositionId;
    }
}
