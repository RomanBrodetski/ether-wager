pragma solidity ^0.4.8;

import "./OrdersManager.sol";


contract CfdMarket is OrdersManager {

    struct Position {
        string symbol;
        Oracles oracle;
        address short;
        address long;
        uint expiration; // timestamp
        uint priceCents; // strike price
        uint collateral; // each party's collateral

        bool executed; //7
        bool oracleRequested;
        uint oracleComission; // price paid for the oracle
        uint expirationPriceCents; // price returned by the oracle
        uint longClaim; // wei won by the longing party
        uint shortClaim; // wei won by the shorting party
    }

    uint public lastPositionId;

    mapping (uint => Position) public positions;

    mapping(bytes32 => uint) public myidToPositionId;

    function trade(uint orderId) payable returns (uint) {
        Order order = orders[orderId];
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
            false,
            0,
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
        assert(msg.sender == oraclize_cbAddress());

        uint positionId = myidToPositionId[myId];
        delete myidToPositionId[myId];

        if (positionId == 0) throw;

        Position pos = positions[positionId];
        uint currentPriceCents = parseInt(res, 2);

        pos.expirationPriceCents = currentPriceCents;
        pos.executed = true;


        uint baseCollateral = 2 * pos.collateral - pos.oracleComission;
        assert(currentPriceCents == 0 || baseCollateral * currentPriceCents / currentPriceCents == baseCollateral);

        pos.longClaim = min(baseCollateral / 2 * currentPriceCents / pos.priceCents, baseCollateral);
        pos.shortClaim = baseCollateral - pos.longClaim;

        if (pos.longClaim + pos.shortClaim + pos.oracleComission != pos.collateral * 2)
            throw;

        OracleRespond(positionId);

        positions[positionId] = pos;
    }

    function execute(uint positionId) {
        Position pos = positions[positionId];
        // assert(time passed)
        assert(!pos.oracleRequested);

        pos.oracleRequested = true;
        pos.oracleComission = oraclize_getPrice("URL");

        if (pos.oracleComission > pos.collateral)
            throw;

        bytes32 myId = oraclize_query("URL", buildOracleUrl(pos.symbol, pos.oracle));
        positions[positionId] = pos;
        myidToPositionId[myId] = positionId;
    }


    function nextPositionId() internal returns (uint) {
        return ++lastPositionId;
    }
}
