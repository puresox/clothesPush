const { Clothe } = require('../lib/mongo.js');

module.exports = {
  create: async (userId, imagePath, style, fl, fashion, color, size) => {
    const result = await Clothe.create({
      userId, imagePath, style, fl, fashion, color, size,
    });
    return result;
  },
  findByFashion: async (userId, fashion) => {
    const result = await Clothe.findOne({ userId, fashion });
    return result;
  },
  /** ********************* */
  updateInfoById: async (id, info) => {
    const result = await Clothe.updateOne({ _id: id }, { $set: info });
    return result;
  },
};
