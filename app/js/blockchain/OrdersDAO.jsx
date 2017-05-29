class OrdersDAO {
  static loadOrders() {
    return CfdMarket.lastOrderId().then((lastOrderId) =>
      Promise.all(_.range(1, lastOrderId.toNumber() + 1).map((id) => CfdMarket.orders(id).then(order => [order, id])))
    )
    .then((orders) => _.chain(orders)
      .map((order) => new Order(order[0], order[1]))
      .filter((order) => !(order.isNull()))
      .sortBy((order) => order.limit)
      .indexBy("id")
      .value()
      )
  }

  static loadOrder(id) {
    return CfdMarket.orders(id).then(order => new Order(order, id))
  }

  static createOrder(collateral, symbol, oracle, long, spot, premium, priceLimit, timestampLimit, leverage) {
    return CfdMarket.createOrder(
        symbol,
        Oracles.toBlockchain(oracle),
        long,
        leverage,
        spot ? premium * 100 : 0, //percentages -> basis points
        spot ? 0 : priceLimit * 100, //dollars -> cents
        timestampLimit,
        {value: new web3.BigNumber(collateral).times(Math.pow(10, 18)), gas: 300000} //eth -> wei
      )
  }

  static cancel(orderId) {
    return CfdMarket.cancelOrder(orderId)
  }

  static trade(order, amount) {
    if (amount == order.collateral) {
      return CfdMarket.trade(order.id, {value: order.collateral, gas: 500000})
    } else {
      return CfdMarket.partialTrade(order.id, {value: amount, gas: 700000})
    }
  }
}
