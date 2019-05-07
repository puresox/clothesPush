const Router = require('koa-router');
const moment = require('moment');
const clotheModel = require('../service/clothe');
const dressModel = require('../service/dress');
const { checkApi } = require('../middleware/userCheck');

const router = new Router();

router
  .get('/dressed', checkApi, async (ctx) => {
    const { userId } = ctx;
    const todayDress = await dressModel.findToday(userId);
    ctx.body = {
      success: true,
      msg: todayDress,
    };
  })
  .get('/today', checkApi, async (ctx) => {
    // 请求今日搭配
    const { styleIndex, fl } = ctx.request.query;
    const { userId } = ctx;
    const flIndex = clotheModel.fl2flIndex(fl);
    // 筛选服装
    const coat = await clotheModel.findByFashionFilter12(userId, '0', styleIndex, flIndex);
    const underwear = await clotheModel.findByFashionFilter12(userId, '1', styleIndex, flIndex);
    const pants = await clotheModel.findByFashionFilter12(userId, '2', styleIndex, flIndex);
    const shoes = await clotheModel.findByFashionFilter12(userId, '3', styleIndex, flIndex);
    // 遍历生成搭配候选集
    const dresses = [];
    coat.forEach((acoat) => {
      underwear.forEach((aunderwear) => {
        pants.forEach((apants) => {
          shoes.forEach((ashoes) => {
            dresses.push({
              coat: acoat,
              underwear: aunderwear,
              pants: apants,
              shoes: ashoes,
            });
          });
        });
      });
    });
    // 计算颜色熵
    dresses.forEach((dress) => {
      const { colorScore, colorEntropy } = clotheModel.getColorScore(dress);
      dress.colorScore = colorScore;
      dress.colorEntropy = colorEntropy;
    });
    // 降序排序
    dresses.sort((a, b) => b.colorScore - a.colorScore);
    ctx.body = {
      success: true,
      msg: dresses,
    };
  })
  .post('/', checkApi, async (ctx) => {
    const { dress } = ctx.request.body;
    const { userId } = ctx;
    const date = moment().startOf('day');
    const {
      coat: { _id: coatId },
      underwear: { _id: underwearId },
      pants: { _id: pantsId },
      shoes: { _id: shoesId },
    } = dress;
    await dressModel.create(userId, coatId, underwearId, pantsId, shoesId, date);
    // 获取今日是否搭配
    ctx.body = {
      success: true,
      msg: {},
    };
  });

module.exports = router;
