var assert = require('assert');
var Embark = require('embark');
var EmbarkSpec = Embark.initTests();
var web3 = EmbarkSpec.web3;


function getAccount(number, callback) {
  web3.eth.getAccounts(function(e, r) {
    callback(r[number]);
  });
}

function createSampleFixedOrder(callback) {
  TestableCfdMarket.lastOrderId(function(e, id) {
    TestableCfdMarket.createOrder(
        "AAPL",
        0,
        true,
        false,
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

function createSamlpePosition(callback) {
  getAccount(4, function(anotherAccount) {
    createSampleFixedOrder(function(orderId) {
      TestableCfdMarket.trade(orderId, {value: Math.pow(10, 18), from: anotherAccount, gas: 500000}, function(e, r) {
        TestableCfdMarket.lastPositionId(function(e, pId) {
          assert.equal(e, null);
          callback(anotherAccount, pId.toNumber(), orderId)
        });
      });
    });
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
        assert.equal(result[0].toString(), "AAPL");
        assert.equal(result[1].toNumber(), 0);
        assert.equal(result[2], true);
        assert.equal(result[3].toNumber(), Math.pow(10, 18));
        assert.equal(result[4].toNumber(), 10000);
        assert.equal(result[5].toNumber(), 0);
        assert.equal(result[6], web3.eth.defaultAccount);
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
              assert.equal(result[0].toString(), "");
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
                assert.equal(result[0].toString(), "AAPL");
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
            assert.equal(result[0].toString(), "AAPL");
            done()
          });
        });
      });
    });
  });

  it("opening a valid position should delete an order", function(done) {
    createSamlpePosition(function(otherAcc, pId, oId) {
      TestableCfdMarket.orders(oId, function(e, result) {
        assert.equal(result[0].toString(), "");
        done()
      });
    });
  });

  it("open position should be saved in positions array", function(done) {
    createSamlpePosition(function(otherAcc, pId, oId) {
      TestableCfdMarket.positions(pId, function(e, pos) {
        assert.equal(pos[0].toString(), "AAPL");
        assert.equal(pos[2], otherAcc);
        assert.equal(pos[3], web3.eth.defaultAccount);
        done()
      });
    });
  });


  it("open position can be executed", function(done) {
    createSamlpePosition(function(otherAcc, pId, oId) {
      TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
        TestableCfdMarket.positions(pId, function(e, pos) {
          assert.equal(pos[8], true);
          assert.equal(pos[9].toNumber(), 10000);
          done()
        });
      });
    });
  });

  it("position that is waiting for oracle response cannot be executed again", function(done) {
    createSamlpePosition(function(otherAcc, pId, oId) {
      TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
        TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
          assert.notEqual(e, null);
          done();
        });
      });
    });
  });

  it("callback computes positions properly if price got higher", function(done) {
    createSamlpePosition(function(otherAcc, pId, oId) {
      TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
        TestableCfdMarket.__callback(0x1, "120", {gas: 500000}, function(e, r) {
          TestableCfdMarket.positions(pId, function(e, pos) {
            assert.equal(pos[7], true);
            assert.equal(pos[10].toNumber(), 12000);
            assert.equal(pos[11].toString(), "1199999999999994000");
            assert.equal(pos[12].toString(), "799999999999996000");
            done();
          });
        });
      });
    });
  });

  it("callback computes positions properly if price got lower", function(done) {
    createSamlpePosition(function(otherAcc, pId, oId) {
      TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
        TestableCfdMarket.__callback(0x1, "55.0", {gas: 500000}, function(e, r) {
          TestableCfdMarket.positions(pId, function(e, pos) {
            assert.equal(pos[7], true);
            assert.equal(pos[10].toNumber(), 5500);
            assert.equal(pos[11].toString(), "549999999999997250");
            assert.equal(pos[12].toString(), "1449999999999992750");
            done();
          });
        });
      });
    });
  });

  it("callback computes positions properly if price got over the roof", function(done) {
    createSamlpePosition(function(otherAcc, pId, oId) {
      TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
        TestableCfdMarket.__callback(0x1, "550.00", {gas: 500000}, function(e, r) {
          TestableCfdMarket.positions(pId, function(e, pos) {
            assert.equal(pos[7], true);
            assert.equal(pos[10].toNumber(), 55000);
            assert.equal(pos[11].toString(), "1999999999999990000");
            assert.equal(pos[12].toString(), "0");
            done();
          });
        });
      });
    });
  });

  it("callback computes positions properly if price got to zero", function(done) {
    createSamlpePosition(function(otherAcc, pId, oId) {
      TestableCfdMarket.execute(pId, {gas: 500000}, function(e, r) {
        TestableCfdMarket.__callback(0x1, "0", {gas: 500000}, function(e, r) {
          TestableCfdMarket.positions(pId, function(e, pos) {
            assert.equal(pos[7], true);
            assert.equal(pos[10].toNumber(), 0);
            assert.equal(pos[11].toString(), "0");
            assert.equal(pos[12].toString(), "1999999999999990000");
            done();
          });
        });
      });
    });
  });

});
