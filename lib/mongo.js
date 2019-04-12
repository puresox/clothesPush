const mongoose = require('mongoose');
const { mongodb: mongodbUrl } = require('../config/config.js');

const { Schema } = mongoose;
mongoose.connect(
  mongodbUrl,
  { useNewUrlParser: true },
);
mongoose.set('useCreateIndex', true);

// 用户
exports.User = mongoose.model(
  'User',
  new Schema({
    openid: String,
    sessionId: String,
    avatarUrl: String,
    nickName: String,
  }),
);

// 管理员
exports.Admin = mongoose.model(
  'Admin',
  new Schema({
    // 密码
    pw: String,
    // 昵称
    nickname: {
      type: String,
      unique: true,
      index: true,
    },
    authority: [Number],
  }),
);

// 服装
exports.Clothe = mongoose.model(
  'Clothe',
  new Schema({
    // 所属用户
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    // 图片名
    imagePath: String,
    // 风格 ['另类', '新锐', '休闲', '文艺', '政商']
    style: String,
    // 温度 ['0℃以下', '0℃到10℃', '10℃到20℃', '20℃到30℃', '30℃以上']
    fl: String,
    // 款式 ['外套', '内搭', '裤子', '鞋子']
    fashion: String,
    // 颜色 ['红']
    color: String,
    // 版型 ['宽松', '合身', '修身']
    size: String,
  }),
);

// 搭配
exports.Dress = mongoose.model(
  'Dress',
  new Schema({
    // 所属用户
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    // 服装
    clothes: [{ type: Schema.Types.ObjectId, ref: 'Clothe' }],
    // 日期
    date: Date,
  }),
);
