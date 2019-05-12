const moment = require('moment');
const { Dress } = require('../lib/mongo.js');

module.exports = {
  create: async (userId, coat, underwear, pants, shoes, date) => {
    const result = await Dress.create({
      userId,
      coat,
      underwear,
      pants,
      shoes,
      date,
    });
    return result;
  },
  findToday: async (userId) => {
    const date = moment().startOf('day');
    const result = await Dress.findOne({
      userId,
      date,
    })
      .populate('coat')
      .populate('underwear')
      .populate('pants')
      .populate('shoes');
    return result;
  },
  findCountOfUserDresses: async (userId) => {
    const result = await Dress.findOne({ userId }).countDocuments();
    return result;
  },
  /* *********************** */
  updateById: async (id, style, fl, fashion, color, size) => {
    const result = await Dress.updateOne(
      { _id: id },
      {
        $set: {
          style,
          fl,
          fashion,
          color,
          size,
        },
      },
    );
    return result;
  },
};
