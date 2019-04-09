const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const serve = require('koa-static');
const busboy = require('koa-busboy');
const router = require('./router');
const { logger } = require('./logger.js');
const { keys, port } = require('./config/config.js');
const adminInit = require('./middleware/adminInit');

adminInit();

const app = new Koa();

app.keys = keys;

app.use(
  busboy({
    dest: './public/img/clothes',
    fnDestFilename: (fieldname, filename) => filename,
  }),
);

app.use(serve('public'));

app.use(
  bodyParser({
    enableTypes: ['json', 'form'],
  }),
);

app.use(
  views(`${__dirname}/views`, {
    extension: 'ejs',
    map: {
      html: 'ejs',
    },
    options: {},
  }),
);

app.use(router.routes());

app.listen(port);
logger.info(`system start,listened on ${port}`);

app.on('error', (err) => {
  logger.error(err.message);
});
