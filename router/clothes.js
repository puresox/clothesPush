const Router = require('koa-router');
const clotheModel = require('../service/clothe');

const { checkApi } = require('../middleware/userCheck');

const router = new Router();

router
  .post('/', checkApi, async (ctx) => {
    // 服装上传
    const { userId } = ctx;
    const {
      style, fl, fashion, color, size,
    } = ctx.request.body;
    const imagePath = ctx.request.files[0].fieldname;
    const clothe = await clotheModel.create(userId, imagePath, style, fl, fashion, color, size);
    ctx.body = {
      success: true,
      msg: clothe.id,
    };
  })
  .get('/', checkApi, async (ctx) => {
    // 获取服装列表
    const { userId } = ctx;
    const coat = await clotheModel.findByFashion(userId, '0');
    const underwear = await clotheModel.findByFashion(userId, '1');
    const pants = await clotheModel.findByFashion(userId, '2');
    const shoes = await clotheModel.findByFashion(userId, '3');
    ctx.body = {
      success: true,
      msg: {
        coat,
        underwear,
        pants,
        shoes,
      },
    };
  });

module.exports = router;
