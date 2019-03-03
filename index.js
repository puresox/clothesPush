const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const http = require('http');
const router = require('./router');
const { logger } = require('./logger.js');
const { keys, port } = require('./config/config.js');

const app = new Koa();
const server = http.createServer(app.callback());

app.keys = keys;

app.use(serve('public'));

app.use(
  bodyParser({
    enableTypes: ['json', 'form'],
  }),
);

app.use(router.routes());

server.listen(port);
logger.info(`system start,listened on ${port}`);

app.on('error', (err) => {
  logger.error(err.message);
});
