 class PositionsDAO {
  static loadPositions() {
    return CfdMarket.lastPositionId().then((lastPositionId) =>
      Promise.all(_.range(1, lastPositionId.toNumber() + 1).map((id) => {
        const posPromise = CfdMarket.positions(id).then(position => [position, id])
        const exPromise = CfdMarket.exercises(id)
        const orReqPromise = CfdMarket.positionOracleRequested(id)
        return Promise.all([posPromise, exPromise, orReqPromise])
      }))
    )
    .then((positions) => _.chain(positions)
      .map((position) => new Position(position[0][0], position[0][1], position[1], position[2]))
      .sortBy((position) => position.symbol)
      .indexBy("id")
      .value()
      )
  }

  static loadPosition(id) {
    return Promise.all([CfdMarket.positions(id), CfdMarket.exercises(id)]).then(r => new Position(r[0], id, r[1]))
  }

  static execute(position) {
    return CfdMarket.execute(position.id)
  }

  static claim(position) {
    return CfdMarket.claim(position.id)
  }

  // static createOrder(collateral, symbol, long, priceLimit, timestampLimit) {
  //   return CfdMarket.createOrder(
  //       symbol,
  //       long,
  //       priceLimit,
  //       timestampLimit,
  //       {value: collateral * Math.pow(10, 18)}
  //     )
  // }

  // static cancel(id) {
  //   return CfdMarket.cancelOrder(id)
  // }

  // static trade(id) {
  //   return CfdMarket.trade(id)
  // }
}
