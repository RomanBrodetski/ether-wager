pragma solidity ^0.4.8;

import "./OrdersManager.sol";


contract CfdMarket is OrdersManager {

    uint constant callbackGasLimit = 300000;

    struct OracleRequest {
        bool isPosition; // true -> exersising, false -> checking spot price for an order
        uint id;
        address countrerparty; // only set for orders
        uint oracleComission; // only set for orders
    }

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

    mapping(bytes32 => OracleRequest) public oracleRequests;

    function trade(uint orderId) payable  {
        Order order = orders[orderId];
        assert(msg.value == order.collateral);
        assert(order.spot || order.strikeCents > 0);
        assert(!order.oracleRequested);
        // assert(msg.sender != order.owner)

        if (order.spot) { //price is pegged to the oracle value
            uint oracleComission = oraclize_getPrice("URL", callbackGasLimit);
            assert(oracleComission < order.collateral);
            order.oracleRequested = true;
            bytes32 myId = oraclize_query("URL", buildOracleUrl(order.symbol, order.oracle), callbackGasLimit);
            UpdateOrder(orderId);
            orders[orderId] = order;
            oracleRequests[myId] = OracleRequest(false, orderId, msg.sender, oracleComission);
        } else { //price is fixed
            createPositionFromOrder(orderId, order, msg.sender, order.strikeCents, 0);
        }
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

        UpdatePosition(positionId);

        positions[positionId] = pos;
    }

    function __callback(bytes32 myId, string res) {
        assert(msg.sender == oraclize_cbAddress());

        OracleRequest memory request = oracleRequests[myId];
        assert(request.id > 0);
        delete oracleRequests[myId];
        if (request.isPosition) {

            Position pos = positions[request.id];
            uint currentPriceCents = parseInt(res, 2);

            pos.expirationPriceCents = currentPriceCents;
            pos.executed = true;

            uint baseCollateral = 2 * pos.collateral - pos.oracleComission;
            assert(currentPriceCents == 0 || baseCollateral * currentPriceCents / currentPriceCents == baseCollateral);

            pos.longClaim = min(baseCollateral / 2 * currentPriceCents / pos.priceCents, baseCollateral);
            pos.shortClaim = baseCollateral - pos.longClaim;

            assert(pos.longClaim + pos.shortClaim + pos.oracleComission == pos.collateral * 2);

            UpdatePosition(request.id);

            positions[request.id] = pos;
        } else {
            Order order = orders[request.id];
            int price = int(parseInt(res, 2));
            uint strikeCents = uint(price + price * order.premiumBp / 10000);
            createPositionFromOrder(request.id, order, request.countrerparty, strikeCents, request.oracleComission);
        }
    }

    function execute(uint positionId) {
        Position pos = positions[positionId];
        assert(block.timestamp > pos.expiration);
        assert(!pos.oracleRequested);

        pos.oracleRequested = true;
        pos.oracleComission += oraclize_getPrice("URL", callbackGasLimit);

        assert (pos.oracleComission < pos.collateral);

        bytes32 myId = oraclize_query("URL", buildOracleUrl(pos.symbol, pos.oracle), callbackGasLimit);
        UpdatePosition(positionId);
        positions[positionId] = pos;
        oracleRequests[myId] = OracleRequest(true, positionId, 0x0, 0);
    }

    function createPositionFromOrder(uint id, Order order, address countrerparty, uint price, uint oracleComission) internal {
        Position memory position = Position(
            order.symbol,
            order.oracle,
            order.long ? countrerparty : order.owner,
            order.long ? order.owner : countrerparty,
            order.expiration,
            price,
            order.collateral,

            false,
            false,
            oracleComission,
            0,
            0,
            0
        );

        uint positionId = nextPositionId();
        positions[positionId] = position;
        UpdateOrder(id);
        UpdatePosition(positionId);
        delete orders[id];
    }


    function nextPositionId() internal returns (uint) {
        return ++lastPositionId;
    }
}
