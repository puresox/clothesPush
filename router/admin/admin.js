const Router = require('koa-router');
const adminModel = require('../../service/admin');
const { checkHasSignIn, checkNotSignIn } = require('../../middleware/adminCheck');
const { cookie } = require('../../config/config.js');

const router = new Router();

router
  .get('/signin', checkNotSignIn, async (ctx) => {
    await ctx.render('signin');
  })
  .post('/signin', checkNotSignIn, async (ctx) => {
    const { nickname, pw } = ctx.request.body;
    const user = await adminModel.findByNickname(nickname);
    if (!user || user.pw !== pw) {
      await ctx.redirect('back');
    } else {
      const { _id: userid } = user;
      ctx.cookies.set('id', userid, cookie);
      await ctx.redirect('/admin');
    }
  });

module.exports = router;
