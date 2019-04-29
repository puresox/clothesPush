const { Dress } = require('../lib/mongo.js');

module.exports = {
  create: async (userId, clothes, date) => {
    const result = await Dress.create({
      userId, clothes, date,
    });
    return result;
  },
  /* *********************** */
  findByFashion: async (userId, fashion) => {
    const result = await Dress.find({ userId, fashion });
    return result;
  },
  findByIdAndDelete: async (id) => {
    const result = await Dress.findByIdAndDelete(id);
    return result;
  },
  updateById: async (id, style, fl, fashion, color, size) => {
    const result = await Dress.updateOne({ _id: id }, {
      $set: {
        style, fl, fashion, color, size,
      },
    });
    return result;
  },
};
