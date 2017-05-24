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


  static createOrder(collateral, symbol, long, priceLimit, timestampLimit) {
    return CfdMarket.createOrder(
        symbol,
        long,
        priceLimit,
        timestampLimit,
        {value: collateral * Math.pow(10, 18)}
      )
  }

  static cancel(id) {
    return CfdMarket.cancelOrder(id)
  }

  static trade(id) {
    return CfdMarket.trade(id)
  }
}
