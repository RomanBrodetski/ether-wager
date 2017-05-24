import "./SafeMath.sol";
import "./EventfulMarket.sol";

contract OrdersManager is SafeMath, EventfulMarket {

    uint constant minCollateral = 1 finney;

    struct Order {
        string symbol;
        bool long;
        uint collateral;
        uint limit;
        uint timestampLimit;
        address owner;
    }

    uint public lastOrderId;

    mapping (uint => Order) public orders;

    function createOrder(
        string symbol,
        bool   long,
        uint   limit,
        uint   timestampLimit
    ) payable returns (uint) {
        assert(msg.value >  minCollateral);

        Order memory order = Order(symbol, long, msg.value, limit, timestampLimit, msg.sender);
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

    function nextOrderId() internal returns (uint) {
             return ++lastOrderId;
    }
}
