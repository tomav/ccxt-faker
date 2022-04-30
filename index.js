"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.faker = void 0;
const ccxt_tom = require("ccxt");

class faker extends ccxt_tom.Exchange {
    constructor() {
        super();
        this.mockMarkets = [
            { base: 'BTC', quote: 'USDC' },
            { base: 'ETH', quote: 'USDC' },
            { base: 'SOL', quote: 'USDC' }
        ];
        this.mockInstruments = {
            "result": [
                {"tick_size":"0.05","taker_commission":"0.0005","settlement_period":"perpetual","settlement_currency":"ETH","rfq":false,"quote_currency":"USD","price_index":"eth_usd","min_trade_amount":"1","max_liquidation_commission":"0.009","max_leverage":"50","maker_commission":"0.0","kind":"future","is_active":true,"instrument_name":"ETH/USDC","instrument_id":"210760","future_type":"reversed","expiration_timestamp":"32503708800000","creation_timestamp":"1552568454000","counter_currency":"USD","contract_size":"1","block_trade_commission":"0.0001","base_currency":"ETH"},
                {"tick_size":"0.5","taker_commission":"0.0005","settlement_period":"perpetual","settlement_currency":"BTC","rfq":false,"quote_currency":"USD","price_index":"btc_usd","min_trade_amount":"10.0","max_liquidation_commission":"0.0075","max_leverage":"50","maker_commission":"0.0","kind":"future","is_active":true,"instrument_name":"BTC/USDC","instrument_id":"210838","future_type":"reversed","expiration_timestamp":"32503708800000","creation_timestamp":"1534242287000","counter_currency":"USD","contract_size":"10.0","block_trade_commission":"0.0001","base_currency":"BTC"}
            ]
        };
        this.balances = {
            'BTC': { "free": 0.5, "used": 0, "total": 0.5 },
            'ETH': { "free": 9.5, "used": 0, "total": 9.5 },
            'USDC': { "free": 5000, "used": 0, "total": 5000 }
        };
    }

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'mock',
            'name': 'MockExchange',
            'comment': 'Mock Exchange for testing',
            'has': {
                'fetchMarkets': true,
                'fetchBalance': true,
                'fetchPosition': true,
                'createOrder': true,
                'cancelAllOrders': true
            }
        });
    }

    async publicGetGetInstruments() {
        return new Promise((resolve, reject) => {
            resolve(this.mockInstruments);
        });
    }

    async fetchMarkets(params = {}) {
        return new Promise((resolve, reject) => {
            const markets = this.createMockMarkets();
            resolve(markets);
        });
    }

    async fetchPosition(symbol, params = {}) {
        let position
        if (symbol === 'ETH/USDC') {
            position = {
                "jsonrpc": "2.0",
                "id": 2236,
                "result": []
            }
        } else {
            position = {
                "jsonrpc": "2.0",
                "id": 2236,
                "result": [
                    {
                        "average_price": 7440.18,
                        "delta": 0.006687487,
                        "direction": "buy",
                        "estimated_liquidation_price": 1.74,
                        "floating_profit_loss": 0,
                        "index_price": 7466.79,
                        "initial_margin": 0.000197283,
                        "instrument_name": symbol,
                        "kind": "future",
                        "leverage": 34,
                        "maintenance_margin": 0.000143783,
                        "mark_price": 7476.65,
                        "open_orders_margin": 0.000197288,
                        "realized_funding": -1e-8,
                        "realized_profit_loss": -9e-9,
                        "settlement_price": 7476.65,
                        "size": 50,
                        "size_currency": 0.006687487,
                        "total_profit_loss": 0.000032781
                    }
                ]
            }            
        }

        return new Promise((resolve, reject) => {
            resolve(position);
        });
    }

    async fetchBalance(params = {}) {
        return new Promise((resolve, reject) => {
            resolve(this.balances);
        });
    }
    async fetchTicker(symbol, params = {}) {
        return new Promise((resolve, reject) => {
            const currentDate = new Date();
            const tick = {
                symbol: 'RCC/BTC',
                timestamp: currentDate.getTime() / 1000,
                datetime: currentDate.toISOString(),
                high: 0.05,
                low: 0.01,
                bid: this.rccPrice,
                ask: this.rccPrice,
                info: {}
            };
            resolve(tick);
        });
    }

    async createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        return new Promise((resolve, reject) => {
            try {
                this.market(symbol);
            }
            catch (e) {
                reject(e);
            }
            const currentDate = new Date();
            const o = {
                id: this.createOrderId(),
                symbol: symbol,
                type: type,
                side: side,
                amount: amount,
                price: price,
                timestamp: currentDate.getTime() / 1000,
                datetime: currentDate.toISOString(),
                info: {},
                status: 'open',
                remaining: amount,
                cost: 0,
                fee: null,
                filled: 0,
                lastTradeTimestamp: 0,
                trades: []
            };
            resolve(o);
        });
    }


    async cancelAllOrders(id, symbol = undefined, params = {}) {
        return new Promise((resolve, reject) => {
            const o = {}
            o.status = 'canceled';
            resolve(o);
        });
    }

    createMockMarkets() {
        const markets = [];
        for (const m of this.mockMarkets) {
            const market = {
                id: `${m.base}${m.quote}`,
                symbol: `${m.base}/${m.quote}`,
                active: true,
                base: m.base,
                quote: m.quote,
                precision: { "base": 8, "quote": 8, "amount": 3, "price": 6 },
                limits: { "amount": { "min": 0.001, "max": 100000 }, "price": { "min": 0.000001, "max": 100000 }, "cost": { "min": 0.0001 }, "market": { "min": 0, "max": 10010.61492249 } }
            };
            markets.push(market);
        }
        return markets;
    }
    createOrderId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
exports.fake = faker;
