const Router = require('koa-router');
const axios = require('axios');
const { checkApi } = require('../middleware/userCheck');
const { key } = require('../config/config.js');

const router = new Router();

router
  .post('/now', checkApi, async (ctx) => {
    // 获取当前天气
    const { latitude, longitude } = ctx.request.body;
    const url = `https://free-api.heweather.net/s6/weather/now?location=${latitude},${longitude}&key=${key}`;
    const { data } = await axios.get(url, { timeout: 3000 });
    const {
      HeWeather6: [{
        now,
      }],
    } = data;
    if (now.wind_dir.split('').pop() !== '风') {
      now.wind_dir += '风';
    }
    ctx.body = {
      success: true,
      msg: now,
    };
  });

module.exports = router;
