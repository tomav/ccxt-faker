const ccxt = require ('ccxt')
const ccxtFaker = require('./index.js');

;(async () => {
    const exchange = new ccxtFaker.fake({})

    while (true) {
        try {
            await exchange.loadMarkets ();
            break;
        } catch (e) {
            if (e instanceof ccxt.RequestTimeout)
                console.log (exchange.iso8601 (Date.now ()), e.constructor.name, e.message)
        }
    }

    try {
        let response
        response = await exchange.createOrder("BTC/USDC", "limit", "buy", 10, 30000);
        console.log (response);
        console.log ("------------------------------");
        response = await exchange.fetchBalance("ETH/USDC");
        console.log (response);
        console.log ("------------------------------");
        response = await exchange.fetchPosition("BTC/USDC");
        console.log (response);
        console.log ("------------------------------");
        response = await exchange.fetchPosition("ETH/USDC");
        console.log (response);
        console.log ("------------------------------");
    } catch (e) {
        console.log (Date.now (), e.constructor.name, e.message)
        console.log ('Failed');
    }

}) ()