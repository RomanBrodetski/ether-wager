pragma solidity ^0.4.8;

import "./vendor/oraclizeAPI.sol";

contract OracleUrls is usingOraclize{

    enum Oracles { Yahoo, CryptoUsd }

    function buildOracleUrl(string symbol, Oracles oracle) constant returns (string) {
        if (oracle == Oracles.Yahoo)
            return yahooOracleUrl(symbol);
        if (oracle == Oracles.CryptoUsd)
            return cryptocompareUsdOracleUrl(symbol);
        throw;
    }

    function yahooOracleUrl(string symbol) constant internal returns (string) {
        string memory url = strConcat(
            "https://query.yahooapis.com/v1/public/yql?q=select%20Ask,Bid%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22",
            symbol,
            "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="
        );

        return strConcat(
            "json(",
            url,
            ").query.results.quote.Ask"
        );
    }

    function cryptocompareUsdOracleUrl(string symbol) constant internal returns (string) {
        string memory url = strConcat(
            "https://min-api.cryptocompare.com/data/price?fsym=",
            symbol,
            "&tsyms=USD"
        );

        return strConcat(
            "json(",
            url,
            ").USD"
        );
    }
}
