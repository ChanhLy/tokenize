const Koa = require('koa');
const Router = require('@koa/router');
const app = new Koa();
const { Server } = require('socket.io');
const http = require('http');
const axios = require('axios').default;
const serve = require('koa-static');
app.use(serve('./dist'));

const server = http.createServer(app.callback());
const io = new Server(server, {
  allowEIO3: true,
  cors: { credentials: true, origin: 'http://localhost:3001' },
});

let interval;
io.on('connection', (socket) => {
  interval = setInterval(() => {
    getBinanceData(socket);
  }, 1000);
  socket.on('disconnecting', () => {
    clearInterval(interval);
  })
  getBinanceData(socket);
});

server.listen(3000);

function getBinanceData(socket) {
  axios
    .get('https://api.binance.com/api/v3/depth', { params: { symbol: 'ETHBTC', limit: 1 } })
    .then((response) => {
      const { data } = response;
      let bidLimit = 5;
      let sizeLimit = 150;
      
      bidLimit = bidLimit - Number(data.bids[0][0]) * Number(data.bids[0][1]);

      for (let i = 1; i < 10; i++) {
        const lastBidPrice = data.bids[i - 1][0];
        const lastAskPrice = data.asks[i - 1][0];
        const bid = Number(lastBidPrice) - (Math.random() / 1000000);
        const ask = Number(lastAskPrice) + (Math.random() / 1000000);

        const bidPrize = String(bid).slice(0, 10);
        const bidSize = String(Math.random()).slice(0, 10);

        const askPrize = String(ask).slice(0, 10);
        const askSize = String(Math.random() * 10).slice(0, 10);

        bidLimit = bidLimit - Number(bidPrize) * Number(bidSize);
        
        sizeLimit = sizeLimit - Number(askSize);

        data.bids[i] = [];
        data.bids[i][0] = bidPrize;
        data.bids[i][1] = bidSize;


        data.asks[i] = [];
        data.asks[i][0] = askPrize;
        data.asks[i][1] = askSize;
      }

      data.totalBids = 5 - bidLimit;
      data.totalAsks = 150 - sizeLimit;

      socket.emit('ETHBTC', data);
    });
}
