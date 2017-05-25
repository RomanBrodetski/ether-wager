class YahooAPI {

  static requestPrice(symbol) {
    const url = `https://query.yahooapis.com/v1/public/yql?q=select%20Ask,Bid%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22${symbol}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=`
    return $.getJSON(url)
      .then((r) => {
        const o = r.query.results.quote
        return parseFloat(o.Ask);
      });
  }
}





