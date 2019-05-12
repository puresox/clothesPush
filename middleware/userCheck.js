const { findBySessionId } = require('../service/user');

module.exports = {
  checkApi: async (ctx, next) => {
    const { sessionid } = ctx.request.header;
    const user = await findBySessionId(sessionid);
    if (user) {
      ctx.userId = user.id;
      ctx.userInfo = user;
      await next();
    } else {
      ctx.body = {
        success: false,
        msg: '用户验证错误',
      };
    }
  },
};
