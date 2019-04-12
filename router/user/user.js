const Router = require('koa-router');
const axios = require('axios');
const uuidv1 = require('uuid/v1');
const userModel = require('../../service/user');
const { checkApi } = require('../../middleware/userCheck');
const { AppId, AppSecret } = require('../../config/config.js');

const router = new Router();

router
  .post('/signin', async (ctx) => {
    // 登录
    const { code } = ctx.request.body;
    const loginUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${AppId}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`;
    const { data } = await axios.get(loginUrl, { timeout: 3000 });
    const { openid } = data;
    const user = await userModel.findByOpenid(openid);
    if (!user) {
      const sessionId = uuidv1();
      await userModel.create(openid, sessionId);
      ctx.body = {
        success: true,
        sessionId,
      };
    } else {
      ctx.body = {
        success: true,
        sessionId: user.sessionId,
      };
    }
  })
  .put('/', checkApi, async (ctx) => {
    // 更新用户信息
    const { userId } = ctx;
    const { avatarUrl, nickName } = ctx.request.body;
    await userModel.updateById(userId, avatarUrl, nickName);
    ctx.body = {
      success: true,
      sessionId: '更新成功',
    };
  });

module.exports = router;
