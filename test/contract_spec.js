var assert = require('assert');
var Embark = require('embark');
var EmbarkSpec = Embark.initTests();
var web3 = EmbarkSpec.web3;


function getAccount(number, callback) {
  web3.eth.getAccounts(function(e, r) {
    callback(r[number]);
  });
}

function createSampleFixedOrder(callback, leverage) {
  TestableCfdMarket.lastOrderId(function(e, id) {
    TestableCfdMarket.createOrder(
        "AAPL",
        0,
        true,
        leverage || 1,
        0,
        10000,
        0,
        {value: Math.pow(10, 18), gas: 300000},
        function(e, r) {
          assert.equal(e, null)
          callback(id.toNumber() + 1)
        }
      );
  });
}

function createSampleSpotOrder(callback) {
  TestableCfdMarket.lastOrderId(function(e, id) {
    TestableCfdMarket.createOrder(
        "AAPL",
        0,
        true,
        1,
        10500,
        0,
        0,
        {value: Math.pow(10, 18), gas: 300000},
        function(e, r) {
          assert.equal(e, null)
          callback(id.toNumber() + 1)
        });
  });
}

function createSamlpePosition(leverage, callback) {
  getAccount(4, function(anotherAccount) {
    createSampleFixedOrder(function(orderId) {
      TestableCfdMarket.trade(orderId, {value: Math.pow(10, 18), from: anotherAccount, gas: 500000}, function(e, r) {
        assert.equal(e, null);
        TestableCfdMarket.lastPositionId(function(e, pId) {
          assert.equal(e, null);
          callback(anotherAccount, pId.toNumber(), orderId)
        });
      });
    }, leverage);
  });
}

