const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const clotheModel = require('../service/clothe');
const getClothePalette = require('../opencv/opencv');

const { checkApi } = require('../middleware/userCheck');

const router = new Router();

router
  .post('/', checkApi, async (ctx) => {
    // 添加服装
    const { userId } = ctx;
    const {
      style, flMin, flMax, fashion, size,
    } = ctx.request.body;
    const imagePath = ctx.request.files[0].filename;
    const color = getClothePalette(imagePath);
    const clothe = await clotheModel.create(
      userId,
      imagePath,
      style,
      { max: flMax, min: flMin },
      fashion,
      color,
      size,
    );
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
  })
  .get('/:clotheId', checkApi, async (ctx) => {
    // 获取服装
    const { clotheId } = ctx.params;
    const clothe = await clotheModel.findById(clotheId);
    ctx.body = {
      success: true,
      msg: clothe,
    };
  })
  .del('/:clotheId', checkApi, async (ctx) => {
    // 删除服装
    const { clotheId } = ctx.params;
    const { imagePath } = await clotheModel.findByIdAndDelete(clotheId);
    const imageUrl = path.join(__dirname, `../public/img/clothes/${imagePath}`);
    fs.unlink(imageUrl, (err) => {
      if (err) throw err;
    });
    ctx.body = {
      success: true,
      msg: '删除成功',
    };
  })
  .put('/:clotheId', checkApi, async (ctx) => {
    // 修改服装
    const { clotheId } = ctx.params;
    const {
      style, flMin, flMax, fashion, size,
    } = ctx.request.body;
    await clotheModel.updateById(clotheId, style, { max: flMax, min: flMin }, fashion, size);
    ctx.body = {
      success: true,
      msg: '修改成功',
    };
  });

module.exports = router;
