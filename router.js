const Router = require('koa-router');
const user = require('./router/user/user');
const weather = require('./router/weather');
const dress = require('./router/dress');
const clothes = require('./router/clothes');

const router = new Router();

router.use('/user', user.routes(), user.allowedMethods());
router.use('/weather', weather.routes(), weather.allowedMethods());
router.use('/dress', dress.routes(), dress.allowedMethods());
router.use('/clothes', clothes.routes(), clothes.allowedMethods());

module.exports = router;