describe("TestableCfdMarket", function() {
  before(function(done) {
    var contractsConfig = {
      "TestableCfdMarket": {
        args: []
      }
    };
    EmbarkSpec.deployAll(contractsConfig, done)
  });

  it("should create a simple order properly", function(done) {
    createSampleFixedOrder(function(id) {
      console.log(id)
      TestableCfdMarket.orders(id, function(e, result) {
        assert.equal(web3.toUtf8(result[0].toString()), "AAPL");
        assert.equal(result[1].toNumber(), 0);
        assert.equal(result[2], true);
        assert.equal(result[3].toNumber(), Math.pow(10, 18));
        assert.equal(result[6].toNumber(), 10000);
        assert.equal(result[7].toNumber(), 0);
        assert.equal(result[8], web3.eth.defaultAccount);
        done()
      });
    });
  });

  it("should allow to cancel own order", function(done) {
    web3.eth.getBalance(TestableCfdMarket.address, function(e, initialBalance) {
      createSampleFixedOrder(function(id) {
        web3.eth.getBalance(TestableCfdMarket.address, function(e, balance) {
          assert(balance, initialBalance + Math.pow(10, 18));
          TestableCfdMarket.cancelOrder(id, function(e, result) {
            TestableCfdMarket.orders(id, function(e, result) {
              assert.equal(result[3].toNumber(), 0);
              web3.eth.getBalance(TestableCfdMarket.address, function(e, balance) {
                assert(balance, initialBalance);
                done()
              });
            });
          });
        });
      });
    });
  });

  it("should not allow to cancel other's order", function(done) {
    getAccount(4, function(anotherAccount) {
      createSampleFixedOrder(function(id) {
        web3.eth.getBalance(TestableCfdMarket.address, function(e, creaetedBalance) {
          TestableCfdMarket.cancelOrder(id, {from: anotherAccount}, function(e, result) {
            TestableCfdMarket.orders(id, function(e, result) {
              web3.eth.getBalance(TestableCfdMarket.address, function(e, balance) {
                assert.equal(balance.toNumber(), creaetedBalance.toNumber());
                assert.equal(web3.toUtf8(result[0].toString()), "AAPL");
                done()
              });
            });
          });
        });
      });
    });
  });

  it("should not allow to trade without collateral", function(done) {
    getAccount(4, function(anotherAccount) {
      createSampleFixedOrder(function(orderId) {
        TestableCfdMarket.trade(orderId, {value: Math.pow(10, 18) - 1, from: anotherAccount}, function(e, result) {
          assert.notEqual(e, null);
          TestableCfdMarket.orders(orderId, function(e, result) {
            assert.equal(web3.toUtf8(result[0].toString()), "AAPL");
            done()
          });
        });
      });
    });
  });


  it("spot order can be traded with", function(done) {
    getAccount(4, function(anotherAccount) {
      createSampleSpotOrder(function(orderId) {
        TestableCfdMarket.trade(orderId, {value: Math.pow(10, 18), from: anotherAccount, gas:500000}, function(e, result) {
          assert.equal(e, null);
          TestableCfdMarket.orders(orderId, function(e, result) {
            assert.equal(web3.toUtf8(result[0].toString()), "AAPL");
            TestableCfdMarket.orderOracleRequested(orderId, function(e, result) {
              assert.equal(result, true);
              TestableCfdMarket.oracleRequests(0x0, function(e, result) {
                assert.equal(result[0], false)
                assert.equal(result[1].toNumber(), orderId)
                assert.equal(result[2].toString(), anotherAccount)
                assert.equal(result[3].toNumber(), 10000)
                done()
              });
            });
          });
        });
      });
    });
  });


  it("spot order cannot be traded while waiting for oracle", function(done) {
    getAccount(4, function(anotherAccount) {
      createSampleSpotOrder(function(orderId) {
        TestableCfdMarket.trade(orderId, {value: Math.pow(10, 18), from: anotherAccount, gas:500000}, function(e, result) {
          assert.equal(e, null);
          TestableCfdMarket.trade(orderId, {value: Math.pow(10, 18), from: anotherAccount, gas:500000}, function(e, result) {
            assert.notEqual(e, null)
            done()
          });
        });
      });
    });
  });

  it("opening a valid position should delete an order", function(done) {
    createSamlpePosition(1, function(otherAcc, pId, oId) {
      TestableCfdMarket.orders(oId, function(e, result) {
        assert.equal(result[3].toNumber(), 0);
        done()
      });
    });
  });

  it("open position should be saved in positions array", function(done) {
    createSamlpePosition(1, function(otherAcc, pId, oId) {
      TestableCfdMarket.positions(pId, function(e, pos) {
        assert.equal(e, null)
        assert.equal(web3.toUtf8(pos[0].toString()), "AAPL");
        assert.equal(pos[2], otherAcc);
        assert.equal(pos[3], web3.eth.defaultAccount);
        done()
      });
    });
  });


  it("open position can be executed", function(done) {
    createSamlpePosition(1, function(otherAcc, pId, oId) {
      TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
        assert.equal(e, null)
        TestableCfdMarket.positionOracleRequested(pId, function(e, pos) {
          assert.equal(pos, true);
          done()
        });
      });
    });
  });

  it("position that is waiting for oracle response cannot be executed again", function(done) {
    createSamlpePosition(1, function(otherAcc, pId, oId) {
      TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
        assert.equal(e, null)
        TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
          assert.notEqual(e, null);
          done();
        });
      });
    });
  });

  it("callback computes positions properly if price got higher", function(done) {
    createSamlpePosition(1, function(otherAcc, pId, oId) {
      TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
        TestableCfdMarket.__callback(0x0, "120", {gas: 500000}, function(e, r) {
          assert.equal(e, null)
          TestableCfdMarket.exercises(pId, function(e, pos) {
            assert.equal(e, null)
            assert.equal(pos[0].toNumber(), 12000);
            assert.equal(pos[1].toString(), "1199999999999994000");
            assert.equal(pos[2].toString(), "799999999999996000");
            done();
          });
        });
      });
    });
  });

  it("callback computes positions properly if price got lower", function(done) {
    createSamlpePosition(1, function(otherAcc, pId, oId) {
      TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
        TestableCfdMarket.__callback(0x0, "55.0", {gas: 500000}, function(e, r) {
          TestableCfdMarket.exercises(pId, function(e, pos) {
            assert.equal(pos[0].toNumber(), 5500);
            assert.equal(pos[1].toString(), "549999999999997250");
            assert.equal(pos[2].toString(), "1449999999999992750");
            done();
          });
        });
      });
    });
  });

  it("callback computes positions properly if price got over the roof", function(done) {
    createSamlpePosition(1, function(otherAcc, pId, oId) {
      TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
        TestableCfdMarket.__callback(0x0, "550.00", {gas: 500000}, function(e, r) {
          TestableCfdMarket.exercises(pId, function(e, pos) {
            assert.equal(pos[0].toNumber(), 55000);
            assert.equal(pos[1].toString(), "1999999999999990000");
            assert.equal(pos[2].toString(), "0");
            done();
          });
        });
      });
    });
  });

  it("callback computes positions properly if price got to zero", function(done) {
    createSamlpePosition(1, function(otherAcc, pId, oId) {
      TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
        TestableCfdMarket.__callback(0x0, "0", {gas: 500000}, function(e, r) {
          TestableCfdMarket.exercises(pId, function(e, pos) {
            assert.equal(pos[0].toNumber(), 0);
            assert.equal(pos[1].toString(), "0");
            assert.equal(pos[2].toString(), "1999999999999990000");
            done();
          });
        });
      });
    });
  });

  it("callback computes positions properly with double the leverage", function(done) {
    createSamlpePosition(2, function(otherAcc, pId, oId) {
      TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
        TestableCfdMarket.__callback(0x0, "120.00", {gas: 500000}, function(e, r) {
          TestableCfdMarket.exercises(pId, function(e, pos) {
            assert.equal(pos[0].toNumber(), 12000);
            assert.equal(pos[1].toString(), "1399999999999993000");
            assert.equal(pos[2].toString(), "599999999999997000");
            done();
          });
        });
      });
    });
  });

  it("callback computes positions properly with triple the leverage", function(done) {
    createSamlpePosition(2, function(otherAcc, pId, oId) {
      TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
        TestableCfdMarket.__callback(0x0, "80.00", {gas: 500000}, function(e, r) {
          TestableCfdMarket.exercises(pId, function(e, pos) {
            assert.equal(pos[0].toNumber(), 8000);
            assert.equal(pos[1].toString(), "599999999999997000");
            assert.equal(pos[2].toString(), "1399999999999993000");
            done();
          });
        });
      });
    });
  });

  it("callback computes leveraged positions properly if price increased significantly", function(done) {
    createSamlpePosition(5, function(otherAcc, pId, oId) {
      TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
        TestableCfdMarket.__callback(0x0, "130.00", {gas: 500000}, function(e, r) {
          TestableCfdMarket.exercises(pId, function(e, pos) {
            assert.equal(pos[0].toNumber(), 13000);
            assert.equal(pos[1].toString(), "1999999999999990000");
            assert.equal(pos[2].toString(), "0");
            done();
          });
        });
      });
    });
  });

});
