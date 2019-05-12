const mongoose = require('mongoose');
const { mongodb: mongodbUrl } = require('../config/config.js');

const { Schema } = mongoose;
mongoose.connect(mongodbUrl, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

// 用户
exports.User = mongoose.model(
  'User',
  new Schema({
    openid: String,
    sessionId: String,
    avatarUrl: String,
    nickName: String,
    // 用户适中的颜色熵
    mediumColorEntropy: { type: Number, default: 120 },
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
    // 温度 ['0℃以下', '0℃', '5℃', '10℃', '15℃', '20℃', '25℃', '30℃', '30℃以上']
    fl: {
      max: String,
      min: String,
    },
    // 款式 ['外套', '内搭', '裤子', '鞋子']
    fashion: String,
    // 颜色
    color: {
      labPalette: [
        {
          x: Number,
          y: Number,
          z: Number,
          rate: String,
        },
      ],
      rgbPalette: [
        {
          x: Number,
          y: Number,
          z: Number,
          rate: String,
        },
      ],
    },
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
    // 外套
    coat: { type: Schema.Types.ObjectId, ref: 'Clothe' },
    // 内搭
    underwear: { type: Schema.Types.ObjectId, ref: 'Clothe' },
    // 裤子
    pants: { type: Schema.Types.ObjectId, ref: 'Clothe' },
    // 鞋子
    shoes: { type: Schema.Types.ObjectId, ref: 'Clothe' },
    // 日期
    date: Date,
  }),
);
