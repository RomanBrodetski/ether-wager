class OrdersDAO {
  static loadOrders() {
    return CfdMarket.lastOrderId().then((lastOrderId) =>
      Promise.all(_.range(1, lastOrderId.toNumber() + 1).map((id) => CfdMarket.orders(id).then(order => [order, id])))
    )
    .then((orders) => _.chain(orders)
      .map((order) => new Order(order[0], order[1]))
      .filter((order) => !(order.isNull()))
      .sortBy((order) => order.limit)
      .value()
      )
  }


  static createOrder(collateral, symbol, oracle, long, priceLimit, timestampLimit) {
    return CfdMarket.createOrder(
        symbol,
        Oracles.toBlockchain(oracle),
        long,
        priceLimit * 100,
        timestampLimit,
        {value: collateral * Math.pow(10, 18), gas: 1000000}
      )
  }

  static cancel(orderId) {
    return CfdMarket.cancelOrder(orderId)
  }

  static trade(order) {
    return CfdMarket.trade(order.id, {value: order.collateral, gas: 500000})
  }
}
