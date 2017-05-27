pragma solidity ^0.4.8;

contract EventfulMarket {

    event OracleRespond(
      uint id
    );

    event Claimed(
      uint id
    );

    event ExecutePosition(
        uint id
    );

    event CreateOrder(
        uint id
    );

    event CreatePosition(
        uint id
    );
}
